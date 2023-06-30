import { Proposal } from "../schemas/proposal.schema";
import { Items } from "../schemas/items.schema";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";
import { ProposalInAllotmentInterface } from "./proposal-in-allotment.interface";

export interface AllotmentInterface {

    readonly allotment_name: string;
    readonly days_to_delivery: string;

    readonly place_to_delivery: string;
    
    readonly status: AllotmentStatusEnum ;

    readonly quantity: string;
    readonly files: string;
    readonly add_item: Items[];
    proposals: ProposalInAllotmentInterface[];
   

}