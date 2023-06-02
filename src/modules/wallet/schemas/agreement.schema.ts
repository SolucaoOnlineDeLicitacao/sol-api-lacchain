import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "./user.schema";

@Schema({ timestamps: true, collection: Agreement.name.toLowerCase() })
export class Agreement {

    @Prop({ required: true, type: String })
    register_number: string;

    @Prop({ required: true, type: String })
    register_object: string;

    @Prop({ required: true, type: String })
    status: string;

    @Prop({ required: true, type: String })
    city: string;

    @Prop({ required: true, type: String })
    value: string;

    @Prop({ required: true, type: String })
    signature_date: string;

    @Prop({ required: true, type: String })
    validity_date: string;

    @Prop({ required: true, type: String })
    associate_name: string;
    
    @Prop({ required: true, type: String })
    states: string

    @Prop({ required: true, type: String })
    reviewer: string;

    @Prop({ required: true, type: String })
    work_plan: string[];
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);