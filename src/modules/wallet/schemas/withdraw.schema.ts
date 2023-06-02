import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { WithdrawStatusEnum } from "../enums/withdraw-status.enum";
import { User } from "./user.schema";

@Schema({ timestamps: true, collection: Withdraw.name.toLowerCase() })
export class Withdraw {

    @Prop({ required: true, type: String })
    value: string;

    @Prop({ required: true, type: String, enum: Object.keys(WithdrawStatusEnum) })
    status: string;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    user: User;
}

export const WithdrawSchema = SchemaFactory.createForClass(Withdraw);