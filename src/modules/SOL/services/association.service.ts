import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AssociationRepository } from "../repositories/association.repository";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationModel } from "../models/association.model";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";

@Injectable()
export class AssociationService {

    private readonly _logger = new Logger(AssociationService.name);

    constructor(
        private readonly _associationRepository: AssociationRepository,
    ) { }

    async register(dto: AssociationRegisterRequestDto): Promise<any> {

        const result = await this._associationRepository.register(dto);
        if (!result)
            throw new BadRequestException('Email não encontrado!');

        return result;

    }

    async update(_id: string, dto: AssociationUpdateRequestDto): Promise<AssociationModel> {
        const result = await this._associationRepository.update(_id, dto);
        return result;
      }

    async list(): Promise<AssociationModel[]> {
        const result = await this._associationRepository.list();
        return result;
    }

    async getById(_id: string): Promise<AssociationModel> {
        const result = await this._associationRepository.getById(_id);
        return result;
    }

    async deleteById(_id: string) {
        return await this._associationRepository.deleteById(_id);
    }


}