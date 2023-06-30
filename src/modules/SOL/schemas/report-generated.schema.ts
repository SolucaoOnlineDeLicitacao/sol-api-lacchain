import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";


@Schema({ timestamps: true, collection: ReportGenerated.name.toLowerCase() })
export class ReportGenerated {

    @Prop({ required: true, type: String })
    situation: string;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    archive: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    generatedBy: User;

}
export const ReportGeneratedSchema = SchemaFactory.createForClass(ReportGenerated);
