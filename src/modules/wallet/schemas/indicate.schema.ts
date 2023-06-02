import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";

@Schema({ timestamps: true, collection: Indicate.name.toLowerCase() })
export class Indicate {

    @Prop({ required: true, type: String })
    code: string;

    @Prop({ required: true, type: String })
    transactionId: string;

    @Prop({ required: true, unique: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: User;
}

export const IndicateSchema = SchemaFactory.createForClass(Indicate);