import { Body, Controller, HttpCode, HttpException, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../../shared/dtos/response.dto";
import { JwtAuthGuard } from "../../../shared/guards/jwt-auth.guard";
import { NotificationSubscribeDto } from "../dtos/notification-subscribe.dto";
import { PushNotificationTopicEnum } from "../enums/push-notifications-topic.enum";
import { FirebaseService } from "../services/firebase.service";

@ApiTags('push-notification')
@Controller('push-notification')
export class PushNotificationsController {

    constructor(
        private readonly _fireBaseService: FirebaseService,
    ) { }

    @Post('subscribe/topic/:topic')
    @ApiParam({
        enum: PushNotificationTopicEnum,
        name: 'topic',
        required: true
    })
    @HttpCode(201)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async subscribeToTopic(
        @Body() dto: NotificationSubscribeDto,
        @Param('topic') topic: PushNotificationTopicEnum,
        @Req() request
    ) {

        try {

            await this._fireBaseService.subscribeClientToTopic(dto, topic, request.user.userId);
            return new ResponseDto(true, null, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('unsubscribe/topic/:topic')
    @ApiParam({
        enum: PushNotificationTopicEnum,
        name: 'topic',
        required: true
    })
    @HttpCode(201)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async unsubscribeFromTopic(
        @Body() dto: NotificationSubscribeDto,
        @Param('topic') topic: PushNotificationTopicEnum,
        @Req() request
    ) {

        try {

            await this._fireBaseService.unsubscribeClientFromTopic(dto, topic, request.user.userId);
            return new ResponseDto(true, null, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
