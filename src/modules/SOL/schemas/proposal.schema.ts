import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { Bids } from "./bids.schema";
import * as mongoose from 'mongoose';
import { Allotment } from "./allotment.schema";
import { User } from "./user.schema";
import { ValueForAllotmentInterface } from "../interfaces/value-for-allotment.interface";

@Schema({ timestamps: true, collection: Proposal.name.toLowerCase() })
export class Proposal {

    @Prop({ required: false, type: String })
    total_value: string;

    @Prop({ required: true, type: Boolean, default: false })
    association_accept: boolean;

    @Prop({ required: true, type: Boolean, default: false })
    supplier_accept: boolean;

    @Prop({ required: true, type: Boolean, default: false })
    reviewer_accept: boolean;

    @Prop({ required: true, enum: Object.keys(ProposalStatusEnum), default: ProposalStatusEnum.aguardando1 })
    status: ProposalStatusEnum;

    @Prop({ required: true, type: Boolean, default: false })
    deleted: boolean;

    @Prop({ required: false, type: Array })
    item_list: string[];

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: Bids.name })
    bid: Bids;

    @Prop({ required: false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Allotment.name }] })
    allotment: Allotment[];

    @Prop({ required: false, type: String })
    file: string;

    @Prop({ required: true, default: false, type: Boolean })
    proposalWin: boolean;

    @Prop({ required: false, type: String })
    refusedBecaused: string;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    refusedBy: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    proposedBy: User;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    acceptedRevisor: User;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    acceptedFornecedor: User;

    @Prop({ required: false, type: Date })
    acceptedFornecedorAt: Date;

    @Prop({ required: false, type: Date })
    acceptedRevisorAt: Date;

    @Prop({ required: false, type: Date })
    refusedAt: Date;

    @Prop({ required: false, type: Number })
    freight: number;

    @Prop({ required: false, type: [{ type: mongoose.Schema.Types.Array }] })
    totalValueForAllotment: ValueForAllotmentInterface[];
}

export const ProposaltSchema = SchemaFactory.createForClass(Proposal);