import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User, UserSchema } from "./user.schema";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { Allotment } from "./allotment.schema";
import { BidStatusEnum } from "../enums/bid-status.enum";

@Schema({ timestamps: true, collection: Bids.name.toLowerCase() })
export class Bids {

    @Prop({ required: true, type: String })
    bid_count: string;

    @Prop({ required: true, type: String })
    description: string;

    @Prop({ required: true, type: String })
    agreement: string;

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

    @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Allotment.name })
    add_allotment: Allotment;

    @Prop({ required: false, type: Array })
    invited_suppliers: string[];

    // @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    // association: User;

    // @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    // proofreader: User;

}

export const BidsSchema = SchemaFactory.createForClass(Bids);