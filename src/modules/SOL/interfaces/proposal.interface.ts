import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export interface ProposalInterface {

    readonly total_value: string;
    readonly status: ProposalStatusEnum;
    readonly deleted: boolean;
    readonly item_list: string[];
   
}