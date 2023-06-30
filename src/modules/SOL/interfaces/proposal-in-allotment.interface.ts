import { MutableObject } from "src/shared/interfaces/mutable-object.interface";
import { ProposalModel } from "../models/proposal.model";

export interface ProposalInAllotmentInterface {
    proposal: MutableObject<ProposalModel>;
    proposalWin: boolean;
}

export interface updateProposalInAllotmentInterface extends ProposalInAllotmentInterface {
    allomentId: string;
  }