import { ContractStatusEnum } from "../enums/contract-status.enum";
import { User } from "../schemas/user.schema";

export interface ContractInterface {

    readonly sequencial_number: number;
    readonly contract_number: string;
    readonly bid_number: string;
    readonly supplier_accept: ContractStatusEnum;
    readonly association_accept: ContractStatusEnum;

    readonly deleted: boolean;
    readonly contract_document: string
    readonly value: string;
    readonly status: ContractStatusEnum;

    readonly association_sign_date: string;

    readonly supplier_sign_date: string;

    readonly proposal_id: string[];

    readonly supplier_id: User;

    readonly association_id: User;


}