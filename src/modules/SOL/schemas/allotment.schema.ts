import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Items, ItemsSchema } from "./items.schema";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";

@Schema({ timestamps: true, collection: Allotment.name.toLowerCase() })
export class Allotment {
  @Prop({ required: false, type: String })
  allotment_name: string;

  @Prop({ required: false, type: String })
  days_to_delivery: string;

  @Prop({ required: false, type: String })
  place_to_delivery: string;

  @Prop({ required: false, type: String })
  quantity: string;

  @Prop({ required: false, type: String })
  files: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.keys(AllotmentStatusEnum),
    default: AllotmentStatusEnum.rascunho,
  })
  status: AllotmentStatusEnum;

  @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Items.name })
  add_item: Items[];
}

export const AllotmentSchema = SchemaFactory.createForClass(Allotment);
