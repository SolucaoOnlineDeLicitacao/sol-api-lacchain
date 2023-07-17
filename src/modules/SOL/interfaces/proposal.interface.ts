import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { AllotmentModel } from "../models/allotment.model";
import { BidModel } from "../models/bid.model";
import { UserModel } from "../models/user.model";
import { UserInterface } from "./user.interface";
import { ValueForAllotmentInterface } from "./value-for-allotment.interface";

export interface ProposalInterface {

    readonly total_value: string;
    readonly status: ProposalStatusEnum;
    readonly deleted: boolean;
    readonly item_list: string[];
    readonly bid: BidModel;
    readonly allotment: AllotmentModel[];
    readonly file: string;

    readonly association_accept: boolean;
    readonly supplier_accept: boolean;
    readonly reviewer_accept: boolean;
    readonly proposalWin: boolean;
    readonly refusedBecaused: string;
    readonly refusedBy: UserModel;
    readonly proposedBy: UserModel;
    readonly acceptedRevisor: UserModel;
    readonly acceptedFornecedor: UserModel;
    readonly acceptedFornecedorAt: Date;
    readonly acceptedRevisorAt: Date;
    readonly refusedAt: Date;
    readonly freight: number;

    readonly totalValueForAllotment?: ValueForAllotmentInterface[];
}