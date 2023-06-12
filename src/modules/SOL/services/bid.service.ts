import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AssociationRepository } from "../repositories/association.repository";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationModel } from "../models/association.model";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidRepository } from "../repositories/bid.repository";
import { BidModel } from "../models/bid.model";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { UserRepository } from "../repositories/user.repository";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";
import { S3Repository } from "../repositories/s3.repository";
import { S3Service } from "src/shared/services/s3.service";
import { BidAddProposalDto } from "../dtos/bid-add-proposal.dto";

@Injectable()
export class BidService {

    private readonly _logger = new Logger(BidService.name);

    constructor(
        private readonly _bidsRepository: BidRepository,
        private readonly _userRepository: UserRepository,
        private readonly _s3Repository: S3Repository
    ) { }

 

    async register(associationId: string, dto: BideRegisterDto): Promise<BidModel> {
        const numberOfBids = await this._bidsRepository.list()
        const association = await this._userRepository.getById(associationId);

        dto.add_allotment[0].files = (await this._s3Repository.uploadBase64(`product_${new Date().getTime()}`, dto.add_allotment[0].files)).Location

        if (!association)
            throw new BadRequestException('Associação nao encontrada!');

        dto.association = association;

        dto.bid_count = (Number(numberOfBids.length) + 1).toString()
        const result = await this._bidsRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar essa licitação!');

        return result;

    }

    async list(): Promise<BidModel[]> {
        const result = await this._bidsRepository.list();
        return result;
    }

    async update(_id: string, dto: BidUpdateDto): Promise<BidModel> {
        const result = await this._bidsRepository.update(_id, dto);
        return result;
    }

    async addProposal(_id: string, dto: BidAddProposalDto): Promise<BidModel> {
        const result = await this._bidsRepository.addProposal(_id, dto);
        return result;
    }


    async updateStatus(userId: string, _id: string, dto: BidUpdateStatusRequestDto): Promise<BidModel> {
        const user = await this._userRepository.getById(userId);
        if (user.type === 'administrador') {
            dto.proofreader = user;
        }
        const result = await this._bidsRepository.updateStatus(_id, dto);
        return result;
    }

    async getById(_id: string): Promise<BidModel> {
        const result = await this._bidsRepository.getById(_id);
        return result;
    }



    async deleteById(_id: string) {
        return await this._bidsRepository.deleteById(_id);
    }


}


// Enquanto a situação da licitação está como "Em rascunho" é possível clicar no botão
// “Editar" para alterar todos os campos, exceto "Tipo de licitação" e "Modalidade", que não
// podem ser modificados.
// Além disso, enquanto está sob o status "Em rascunho", a licitação ainda pode ser excluída
// clicando no botão “Excluir”.