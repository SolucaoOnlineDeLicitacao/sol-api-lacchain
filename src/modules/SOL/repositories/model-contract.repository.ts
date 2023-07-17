import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ModelContract } from "../schemas/model-contract.schemay";
import { ModelContractRegisterDto } from "../dtos/model-contract-register-request.dto";
import { ModelContractUpdateDto } from "../dtos/model-contract-update-request.dto";
import { ModelContractModel } from "../models/model-contract.model";
import { ModelContractClassificationEnum } from "../enums/modelContract-classification.enum";

@Injectable()
export class ModelContractRepository {

    constructor(
        @InjectModel(ModelContract.name) private readonly _model: Model<ModelContractModel>,
    ) { }

    async register(dto: ModelContractRegisterDto): Promise<ModelContractModel> {

        const data = await new this._model(dto);
        return data.save();
    }

    async update(_id: string, dto: ModelContractUpdateDto): Promise<ModelContractModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                name: dto.name,
                status: dto.status,
                classification: dto.classification,
                contract: dto.contract,
                language: dto.language,
            }
        }, {new: true });
    }

    async list(): Promise<ModelContractModel[]> {
        return await this._model.find();
    }

    async getById(_id: string): Promise<ModelContractModel> {
        return await this._model.findOne({ _id });
    }

    async getByBidId(_id: string): Promise<ModelContractModel> {
        return await this._model.findOne({ bid: _id });
    }

    async getByClassification(classification: string): Promise<ModelContractModel> {
        return await this._model.findOne({ classification: classification });
    }

    async deleteById(_id: string) {
        return await this._model.deleteOne({ _id }, {new: true});
    }

    async getByContractAndLanguage(lang:string, classification:ModelContractClassificationEnum): Promise<ModelContractModel> {
        return await this._model.findOne({ classification: classification, language: lang });
    }

}