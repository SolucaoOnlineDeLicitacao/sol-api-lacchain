import { ApiProperty } from "@nestjs/swagger";
import { PushNotificationInterface } from "../interfaces/push-notification.interface";

export abstract class PushNotificationTokenKeyDto {

    @ApiProperty()
    p256dh: string;

    @ApiProperty()
    auth: string;

}

export abstract class PushNotificationTokenRegisterDto {

    @ApiProperty()
    enpoint: string;

    @ApiProperty()
    expirationTime: string;

    @ApiProperty()
    keys: PushNotificationTokenKeyDto;

}

export abstract class NotificationSubscribeDto {

    @ApiProperty()
    token: string;

}
