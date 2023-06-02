import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AirdropUpdateRequestDto } from "../dtos/airdrop-update-request.dto";
import { AgreementpModel } from "../models/agreement.model";
import { UserModel } from "../models/user.model";
import { Agreement } from "../schemas/agreement.schema";

@Injectable()
export class AgreementRepository
 {

    constructor(
        @InjectModel(Agreement.name) private readonly _model: Model<AgreementpModel>,
    ) { }

    async findById(id: string): Promise<AgreementpModel> {
        return await this._model.findOne({ _id: id })
   
    }

    async deleteById(id: string): Promise<AgreementpModel> {
        return await this._model.findByIdAndDelete({ _id: id })
   
    }

    async register(dto: AgreementRegisterRequestDto): Promise<AgreementpModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async findAll(): Promise<AgreementpModel[]> {
        return await this._model.find()

    }

    async update(id: string, dto: AgreementRegisterRequestDto): Promise<AgreementpModel> {
        return await this._model.findByIdAndUpdate({ _id: id }, {
            $set: {
                register_number: dto.register_number,
                register_object: dto.register_object,
                status: dto.status,
                city: dto.city,  
                value: dto.value,  
                validity_date: dto.validity_date,  
                signature_date: dto.signature_date,  
                associate_name: dto.associate_name,  
                reviewer: dto.reviewer,  
                work_plan: dto.work_plan,    
            }
        }, {new: true});
    }
}