import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AssociationRepository } from "../repositories/association.repository";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationModel } from "../models/association.model";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidRepository } from "../repositories/bid.repository";
import { BidModel } from "../models/bid.model";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { GroupRepository } from "../repositories/group.repository";
import { GroupModel } from "../models/group.model";
import { GroupRegisterDto } from "../dtos/group-register-request.dto";
import { GroupUpdatenameDto } from "../dtos/group-update-name-request.dto";
import { GroupAddItemsRequestDto } from "../dtos/group-add-items-request.dto";

@Injectable()
export class GroupService {

    private readonly _logger = new Logger(GroupService.name);

    constructor(
        private readonly _groupRepository: GroupRepository,
    ) { }

    async register(dto: GroupRegisterDto): Promise<GroupModel> {
      

        const result = await this._groupRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar esse grupo!');

        return result;

    }

    async list(): Promise<GroupModel[]> {
        const result = await this._groupRepository.list();
        return result;
    }

    async updateName(_id: string, dto: GroupUpdatenameDto): Promise<GroupModel> {
        const result = await this._groupRepository.updateName(_id, dto);
        return result;
      }

      async addItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel> {
        const result = await this._groupRepository.addItem(_id, dto);
        return result;
      }

      async removeItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel> {
        const result = await this._groupRepository.removeItem(_id, dto);
        return result;
      }



    async getById(_id: string): Promise<GroupModel> {
        const result = await this._groupRepository.getById(_id);
        return result;
    }

    async deleteById(_id: string) {
        return await this._groupRepository.deleteById(_id);
    }


}


// Enquanto a situação da licitação está como "Em rascunho" é possível clicar no botão
// “Editar" para alterar todos os campos, exceto "Tipo de licitação" e "Modalidade", que não
// podem ser modificados.
// Além disso, enquanto está sob o status "Em rascunho", a licitação ainda pode ser excluída
// clicando no botão “Excluir”.