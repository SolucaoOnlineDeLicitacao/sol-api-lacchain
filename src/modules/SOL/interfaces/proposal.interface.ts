import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { AllotmentModel } from "../models/allotment.model";
import { BidModel } from "../models/bid.model";
import { UserInterface } from "./user.interface";

export interface ProposalInterface {

    readonly total_value: string;
    readonly status: ProposalStatusEnum;
    readonly deleted: boolean;
    readonly item_list: string[];
    readonly bid: BidModel;
    readonly allotment: AllotmentModel;
    readonly file: string;

    readonly association_accept: boolean;
    readonly supplier_accept: boolean;
    readonly proposalWin: boolean;
    readonly refusedBecaused: string;
    readonly refusedBy: UserInterface;
    readonly proposedBy: UserInterface;
    readonly acceptedRevisor: UserInterface;
    readonly acceptedFornecedor: UserInterface;
    readonly acceptedFornecedorAt: Date;
    readonly acceptedRevisorAt: Date;
    readonly refusedAt: Date;
}