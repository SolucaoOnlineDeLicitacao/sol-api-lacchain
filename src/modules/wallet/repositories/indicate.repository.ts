import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IndicateRegisterRequestDto } from "../dtos/indicate-register-request.dto";
import { IndicateModel } from "../models/indicate.model";
import { Indicate } from "../schemas/indicate.schema";

@Injectable()
export class IndicateRepository {

    constructor(
        @InjectModel(Indicate.name) private readonly _model: Model<IndicateModel>,
    ) { }

    async register(dto: IndicateRegisterRequestDto): Promise<IndicateModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async listByUser(userId: string): Promise<IndicateModel[]> {
        return await this._model
            .find({ userId }) .populate('user');
    }

}