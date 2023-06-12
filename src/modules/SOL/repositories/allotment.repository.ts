import { Injectable } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Allotment } from "../schemas/allotment.schema";
import { AllotmentModel } from "../models/allotment.model";
import { AllotmentRegisterDto } from "../dtos/allotment-register-request.dto";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { AllotAddProposalDto } from "../dtos/allotment-add-proposal-request.dto";
import { ItemRequestDto } from "../dtos/item-register-request.dto";

@Injectable()
export class AllotmentRepository {

    constructor(
        @InjectModel(Allotment.name) private readonly _model: Model<AllotmentModel>,
    ) { }
 
    async register(dto: AllotmentRegisterDto): Promise<AllotmentModel> {

        const data = await new this._model(dto[0]);
       
        return data.save();
    }

    async list(): Promise<AllotmentModel[]> {
        
        const list =   await this._model.find();

        return list
    }

    async listById(_id: string): Promise<AllotmentModel> {
        
        const list =   await this._model.findOne({ _id });
        console.log('list: ', list)
        return list
    }

    async updateProposal(_id: string, dto: AllotAddProposalDto): Promise<AllotmentModel> {
        const item = await this._model.findOneAndUpdate({ _id }, {
            $push: {
                proposals: dto
            }
        }, { new: true });
        return item
    }

    // bid 6487084ebd6de8fd94b40fe1

    // lote 6487084ebd6de8fd94b40fdf

    async updateItem(_id: string, dto: ItemRequestDto): Promise<AllotmentModel> {
        const item = await this._model.findOneAndUpdate({ _id }, {
            $push: {
                add_item: dto
            }
        }, { new: true });
        return item
    }



    // async deleteById(_id: string) {
    //     return await this._model.findByIdAndUpdate({ _id }, { $set: { deleted: true } }, { new: true });
    // }

}