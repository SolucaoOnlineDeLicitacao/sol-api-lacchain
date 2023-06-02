import { HttpException, Injectable, Logger } from "@nestjs/common";
import * as admin from "firebase-admin";
import { App, initializeApp } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import * as path from "path";
import { NotificationSubscribeDto } from "../dtos/notification-subscribe.dto";
import { PushNotificationTopicEnum } from "../enums/push-notifications-topic.enum";
import { PushNotificationSendInterface } from "../interfaces/push-notification-send.interface";
import { PushNotificationInterface } from "../interfaces/push-notification.interface";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class FirebaseService {

    private app: App;
    private messaging: Messaging;

    private readonly _logger = new Logger(FirebaseService.name);

    constructor(
        private readonly userRepository: UserRepository
    ) {
        const serviceAcc = require(path.join(process.cwd(), 'config/push-notifications/google-service-account-credentials.json'));
        this.app = initializeApp({ credential: admin.credential.cert(serviceAcc) });
        this.messaging = getMessaging(this.app);
    }

    async subscribeClientToTopic(dto: NotificationSubscribeDto, topic: PushNotificationTopicEnum, userId: string) {
        await this.userRepository.addDeviceToken(dto.token, userId);
        try {
            await this.messaging.subscribeToTopic(dto.token, topic);
            this._logger.debug(`subscribed token ${dto.token.slice(dto.token.length - 6, dto.token.length - 1)} to topic ${topic}`);
        } catch (error) {
            throw new HttpException('Failed to subscribe client to topic.', 500);
        }
    }

    async unsubscribeClientFromTopic(dto: NotificationSubscribeDto, topic: PushNotificationTopicEnum, userId: string) {

        try {
            await this.userRepository.removeDeviceToken(dto.token, userId);
            await this.messaging.unsubscribeFromTopic(dto.token, topic);

            this._logger.debug(`unsubscribed token ${dto.token.slice(dto.token.length - 6, dto.token.length - 1)} to topic ${topic}`);

        } catch (error) {
            throw new HttpException('Failed to unsubscribe client from topic.', 500);
        }
    }

    async sendNotification(message: PushNotificationSendInterface, topic: PushNotificationTopicEnum) {

        const messageResponse = await this.messaging.sendToTopic(topic, {
            data: {
                category: message.category,
                title: message.title,
                body: message.body,
                link: message.link,
            }
        }, {
            priority: 'normal',
        });

        return messageResponse;
    }

    async sendNotificationToUserDevices(message: PushNotificationSendInterface, tokens: string[]) {

        const messageResponse = await this.messaging.sendToDevice(tokens, {
            data: {
                category: message.category,
                title: message.title,
                body: message.body,
                link: message.link,
            }
        }, {
            priority: 'normal',
        });

        return messageResponse;
    }
}
