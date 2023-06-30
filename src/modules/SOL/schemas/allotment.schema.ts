import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Items, ItemsSchema } from "./items.schema";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";
import { ProposalInAllotmentInterface } from "../interfaces/proposal-in-allotment.interface";
import { Proposal } from "./proposal.schema";
import { ProposalModel } from "../models/proposal.model";

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

  @Prop({ required: false, type: mongoose.Schema.Types.Array })
  proposals: ProposalInAllotmentInterface[];

  // @Prop({
  //   required: false,
  //   type: [
  //     {
  //       proposalWin: { type: Boolean, required: true, default: false },
  //       proposal: { type: mongoose.Schema.Types.ObjectId, ref: Proposal.name, required: true },
  //     },
  //   ],
  // })
  // proposals: Array<{ proposalWin: boolean; proposal: ProposalModel }>;
}

export const AllotmentSchema = SchemaFactory.createForClass(Allotment);
