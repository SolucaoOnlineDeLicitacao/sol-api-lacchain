import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserModel } from "../models/user.model";

import { Supplier } from "../schemas/supplier.schema";
import { SupplierModel } from "../models/supplier.model";
import { SupplierRegisterDto } from "../dtos/supplier-register-request.dto";
import { SupplierUpdateStatusDto } from "../dtos/supplier-update-status-request.dto";
import { SupplierGroupIdUpdateDto } from "../dtos/supplier-group-id-update.dto";

@Injectable()
export class SupplierRepository {

    constructor(
        @InjectModel(Supplier.name) private readonly _model: Model<SupplierModel>,
    ) { }

    async register(dto: SupplierRegisterDto): Promise<SupplierModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async list(): Promise<SupplierModel[]> {
        const data = await  this._model.find();
       return data
    }

    async listById(_id: string): Promise<SupplierModel> {
        const data = await  this._model.findOne({_id});
       return data
    }

    async findByIdAndUpdate(_id: string, dto: SupplierRegisterDto): Promise<SupplierModel> {
        const data = await  this._model.findByIdAndUpdate({_id}, {$set: {
            name: dto.name,
            cpf: dto.cpf,
            type: dto.type,
            address: dto.address,
            legal_representative: dto.legal_representative,

        } }, { new: true });
       return data
    }

    async findByIdAndUpdateStatus(_id: string, dto: SupplierUpdateStatusDto): Promise<SupplierModel> {
        const data = await  this._model.findByIdAndUpdate({_id}, {$set: {
            blocked: dto.blocked,
            blocked_reason: dto.blocked_reason,
            
        } }, { new: true });
       return data
    }

    async findByIdAndAddGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        const data = await  this._model.findByIdAndUpdate({_id}, {$push: {
            group_id: dto.group_id,
            
        } }, { new: true });
       return data
    }

    async findByIdAndRemoveGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        const data = await  this._model.findByIdAndUpdate({_id}, {$pull: {
            group_id: dto.group_id,
            
        } }, { new: true });
       return data
    }

   
    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

}
