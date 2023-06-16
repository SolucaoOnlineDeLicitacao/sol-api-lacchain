import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User, UserSchema } from "./user.schema";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { Allotment } from "./allotment.schema";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { Proposal } from "./proposal.schema";
import { Agreement } from "./agreement.schema";
import { Supplier } from "./supplier.schema";

@Schema({ timestamps: true, collection: Bids.name.toLowerCase() })
export class Bids {

  @Prop({ required: true, type: String })
  bid_count: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Agreement.name })
  agreement: Agreement;

  @Prop({ required: true, type: String })
  classification: string;

  @Prop({ required: true, type: String })
  start_at: string;

  @Prop({ required: true, type: String })
  end_at: string;

  @Prop({ required: true, type: String })
  days_to_tiebreaker: string;

  @Prop({ required: true, type: String })
  days_to_delivery: string;

  @Prop({ required: false, type: Array })
  proposal_list: string[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted: boolean;

  @Prop({ required: true, type: String })
  local_to_delivery: string;

  @Prop({ required: true, enum: Object.keys(BidTypeEnum) })
  bid_type: BidTypeEnum;

  @Prop({ required: true, enum: Object.keys(BidModalityEnum) })
  modality: BidModalityEnum;

  @Prop({ required: true, default: BidStatusEnum.draft, enum: Object.keys(BidStatusEnum) })
  status: BidStatusEnum;

  @Prop({ required: false, type: String })
  aditional_site: string;

  @Prop({ required: false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Allotment.name }], remove: true })
  add_allotment: Allotment[];

  @Prop({ required: false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Supplier.name }]})
  invited_suppliers: Supplier[];

  @Prop({ required: false, type: String })
  editalFile: string;

  @Prop({ required: false, type: String})
  ataFile: string;

}

export const BidsSchema = SchemaFactory.createForClass(Bids);
