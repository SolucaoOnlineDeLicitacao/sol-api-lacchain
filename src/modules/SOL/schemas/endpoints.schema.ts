import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { EndPointsStatusEnum } from "../enums/endpoints-status.enum";
import { EndPointsTypeEnum } from "../enums/endpoints-type.enum";

@Schema({ timestamps: true, collection: EndPoints.name.toLowerCase() })
export class EndPoints {

    @Prop({ required: true, type: String })
    endpointPath: string;

    @Prop({ required: true, type: String })
    token: string;

    @Prop({ required: true, type: String })
    frequency: string;

    @Prop({ required: false, type: Date, default: null })
    lastRun: Date;

    @Prop({ required: true, enum: Object.keys(EndPointsStatusEnum), default: EndPointsStatusEnum.stopped })
    status: EndPointsStatusEnum;

    @Prop({ required: true, enum: Object.keys(EndPointsTypeEnum), })
    endpointType: EndPointsTypeEnum;

    @Prop({ required: false, type:String})
    messageError: string;

}

export const EndPointsSchema = SchemaFactory.createForClass(EndPoints);