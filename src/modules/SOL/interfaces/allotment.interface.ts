import { Proposal } from "../schemas/proposal.schema";
import { Items } from "../schemas/items.schema";

export interface AllotmentInterface {

    readonly allotment_name: string;
    readonly days_to_delivery: string;

    readonly place_to_delivery: string;

    readonly quantity: string;
    readonly files: string;
    readonly proposals: Proposal[];
    readonly add_item: Items[];
   

}