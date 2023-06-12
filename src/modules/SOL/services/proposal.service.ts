import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractModel } from "../models/contract.model";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { ProposalModel } from "../models/proposal.model";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalRepository } from "../repositories/proposal.repository";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";

@Injectable()
export class ProposalService {

    private readonly _logger = new Logger(ProposalService.name);

    constructor(
        private readonly _proposalRepository: ProposalRepository,
    ) { }

    async register(dto: ProposalRegisterDto): Promise<ProposalModel> {
      


        const result = await this._proposalRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar essa proposta!');

        return result;

    }

    async list(): Promise<ProposalModel[]> {
        const result = await this._proposalRepository.listNonDeleted();
        return result;
    }

    async updateStatus(_id: string, dto: ProposalStatusUpdateDto): Promise<ProposalModel> {
        
            const result = await this._proposalRepository.updateStatus(_id, dto);
            return result    

    
        }    
   
        

      async addItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        const result = await this._proposalRepository.addItem(_id, dto);
        return result;
      }

      async removeItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        const result = await this._proposalRepository.removeItem(_id, dto);
        return result;
      }

    async getById(_id: string): Promise<ProposalModel> {
        const result = await this._proposalRepository.getById(_id);
        if(result.deleted === true) {
            throw new BadRequestException('Esse contrato já foi deletado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._proposalRepository.deleteById(_id);
    }


}
