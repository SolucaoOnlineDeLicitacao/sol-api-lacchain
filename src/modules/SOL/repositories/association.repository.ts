import { Injectable } from "@nestjs/common";
import { AssociationModel } from "../models/association.model";
import { Association } from "../schemas/association.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";

@Injectable()
export class AssociationRepository {

    constructor(
        @InjectModel(Association.name) private readonly _model: Model<AssociationModel>,
    ) { }

    async register(dto: AssociationRegisterRequestDto): Promise<AssociationModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async update(_id: string, dto: AssociationUpdateRequestDto): Promise<AssociationModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                cnpj: dto.cnpj,
                name: dto.name,
                'address.zipCode' : dto.address.zipCode,
                'address.publicPlace' : dto.address.publicPlace,
                'address.neighborhood' : dto.address.neighborhood,
                'address.city' : dto.address.city,
                'address.state' : dto.address.state,
                'address.latitude' : dto.address.latitude,
                'address.longitude' : dto.address.longitude,
                'address.complement' : dto.address.complement,
                'address.referencePoint' : dto.address.referencePoint,
                'address.number' : dto.address.number,
                'legalRepresentative.name' : dto.legalRepresentative.name,
                'legalRepresentative.nationality' : dto.legalRepresentative.nationality,
                'legalRepresentative.maritalStatus' : dto.legalRepresentative.maritalStatus,
                'legalRepresentative.cpf' : dto.legalRepresentative.cpf,
                'legalRepresentative.rg' : dto.legalRepresentative.rg,
                'legalRepresentative.validityData' : dto.legalRepresentative.validityData,
                'legalRepresentative.address.zipCode' : dto.legalRepresentative.address.zipCode,
                'legalRepresentative.address.publicPlace' : dto.legalRepresentative.address.publicPlace,
                'legalRepresentative.address.neighborhood' : dto.legalRepresentative.address.neighborhood,
                'legalRepresentative.address.city' : dto.legalRepresentative.address.city,
                'legalRepresentative.address.state' : dto.legalRepresentative.address.state,
                'legalRepresentative.address.latitude' : dto.legalRepresentative.address.latitude,
                'legalRepresentative.address.longitude' : dto.legalRepresentative.address.longitude,
                'legalRepresentative.address.complement' : dto.legalRepresentative.address.complement,
                'legalRepresentative.address.referencePoint' : dto.legalRepresentative.address.referencePoint,
                'legalRepresentative.address.number' : dto.legalRepresentative.address.number
            }
        });
    }

    async list(): Promise<AssociationModel[]> {
        return await this._model.find();
    }

    async getById(_id: string): Promise<AssociationModel> {
        const result = await this._model.findOne({ _id });
        return result;
    }

    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

    async getByCnpj(cnpj: string): Promise<AssociationModel> {
        return await this._model.findOne({ cnpj });
    }

}