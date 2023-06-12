import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractModel } from "../models/contract.model";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { S3Repository } from "../repositories/s3.repository";

@Injectable()
export class ContractService {

    private readonly _logger = new Logger(ContractService.name);

    constructor(
        private readonly _contractRepository: ContractRepository,
        private readonly _s3Repository: S3Repository
    ) { }

    async register(dto: ContractRegisterDto): Promise<ContractModel> {
      

        dto.contract_document = (await this._s3Repository.uploadBase64(`product_${new Date().getTime()}`, dto.contract_document)).Location
        console.log('o documento eh', dto.contract_document)
        const count = await this._contractRepository.list();
        dto.contract_number = (Number(count.length + 1).toString())

        const result = await this._contractRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar esse grupo!');

        return result;

    }

    async list(): Promise<ContractModel[]> {
        const result = await this._contractRepository.listNonDeleted();
        return result;
    }

    async updateStatus(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
        
        const contract =  await this._contractRepository.getById(_id);
        if(contract.status === ContractStatusEnum.aguardando_assinaturas) {
            const result = await this._contractRepository.updateStatus(_id, dto);
            return result
        } else {
            throw new BadRequestException('A situação do contrato já foi atualizada!');
        }
        
      }


    async getById(_id: string): Promise<ContractModel> {
        const result = await this._contractRepository.getById(_id);
        if(result.deleted === true) {
            throw new BadRequestException('Esse contrato já foi deletado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._contractRepository.deleteById(_id);
    }


}
