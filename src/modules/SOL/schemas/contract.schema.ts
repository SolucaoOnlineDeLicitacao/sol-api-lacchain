import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { User } from "./user.schema";
import mongoose from "mongoose";
import { Bids } from "./bids.schema";
import { boolean } from "yargs";
import { Supplier } from "./supplier.schema";
import { Proposal } from "./proposal.schema";

@Schema({ timestamps: true, collection: Contract.name.toLowerCase() })
export class Contract {

    @Prop({ type: Number, default: 0 })
    sequencial_number: number;

    @Prop({ type: String })
    contract_number: string;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: Bids.name })
    bid_number: Bids;

    @Prop({ required: true, type: Boolean })
    association_accept: boolean;

    @Prop({ required: true, type: Boolean })
    supplier_accept: boolean;

    @Prop({ required: false, type: String })
    association_sign_date: string;

    @Prop({ required: false, type: String })
    supplier_sign_date: string;

    @Prop({ required: true, type: String })
    contract_document: string;

    @Prop({ required: true, type: String })
    value: string;

    @Prop({ required: false, type: Boolean, default: false })
    deleted: boolean;

    @Prop({ required: true, enum: Object.keys(ContractStatusEnum), default: ContractStatusEnum.aguardando_assinaturas })
    status: ContractStatusEnum;

    @Prop({ required: false, type:[{type: mongoose.Schema.Types.ObjectId, ref: Proposal.name}] })
    proposal_id: Proposal[];

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: Supplier.name })
    supplier_id: Supplier;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    association_id: User;

    @Prop({ type: Number })
    items_received: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);