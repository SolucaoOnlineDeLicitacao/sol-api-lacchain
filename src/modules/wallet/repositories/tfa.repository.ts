import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TfaRegisterRequestDto } from "../dtos/tfa-register-request.dto";
import { TfaModel } from "../models/tfa.model";
import { Tfa } from "../schemas/tfa-schema";

@Injectable()
export class TfaRepository {

    constructor(
        @InjectModel(Tfa.name) private readonly _model: Model<TfaModel>,
    ) { }

    async save(dto: TfaRegisterRequestDto): Promise<TfaModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async getByUserId(userId: string): Promise<TfaModel> {
        return await this._model.findOne({ 'user': userId });
    }

    async delete(userId: string): Promise<TfaModel> {
        const tfa = await this._model.findOne({ 'user': userId });
        return await this._model.findByIdAndDelete(tfa._id);
    }
}