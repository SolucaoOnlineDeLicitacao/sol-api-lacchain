import { Injectable } from "@nestjs/common";
import { AssociationModel } from "../models/association.model";
import { Association } from "../schemas/association.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { Bids } from "../schemas/bids.schema";
import { BidModel } from "../models/bid.model";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";

@Injectable()
export class BidRepository {

    constructor(
        @InjectModel(Bids.name) private readonly _model: Model<BidModel>,
    ) { }

    async register(dto: BideRegisterDto): Promise<any> {
        const data = await new this._model(dto);
        return data.save();
    }

    async update(_id: string, dto: BidUpdateDto): Promise<BidModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                description: dto.description,
                agreement: dto.agreement,
                classification: dto.classification,
                start_at: dto.start_at,
                end_at: dto.end_at,
                days_to_tiebreaker: dto.days_to_tiebreaker,
                days_to_delivery: dto.days_to_delivery,
                local_to_delivery: dto.local_to_delivery,
                status: dto.status,
                aditional_site: dto.aditional_site,
                add_allotment: dto.add_allotment,
                invited_suppliers: dto.invited_suppliers
            }
        }, { new: true });
    }

    async updateStatus(_id: string, dto: BidUpdateStatusRequestDto): Promise<BidModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                status: dto.status,
                proofreader: dto.proofreader
            }
        }, { new: true });
    }

    async listNonDeletedBids(): Promise<BidModel[]> {
        return await this._model.find({ deleted: false });
    }

    async list(): Promise<BidModel[]> {
        return await this._model.find()
            .populate('association')
            .populate('proofreader')
    }

    async getById(_id: string): Promise<BidModel> {
        return await this._model.findOne({ _id })
            .populate('association')
            .populate('proofreader')
    }



    async deleteById(_id: string) {
        return await this._model.findByIdAndUpdate({ _id }, { $set: { deleted: true } }, { new: true });
    }

}