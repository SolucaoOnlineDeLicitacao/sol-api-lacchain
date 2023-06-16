import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ModelContractRepository } from "../repositories/model-contract.repository";
import { ModelContract } from "../schemas/model-contract.schemay";
import { ModelContractRegisterDto } from "../dtos/model-contract-register-request.dto";
import { ModelContractUpdateDto } from "../dtos/model-contract-update-request.dto";
import { Bids } from "../schemas/bids.schema";
import { BidRepository } from "../repositories/bid.repository";

@Injectable()
export class ModelContractService {

    private readonly _logger = new Logger(ModelContractService.name);

    constructor(
        private readonly _modelContractRepository: ModelContractRepository,
        private readonly _bidsRepository: BidRepository,
       
    ) { }

    async register(dto: ModelContractRegisterDto): Promise<ModelContract> {
      
        const result = await this._modelContractRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar esse modelo de contrato!');

        return result;

    }

    async list(): Promise<ModelContract[]> {
        const result = await this._modelContractRepository.list();
        return result;
    }
    
    async update(_id: string, dto: ModelContractUpdateDto): Promise<ModelContract> {

        const result = await this._modelContractRepository.update(_id, dto);
        return result
        
      }


    async getById(_id: string): Promise<ModelContract> {
        const result = await this._modelContractRepository.getById(_id);
      
        return result;
    }

    async getBidById(_id: string): Promise<Bids> {
        const result = await this._bidsRepository.getBidById(_id);
        if (!result) {
          throw new BadRequestException("Licitação não encontrada!");
        }
        return result;
      }
  
      
    async deleteById(_id: string) {
        return await this._modelContractRepository.deleteById(_id);
    }


}
