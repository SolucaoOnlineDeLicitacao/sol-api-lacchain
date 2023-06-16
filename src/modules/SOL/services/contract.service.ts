import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractModel } from "../models/contract.model";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { NotificationService } from "./notification.service";
import { FileRepository } from "../repositories/file.repository";
import { ProposalRepository } from "../repositories/proposal.repository";
import { BidRepository } from "../repositories/bid.repository";

@Injectable()
export class ContractService {

    private readonly _logger = new Logger(ContractService.name);

    constructor(
        private readonly _contractRepository: ContractRepository,
        private readonly _notificationService: NotificationService,
        private readonly _fileRepository: FileRepository,
        private readonly _proposalRepository: ProposalRepository,
    ) { }

    async register(dto: ContractRegisterDto): Promise<ContractModel> {

        dto.contract_document = this._fileRepository.upload(`product_${new Date().getTime()}.pdf`, dto.contract_document);
        const count = await this._contractRepository.list();
        dto.contract_number = (Number(count.length + 1).toString())

        const porposals = [];

        for (let index = 0; index < dto.proposal_id.length; index++) {
            const proposalId = dto.proposal_id[index];
            const proposal = await this._proposalRepository.getById(proposalId);
            porposals.push(proposal);
        }

        const proposalWin = porposals.find(a=>a.proposalWin===true);

        dto.value = proposalWin.total_value;

        const result = await this._contractRepository.register(dto);
        await this._contractRepository.updateContractNumber(result._id, result.sequencial_number);

        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar esse grupo!');

        return result;
    }

    async list(): Promise<ContractModel[]> {
        const result = await this._contractRepository.listNonDeleted();
        return result;
    }

    async updateStatus(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {

        const contract = await this._contractRepository.getById(_id);
        if (!contract) {
            throw new BadRequestException('Contrato não encontrado!');
        }
        if (contract.status === ContractStatusEnum.aguardando_assinaturas) {
            const result = await this._contractRepository.updateStatus(_id, dto);
            return result
        } else {
            throw new BadRequestException('A situação do contrato já foi atualizada!');
        }

    }


    async signAssociation(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {

        const contract = await this._contractRepository.getById(_id);
        if (!contract) {
            throw new BadRequestException('Contrato não encontrado!');
        }

        const notificationMsg = {
            title: `O contrato ${contract.contract_number} foi assinado`,
            description: `O contrato ${contract.contract_number} foi assinado`,
            from_user: dto.association_id,
            to_user: ["aaa"],
            deleted: false,
        };
        if (contract.status === ContractStatusEnum.aguardando_assinaturas) {
            const result = await this._contractRepository.signAssociation(_id, dto);
            return result

        } else {
            throw new BadRequestException('A situação do contrato já foi atualizada!');
        }

    }

    async signSupplier(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {

        const contract = await this._contractRepository.getById(_id);
        if (!contract) {
            throw new BadRequestException('Contrato não encontrado!');
        }
        const notificationMsg = {
            title: `O contrato ${contract.contract_number} foi assinado`,
            description: `O contrato ${contract.contract_number} foi assinado`,
            from_user: dto.association_id,
            to_user: ["aaa"],
            deleted: false,
        };
        if (contract.status === ContractStatusEnum.aguardando_assinaturas) {
            const result = await this._contractRepository.signSupplier(_id, dto);
            return result;

        } else {
            throw new BadRequestException('A situação do contrato já foi atualizada!');
        }

    }


    async getById(_id: string): Promise<ContractModel> {
        const result = await this._contractRepository.getById(_id);
        if (result.deleted === true) {
            throw new BadRequestException('Esse contrato já foi deletado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._contractRepository.deleteById(_id);
    }


}
