import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "src/modules/wallet/schemas/user.schema";
import { PixConfirmationStatus } from "../dtos/pix-confirmation-status";

@Schema({ timestamps: true, collection: PixConfirmation.name.toLowerCase() })
export class PixConfirmation {

    @Prop({ required: true, type: String })
    pixValue: string;

    @Prop({ required: true, type: String })
    pixVoucher: string;

    @Prop({ required: true, type: String })
    tokenValue: string;

    @Prop({ required: true, type: String, enum: Object.keys(PixConfirmationStatus) })
    status: PixConfirmationStatus;

    @Prop({ required: false, type: String })
    comment: string;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    user: User;
}

export const PixConfirmationSchema = SchemaFactory.createForClass(PixConfirmation);