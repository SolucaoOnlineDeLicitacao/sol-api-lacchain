import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Proposal } from "../schemas/proposal.schema";
import { ProposalModel } from "../models/proposal.model";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";
import { ProposalSupplierAcceptUpdateDto } from "../dtos/proposal-accept-supplier-updatet.dto";
import { ProposalAssociationAcceptUpdateDto } from "../dtos/proposal-accept-association-updatet.dto";
import { ProposalWinRequestDto } from "../dtos/proposal-win-request.dto";
import { ProposalRefusedRequestDto } from "../dtos/proposal-refused-request.dto";
import { ProposalAcceptedRequestDto } from "../dtos/proposal-accepted-request.dto";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { ProposalUpdateValues } from "../dtos/proposal-update-values-request.dto";

@Injectable()
export class ProposalRepository {

    constructor(
        @InjectModel(Proposal.name) private readonly _model: Model<ProposalModel>,
    ) { }

    async register(dto: ProposalRegisterDto): Promise<ProposalModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async addItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $push: {
                item_list: dto.item_list,

            }
        }, { new: true });
    }

    async removeItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $pull: {
                item_list: dto.item_list,

            }
        }, { new: true });
    }

    async updateStatus(_id: string, dto: ProposalStatusUpdateDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                status: dto.status,
            }
        }, { new: true });
    }

    async updateAcceptSupplier(_id: string, dto: ProposalSupplierAcceptUpdateDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                supplier_accept: dto.supplier_accept,

            }
        }, { new: true });
    }

    async updateAcceptAssociation(_id: string, dto: ProposalAssociationAcceptUpdateDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                association_accept: dto.association_accept,

            }
        }, { new: true });
    }

    async updateProposedWin(_id: string, dto: ProposalWinRequestDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                proposalWin: dto.proposalWin,

            }
        }, { new: true });
    }

    async updateListProposedWin(_ids: string[], dto: ProposalWinRequestDto): Promise<void> {
        await this._model.updateMany({ _id: { $in: _ids } }, {
            $set: {
                proposalWin: dto.proposalWin,

            }
        }, { new: true });
    }

    async refusedProposal(_id: string, dto: ProposalRefusedRequestDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                refusedBecaused: dto.refusedBecaused,
                refusedBy: dto.refusedBy,
                status: dto.status,
                refusedAt: dto.refusedAt
            }
        }, { new: true });
    }

    async acceptForFornecedorProposal(_id: string, dto: ProposalAcceptedRequestDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                acceptedFornecedorAt: dto.acceptAt,
                acceptedFornecedor: dto.acceptBy,
                status: dto.status,
                association_accept: true
            }
        }, { new: true });
    }

    async acceptForRevisorProposal(_id: string, dto: ProposalAcceptedRequestDto): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                acceptedRevisorAt: dto.acceptAt,
                acceptedRevisor: dto.acceptBy,
                status: dto.status,
                supplier_accept: true
            }
        }, { new: true });
    }

    async listNonDeleted(): Promise<ProposalModel[]> {
        return await this._model.find({ deleted: false });
    }

    async listByBid(bidId: string): Promise<ProposalModel[]> {
        const proposals = await this._model.find({ bid: { _id: bidId } }).populate('proposedBy').populate({path:'proposedBy', populate:'supplier'}).populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment').sort({ total_value: "descending" });
        // const sortedProposals = proposals.sort((a, b) => Number(a.total_value) - Number(b.total_value));
        return proposals;
    }

    async listByUser(proposedById: string): Promise<ProposalModel[]> {
        const proposals = await this._model.find({ proposedBy: { _id: proposedById } }).populate('proposedBy').populate('allotment');
        return proposals
    }

    async listByBidsWaiting(bidId: string): Promise<ProposalModel[]> {
        const proposals = await this._model.find({ bid: { _id: bidId } }).populate('proposedBy').populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment');
        if (proposals.length > 1) {
            const sortedProposals = proposals.sort((a, b) => Number(a.total_value) - Number(b.total_value));
            let response = []
            for (let iterator of sortedProposals) {
                if (iterator.status === ProposalStatusEnum['aguardando1'] || iterator.status === ProposalStatusEnum['aguardando2']) {
                    response.push(iterator)
                }
            }
            return response;
        } else {

            return proposals

        }
    }

    async getProposalWin(bidId: string): Promise<ProposalModel> {
        const list = await this._model.find({ bid: { _id: bidId } });
        const sortedProposals = list.sort((a, b) => Number(a.total_value) - Number(b.total_value)).filter(el => el.status === ProposalStatusEnum['aguardando1'] || el.status === ProposalStatusEnum['aguardando2']);
        return sortedProposals[0]
    }

    async list(): Promise<ProposalModel[]> {
        return await this._model.find().populate('proposedBy').populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment')

    }

    async getById(_id: string): Promise<ProposalModel> {
        return await this._model.findOne({ _id }).populate('proposedBy').populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment')
    }

    async deleteById(_id: string) {
        return await this._model.findByIdAndUpdate({ _id }, { $set: { deleted: true } }, { new: true });
    }

    async updateValues(_id: string, dto: ProposalUpdateValues): Promise<ProposalModel> {
        return await this._model.findOneAndUpdate(
            { _id },
            { $set: { total_value: dto.total_value, freight: dto.freight } },
            { new: true }
        );
    }

    async listProposalByUserSupplier(_id: string): Promise<ProposalModel[]> {
        // return await this._model.find({proposedBy: {supplier: {_id:_id}}})
        return await this._model.find().populate('proposedBy').populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment').populate('bid')
    }

    async listProposalByBidTie(bidId: string): Promise<ProposalModel[]> {
        return await this._model.find({ bid: { _id: bidId }, proposalWin:true }).populate('proposedBy').populate('refusedBy').populate('acceptedFornecedor').populate('acceptedRevisor').populate('allotment').populate('bid')
    }

}