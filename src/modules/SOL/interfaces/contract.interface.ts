import { ContractStatusEnum } from "../enums/contract-status.enum";

export interface ContractInterface {

    readonly contract_number: string;
    readonly bid_number: string;

    readonly supplier_id: string;

    readonly deleted: boolean;
    readonly contract_document: string
    readonly value: string;
    readonly status: ContractStatusEnum;

    readonly proposal_id: string[];
   

}