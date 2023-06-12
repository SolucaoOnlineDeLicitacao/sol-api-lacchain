import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AllotmentRepository } from "../repositories/allotment.repository";
import { AllotmentModel } from "../models/allotment.model";
import { AllotmentRegisterDto } from "../dtos/allotment-register-request.dto";
import { AllotAddProposalDto } from "../dtos/allotment-add-proposal-request.dto";
import { ItemRequestDto } from "../dtos/item-register-request.dto";

@Injectable()
export class AllotmentService {

    private readonly _logger = new Logger(AllotmentService.name);

    constructor(
        private readonly _allotmentRepository: AllotmentRepository,
      
    
    ) { }

 

    async register(associationId: string, dto: AllotmentRegisterDto): Promise<AllotmentModel> {

        console.log('serviço do allot', dto)
      const result =  await this._allotmentRepository.register(dto)
        
      

    
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar essa essa proposta!');

        return result;

    }

    async list(): Promise<AllotmentModel[]> {
        const result = await this._allotmentRepository.list();
        return result;
    }

    async listById(_id: string): Promise<AllotmentModel> {
        const result = await this._allotmentRepository.listById(_id);
        return result;
    }

    async updateProposal(_id: string, dto: AllotAddProposalDto): Promise<AllotmentModel> {
        const result = await this._allotmentRepository.updateProposal(_id, dto);
        return result;
    }

    async updateItem(_id: string, dto: ItemRequestDto): Promise<AllotmentModel> {
        const result = await this._allotmentRepository.updateItem(_id, dto);
        return result;
    }

  

    // async deleteById(_id: string) {
    //     return await this._bidsRepository.deleteById(_id);
    // }


}

