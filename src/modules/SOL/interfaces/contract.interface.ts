import { ContractStatusEnum } from "../enums/contract-status.enum";
import { BidModel } from "../models/bid.model";
import { ProposalModel } from "../models/proposal.model";
import { SupplierModel } from "../models/supplier.model";
import { UserModel } from "../models/user.model";

export interface ContractInterface {

    readonly sequencial_number: number;
    readonly contract_number: string;
    readonly bid_number: BidModel;
    readonly supplier_accept: ContractStatusEnum;
    readonly association_accept: ContractStatusEnum;

    readonly deleted: boolean;
    readonly contract_document: string
    readonly value: string;
    readonly status: ContractStatusEnum;

    readonly association_sign_date: string;

    readonly supplier_sign_date: string;

    readonly proposal_id: ProposalModel[];

    readonly supplier_id: SupplierModel;

    readonly association_id: UserModel;

    readonly items_received: number;

    readonly createdAt: Date;

}