import { ProposalModel } from "../models/proposal.model";

export abstract class ProposalInAllotmentRequestDto {
    proposal: ProposalModel;
    proposalWin: boolean;
}