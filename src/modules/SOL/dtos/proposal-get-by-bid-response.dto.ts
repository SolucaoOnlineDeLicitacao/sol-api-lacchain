import { BidModel } from "../models/bid.model";
import { ProposalModel } from "../models/proposal.model";

export class ProposalGetByBidResponseDto {
    constructor(
        public proposals: ProposalModel[],
        public bid: BidModel
    ) { }

}