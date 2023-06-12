import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PushNotificationKey, PushNotificationKeySchema } from "./push-notification-keys.schema";

@Schema({ _id: false })
export class PushNotification {

    @Prop({ type: String })
    endpoint: string;

    @Prop({ type: String })
    expirationTime: string;

    @Prop({ type: PushNotificationKeySchema })
    keys: PushNotificationKey;

}
export const PushNotificationSchema = SchemaFactory.createForClass(PushNotification);