import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ProposalModel } from "../models/proposal.model";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalRepository } from "../repositories/proposal.repository";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";
import { ProposalSupplierAcceptUpdateDto } from "../dtos/proposal-accept-supplier-updatet.dto";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { ProposalAssociationAcceptUpdateDto } from "../dtos/proposal-accept-association-updatet.dto";
import { AllotmentRepository } from "../repositories/allotment.repository";
import { BidRepository } from "../repositories/bid.repository";
import { ProposalGetByBidResponseDto } from "../dtos/proposal-get-by-bid-response.dto";
import { UserRepository } from "../repositories/user.repository";
import { ProposalWinRequestDto } from "../dtos/proposal-win-request.dto";
import { ProposalRefusedRequestDto } from "../dtos/proposal-refused-request.dto";
import { UserTypeEnum } from "../enums/user-type.enum";
import { ProposalAcceptedRequestDto } from "../dtos/proposal-accepted-request.dto";
import { NotificationService } from "./notification.service";
import { ProposalNotificationInterface } from "../interfaces/proposal-notification-dto";

@Injectable()
export class ProposalService {

    private readonly _logger = new Logger(ProposalService.name);

    constructor(
        private readonly _proposalRepository: ProposalRepository,
        private readonly _allotmentRepository: AllotmentRepository,
        private readonly _bidRepository: BidRepository,
        private readonly _userRepository: UserRepository,
        private readonly _notificationService: NotificationService
    ) { }

    async register(proposedById: string, dto: ProposalRegisterDto): Promise<ProposalModel> {
        const proposedBy = await this._userRepository.getById(proposedById);
        const allotment = await this._allotmentRepository.listById(dto.allotmentIds);
        const bid = await this._bidRepository.getById(dto.licitacaoId);

        dto.allotment = allotment;

        dto.bid = bid;

        dto.proposedBy = proposedBy;

        dto.status = ProposalStatusEnum['aguardando1'];

        if (!dto.file) {
            const proposalWinAtMoment = await this.proposalWinForBid(dto.licitacaoId);

            if (!proposalWinAtMoment || proposalWinAtMoment.status !== ProposalStatusEnum['recusadaAssociacao'] && proposalWinAtMoment.status !== ProposalStatusEnum['recusadaRevisor']) {
                dto.proposalWin = true;
            } else {
                if (dto.total_value > proposalWinAtMoment.total_value) {
                    dto.proposalWin = false;
                } else {
                    const verify = await this.proposalWinUpdate(dto.licitacaoId);
                    if (!verify) {
                        dto.proposalWin = true;
                    }
                }
            }

        }

        const result = await this._proposalRepository.register(dto);
        if (!result)
            throw new BadRequestException('Não foi possivel cadastrar essa proposta!');

        return result;

    }

    async list(): Promise<ProposalModel[]> {
        const result = await this._proposalRepository.listNonDeleted();
        return result;
    }

    async updateAcceptfromSupplier(_id: string, dto: ProposalSupplierAcceptUpdateDto): Promise<ProposalModel> {
        const item = await this._proposalRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Proposta não encontrada!');
        }

