import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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
        const item = await this._groupRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Grupo não encontrado!');
        }
        const result = await this._groupRepository.updateName(_id, dto);
        return result;
      }

      async addItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel> {
        const item = await this._groupRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Grupo não encontrado!');
        }
        const result = await this._groupRepository.addItem(_id, dto);
        return result;
      }

      async removeItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel> {
        const item = await this._groupRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Grupo não encontrado!');
        }
        const result = await this._groupRepository.removeItem(_id, dto);
        return result;
      }



    async getById(_id: string): Promise<GroupModel> {
        const result = await this._groupRepository.getById(_id);
      
        if (!result) {
            throw new BadRequestException('Grupo não encontrado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._groupRepository.deleteById(_id);
    }


}
