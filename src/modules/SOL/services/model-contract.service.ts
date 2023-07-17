import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ModelContractRepository } from "../repositories/model-contract.repository";
import { ModelContract } from "../schemas/model-contract.schemay";
import { ModelContractRegisterDto } from "../dtos/model-contract-register-request.dto";
import { ModelContractUpdateDto } from "../dtos/model-contract-update-request.dto";
import { Bids } from "../schemas/bids.schema";
import { BidRepository } from "../repositories/bid.repository";
import { ModelContractModel } from "../models/model-contract.model";
const fs = require("fs");
const path = require("path");


@Injectable()
export class ModelContractService {

    private readonly _logger = new Logger(ModelContractService.name);

    constructor(
        private readonly _modelContractRepository: ModelContractRepository,
        private readonly _bidsRepository: BidRepository,
       
    ) { }

    async register(dto: ModelContractRegisterDto, file:Express.Multer.File): Promise<ModelContractModel> {

        const modelContract = await this._modelContractRepository.getByContractAndLanguage(dto.language, dto.classification);

        if (modelContract) {
            throw new BadRequestException('Já existe um modelo de contrato cadastrado com essas informações!');
        }

        await fs.writeFileSync(path.resolve("src/shared/documents", file.originalname), file.buffer);

        dto.contract = file.originalname;
      
        const result = await this._modelContractRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar esse modelo de contrato!');

        return result;

    }

    async list(): Promise<ModelContractModel[]> {
        const result = await this._modelContractRepository.list();
        return result;
    }
    
    async update(_id: string, dto: ModelContractUpdateDto, file: Express.Multer.File): Promise<ModelContractModel> {
        const modelContract = await this._modelContractRepository.getByContractAndLanguage(dto.language, dto.classification);

        if (modelContract) {
            if(modelContract._id != _id)
                throw new BadRequestException('Já existe um modelo de contrato cadastrado com essas informações!');
        }

        await fs.unlinkSync(path.resolve("src/shared/documents", dto.contract));

        await fs.writeFileSync(path.resolve("src/shared/documents", file.originalname), file.buffer);

        dto.contract = file.originalname;

        const result = await this._modelContractRepository.update(_id, dto);
        return result
        
      }


    async getById(_id: string): Promise<ModelContractModel> {
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
