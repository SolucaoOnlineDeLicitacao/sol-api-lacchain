import { ContractStatusEnum } from "../enums/contract-status.enum";
import { Bids } from "../schemas/bids.schema";
import { User } from "../schemas/user.schema";
import { ProposalInterface } from "./proposal.interface";

export interface ContractInterface {

    readonly sequencial_number: number;
    readonly contract_number: string;
    readonly bid_number: Bids;
    readonly supplier_accept: ContractStatusEnum;
    readonly association_accept: ContractStatusEnum;

    readonly deleted: boolean;
    readonly contract_document: string
    readonly value: string;
    readonly status: ContractStatusEnum;

    readonly association_sign_date: string;

    readonly supplier_sign_date: string;

    readonly proposal_id: ProposalInterface;

    readonly supplier_id: User;

    readonly association_id: User;

    readonly items_received: number;

}