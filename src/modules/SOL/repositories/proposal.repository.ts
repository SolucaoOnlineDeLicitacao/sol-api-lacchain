import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Proposal } from "../schemas/proposal.schema";
import { ProposalModel } from "../models/proposal.model";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";

@Injectable()
export class ProposalRepository {

    constructor(
        @InjectModel(Proposal.name) private readonly _model: Model<ProposalModel>,
    ) { }

    async register(dto: ProposalRegisterDto): Promise<any> {
        const data = await new this._model(dto);
        return data.save();
    }

    // async update(_id: string, dto: BidUpdateDto): Promise<BidModel> {
    //     return await this._model.findOneAndUpdate({ _id }, {
    //         $set: {
    //             description: dto.description,
    //             agreement: dto.agreement,
    //             classification: dto.classification,
    //             start_at: dto.start_at,
    //             end_at: dto.end_at,
    //             days_to_tiebreaker: dto.days_to_tiebreaker,
    //             days_to_delivery: dto.days_to_delivery,
    //             local_to_delivery: dto.local_to_delivery,
    //             status: dto.status,
    //             aditional_site: dto.aditional_site,
    //             add_allotment: dto.add_allotment,
    //             invited_suppliers: dto.invited_suppliers
    //         }
    //     }, { new: true });
    // }

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

    async listNonDeleted(): Promise<ProposalModel[]> {
        return await this._model.find({ deleted: false });
    }

    async list(): Promise<ProposalModel[]> {
        return await this._model.find()

    }

    async getById(_id: string): Promise<ProposalModel> {
        return await this._model.findOne({ _id })
    }



    async deleteById(_id: string) {
        return await this._model.findByIdAndUpdate({ _id }, { $set: { deleted: true } }, { new: true });
    }

}