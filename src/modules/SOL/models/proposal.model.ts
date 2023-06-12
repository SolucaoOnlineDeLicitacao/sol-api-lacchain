import { Document } from "mongoose";

import { ProposalInterface } from "../interfaces/proposal.interface";

export interface ProposalModel extends ProposalInterface, Document{
}