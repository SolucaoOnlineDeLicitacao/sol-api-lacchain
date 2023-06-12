import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class PushNotificationKey {

    @Prop()
    p256dh: string;

    @Prop()
    auth: string;

}
export const PushNotificationKeySchema = SchemaFactory.createForClass(PushNotificationKey);