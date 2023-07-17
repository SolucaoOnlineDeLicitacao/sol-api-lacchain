import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReportGenerated } from "../schemas/report-generated.schema";
import { Model } from "mongoose";
import { ReportGeneratedModel } from "../models/report-generated.model";
import { ReportGeneratedRegisterRequestDto } from "../dtos/report-generated-register-request.dto";

@Injectable()
export class ReportRepository {

    constructor(
        @InjectModel(ReportGenerated.name) private readonly _model: Model<ReportGeneratedModel>,
    ) { }

    async register(dto: ReportGeneratedRegisterRequestDto): Promise<any> {
        const data = await new this._model(dto);
        return data.save();
    }

    async list(): Promise<ReportGeneratedModel[]> {
        return await this._model
            .find()
            .populate("generatedBy")
    }

    async getById(_id: string): Promise<ReportGeneratedModel> {
        return await this._model
            .findById({ _id })
    }
}