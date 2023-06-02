import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ZiFeeTypeEnum } from "../enums/zi-fee-type.enum";

@Schema({ timestamps: true, collection: ZiFee.name.toLowerCase() })
export class ZiFee {

    @Prop({ required: true, type: String, unique: true })
    name: string;

    @Prop({ required: true, enum: Object.keys(ZiFeeTypeEnum) })
    type: string;

    @Prop({ required: true })
    value: number;
}
export const ZiFeeSchema = SchemaFactory.createForClass(ZiFee);