        const result = await this._proposalRepository.updateAcceptSupplier(_id, dto);
        if (result.supplier_accept === true && result.association_accept === true) {
            const newDto = {
                status: ProposalStatusEnum.aceitoRevisor
            }
            await this._proposalRepository.updateStatus(_id, newDto)
        }
        return result
    }

    async updateAcceptAssociation(_id: string, dto: ProposalAssociationAcceptUpdateDto): Promise<ProposalModel> {
        const item = await this._proposalRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Proposta não encontrada!');
        }

        const result = await this._proposalRepository.updateAcceptAssociation(_id, dto);
        if (result.supplier_accept === true && result.association_accept === true) {
            const newDto = {
                status: ProposalStatusEnum.aceitoAssociacao
            }

            await this._proposalRepository.updateStatus(_id, newDto)
        }
        return result
    }

    async refusedProposal(proposalId: string, refusedById: string, dto: ProposalRefusedRequestDto): Promise<ProposalModel> {
        const refusedBy = await this._userRepository.getById(refusedById);

        const proposal = await this._proposalRepository.getById(proposalId);

        const list = await this._proposalRepository.listByBidsWaiting(proposal.bid._id);

        if (refusedBy.type !== 'administrador') {
            if (list) {
                const result = await this._proposalRepository.updateProposedWin(proposal._id, { proposalWin: false });
        
            }
        } else {
            const result = await this._proposalRepository.updateProposedWin(proposal._id, { proposalWin: false });
        }

        dto.refusedAt = new Date();

        dto.refusedBy = refusedBy;
        if (refusedBy.type === UserTypeEnum['associacao']) {
            dto.status = ProposalStatusEnum['recusadaAssociacao'];
            return await this._proposalRepository.refusedProposal(proposalId, dto)
        } else {
            dto.status = ProposalStatusEnum['recusadaRevisor'];
            return await this._proposalRepository.refusedProposal(proposalId, dto)
        }

    }

    async acceptProposal(proposalId: string, acceptById: string, dto: ProposalNotificationInterface): Promise<ProposalModel> {
        const acceptBy = await this._userRepository.getById(acceptById);
        const obj: ProposalAcceptedRequestDto = {
            status: ProposalStatusEnum.aceitoAssociacao,
            acceptBy: acceptBy,
            acceptAt: new Date()
        }
    
        if (acceptBy.type === UserTypeEnum['associacao']) {
            obj.status = ProposalStatusEnum['aceitoAssociacao'];
            const result = await this._proposalRepository.acceptForFornecedorProposal(proposalId, obj);
           
            return result
        } else {
            obj.status = ProposalStatusEnum['aceitoRevisor'];
            const result = await this._proposalRepository.acceptForRevisorProposal(proposalId, obj);
            return result
        }

    }

    async updateStatus(_id: string, dto: ProposalStatusUpdateDto): Promise<ProposalModel> {
        const item = await this._proposalRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Proposta não encontrada!');
        }

        const result = await this._proposalRepository.updateStatus(_id, dto);
        return result
    }

    async addItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        const item = await this._proposalRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Proposta não encontrada!');
        }
        const result = await this._proposalRepository.addItem(_id, dto);
        return result;
    }

    async removeItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
        const item = await this._proposalRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Proposta não encontrada!');
        }
        const result = await this._proposalRepository.removeItem(_id, dto);
        return result;
    }

    async getById(_id: string): Promise<ProposalModel> {
        const result = await this._proposalRepository.getById(_id);

        if (!result) {
            throw new BadRequestException('Proposta não encontrada!');
        }
        if (result.deleted === true) {
            throw new BadRequestException('Esse contrato já foi deletado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._proposalRepository.deleteById(_id);
    }

    async listByBid(bidId: string): Promise<ProposalGetByBidResponseDto> {
        const proposals = await this._proposalRepository.listByBid(bidId);
        const bid = await this._bidRepository.getById(bidId);

        return new ProposalGetByBidResponseDto(
            proposals,
            bid
        )
    }

    async getProposalAcceptByBid(bidId: string): Promise<ProposalModel> {
        const proposals = await this._proposalRepository.listByBid(bidId);
        let result = undefined;
        for (let iterator of proposals) {
            if (iterator.acceptedFornecedor) {
                result = iterator
            }
        }
        return result
    }

    private async proposalWinForBid(bidId): Promise<ProposalModel> {
        const list = await this._proposalRepository.listByBidsWaiting(bidId);
        if (list) {
            if (list.length >= 1) {
                const objectWithSmallestValue = list.reduce((prev: any, current: any) => {
                    if (current.total_value < prev.total_value) {
                        return current;
                    } else {
                        return prev;
                    }
                });
                return objectWithSmallestValue
            } else {
                return list[0]
            }
        } else {
            return undefined
        }
    }

    private async proposalWinUpdate(bidId) {
        const proposalWinAtMoment = await this._proposalRepository.getProposalWin(bidId);
        if (proposalWinAtMoment) {
            let request: ProposalWinRequestDto = {
                proposalWin: false,
            }
            return await this._proposalRepository.updateProposedWin(proposalWinAtMoment._id, request);
        } else {
            return undefined
        }
    }

}
