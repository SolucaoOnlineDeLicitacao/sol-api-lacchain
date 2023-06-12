import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ContractStatusEnum } from "../enums/contract-status.enum";

@Schema({ timestamps: true, collection: Contract.name.toLowerCase() })
export class Contract {

    @Prop({ required: true, type: String })
    contract_number: string;

    @Prop({ required: true, type: String })
    bid_number: string;

    @Prop({ required: true, type: String })
    supplier_id: string;

    @Prop({ required: true, type: String })
    contract_document: string;

    @Prop({ required: true, type: String })
    value: string;

    @Prop({ required: false, type: Boolean, default: false })
    deleted: boolean;

    @Prop({ required: true, enum: Object.keys(ContractStatusEnum), default:ContractStatusEnum.aguardando_assinaturas })
    status: ContractStatusEnum;

    @Prop({ required: true, type: Array })
    proposal_id: string[];

}

export const ContractSchema = SchemaFactory.createForClass(Contract);