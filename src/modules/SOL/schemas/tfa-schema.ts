import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "./user.schema";

@Schema({ timestamps: true, collection: Tfa.name.toLowerCase() })
export class Tfa {

    @Prop({ required: true, type: String })
    secret: string;

    @Prop({ required: true, type: String })
    url: string;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    user: User;
}

export const TfaSchema = SchemaFactory.createForClass(Tfa);