import { Injectable } from "@nestjs/common";
import { CostItemsModel } from "../models/cost-items.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CostItems } from "../schemas/cost-items.schema";
import { CostItemsRegisterRequestDto } from "../dtos/cost-items-register-request.dto";
import { CostItemsUpdateRequestDto } from "../dtos/cost-items-update-request.dto";

@Injectable()
export class CostItemsRepository {

    constructor(
        @InjectModel(CostItems.name) private readonly _model: Model<CostItemsModel>
    ) { }

    async register(dto: CostItemsRegisterRequestDto): Promise<CostItemsModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async list(): Promise<CostItemsModel[]> {
        return await this._model.find()
        .populate('category')
        .populate('product');
    }

    async getById(_id: string): Promise<CostItemsModel> {
        return await this._model.findOne({_id})
        .populate('category')
        .populate('product');
    }

    async update(_id: string, dto: CostItemsUpdateRequestDto): Promise<CostItemsModel[]> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                code: dto.code,
                name: dto.name,
                phone: dto.name,
                unitMeasure: dto.unitMeasure,
                category: dto.category,
                product: dto.product,
                specification: dto.specification,
                product_relation: dto.product_relation
            }
        });
    }

    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

    async listByIds(ids:string[]){
        return await this._model.find({_id: {$in: ids}})
        .populate('category')
        .populate('product');
    }

    async getByName(name:string){
        return await this._model.findOne({name: name})
        .populate('category')
        .populate('product');
    }

}