import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contract } from "../schemas/contract.schema";
import { ContractModel } from "../models/contract.model";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";

@Injectable()
export class ContractRepository {

    constructor(
        @InjectModel(Contract.name) private readonly _model: Model<ContractModel>,
    ) { }

    async register(dto: ContractRegisterDto): Promise<ContractModel> {

        const data = await new this._model(dto);
        return data.save();
    }

    async updateStatus(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                status: dto.status,
            }
        }, {new: true });
    }

    async list(): Promise<ContractModel[]> {
        return await this._model.find();
    }

    async listNonDeleted(): Promise<ContractModel[]> {
        return await this._model.find({delete: false});
    }

    async getById(_id: string): Promise<ContractModel> {
        return await this._model.findOne({ _id });
    }

    async deleteById(_id: string) {
        return await this._model.findByIdAndUpdate({ _id }, {$set: {
            delete: true
        }}, {new: true});
    }

}