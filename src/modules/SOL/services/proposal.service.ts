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
import { AllotmentService } from "./allotment.service";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { ContractService } from "./contract.service";
import { ProposalUpdateValues } from "../dtos/proposal-update-values-request.dto";
import {
  ProposalInAllotmentInterface,
  updateProposalInAllotmentInterface,
} from "../interfaces/proposal-in-allotment.interface";
import { MutableObject } from "src/shared/interfaces/mutable-object.interface";
import { AllotmentModel } from "../models/allotment.model";
import { BidService } from "./bid.service";
import { ProposalReviewerAcceptUpdateDto } from "../dtos/proposal-accept-reviewer-update.dto";

@Injectable()
export class ProposalService {
  private readonly _logger = new Logger(ProposalService.name);

  constructor(
    private readonly _proposalRepository: ProposalRepository,
    private readonly _allotmentRepository: AllotmentRepository,
    private readonly _allotmentService: AllotmentService,
    private readonly _bidRepository: BidRepository,
    private readonly _userRepository: UserRepository,
    private readonly _contractService: ContractService,
    private readonly _notificationService: NotificationService,
    private readonly _bidService: BidService
  ) {}

  async register(proposedById: string, dto: ProposalRegisterDto): Promise<ProposalModel> {
    const proposedBy = await this._userRepository.getById(proposedById);

    let bid = await this._bidRepository.getById(dto.licitacaoId);
    if (bid.bid_type !== "globalPrice") {
      const allotment = await this._allotmentRepository.listById(dto.allotmentIds[0]);
      dto.allotment = [allotment];
    } else {
      const allotment = await this._allotmentRepository.listByIds(dto.allotmentIds);
      dto.allotment = allotment;
    }
    if (BidStatusEnum.open !== bid.status && BidStatusEnum.reopened !== bid.status)
      throw new BadRequestException("Não é possivel cadastrar proposta para licitação fechada!");

    dto.bid = bid;

    dto.proposedBy = proposedBy;

    dto.status = ProposalStatusEnum["aguardando1"];

    const proposalList: MutableObject<ProposalModel>[] = await this._proposalRepository.listByBid(dto.licitacaoId);

    if (!proposalList.length) {
      dto.proposalWin = true;
      const result = await this._proposalRepository.register(dto);
      for (let iterator of dto.allotment) {
        const allotmentAddProposal = await this._allotmentRepository.addProposal(iterator._id, [
          {
            proposal: result,
            proposalWin: dto.proposalWin,
          },
        ]);
      }
      if (!result) throw new BadRequestException("Não foi possivel cadastrar essa proposta!");

      return result;
    }

    if (bid.bid_type === "globalPrice") {
      const verify = proposalList.some(
        el => el.proposedBy.supplier._id.toString() === proposedBy.supplier._id.toString()
      );
      if (verify) {
        throw new BadRequestException("Já foi enviado uma proposta para essa licitação!");
      }
    }

    if (bid.bid_type !== "globalPrice") {
      const verify = dto.allotment.some(el =>
        el.proposals.some(
          item =>
            proposalList
              .find(pro => pro._id.toString() === item.proposal._id.toString())
              ?.proposedBy.supplier._id.toString() === proposedBy.supplier._id.toString()
        )
      );
      if (verify) {
        throw new BadRequestException("Já foi enviado uma proposta para essa licitação!");
      }
    }

    const allotment: MutableObject<AllotmentModel> = await this._allotmentRepository.listById(dto.allotmentIds[0]);
    const newProposal: ProposalInAllotmentInterface[] = [];
    allotment.proposals.forEach(el => {
      el.proposal.proposalWin = false;
      newProposal.push({
        proposal: el.proposal,
        proposalWin: false,
      });
    });

    if (bid.bid_type === "globalPrice") {
      await this._proposalRepository.updateListProposedWin(
        proposalList.map(item => item._id.toString()),
        { proposalWin: false }
      );

      const objectWithSmallestValue = proposalList.reduce((prev: any, current: any) => {
        return current.total_value < prev.total_value ? current : prev;
      });

      if (dto.total_value === objectWithSmallestValue.total_value) {
        dto.proposalWin = true;
        const anotherWithSameValue = proposalList.filter(el => el.total_value === objectWithSmallestValue.total_value);
        if (anotherWithSameValue.length > 0) {
          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(item => item._id.toString()),
            { proposalWin: true }
          );
        }

        if (newProposal.length > 0)
          for (let data of anotherWithSameValue) {
            const index = newProposal.findIndex(el => el.proposal._id.toString() === data._id.toString());
            data.proposalWin = true;
            newProposal[index].proposalWin = true;
            newProposal[index].proposal = data;
          }
      }
      if (dto.total_value < objectWithSmallestValue.total_value) {
        dto.proposalWin = true;
      }
      if (dto.total_value > objectWithSmallestValue.total_value) {
        dto.proposalWin = false;

        const anotherWithSameValue = proposalList.filter(el => el.total_value === objectWithSmallestValue.total_value);
        if (anotherWithSameValue.length > 0) {
          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(item => item._id.toString()),
            { proposalWin: true }
          );
        }
        if (newProposal.length > 0)
          for (let data of anotherWithSameValue) {
            const index = newProposal.findIndex(el => el.proposal._id === data._id.toString());
            data.proposalWin = true;
            newProposal[index].proposalWin = true;
            newProposal[index].proposal = data;
          }
      }
    }

    if (bid.bid_type !== "globalPrice" && newProposal.length > 0) {
      await this._proposalRepository.updateListProposedWin(
        newProposal.map(item => item.proposal._id.toString()),
        { proposalWin: false }
      );

      const proposalWithSmallValue = newProposal.reduce((prev, current) => {
        return current.proposal.total_value < prev.proposal.total_value ? current : prev;
      });

      if (dto.total_value === proposalWithSmallValue.proposal.total_value) {
        dto.proposalWin = true;
        const anotherWithSameValue = newProposal.filter(
          el => el.proposal.total_value === proposalWithSmallValue.proposal.total_value
        );
        if (anotherWithSameValue.length > 0) {
          anotherWithSameValue.forEach((el, index) => {
            const proposalIndex = newProposal.findIndex(
              item => item.proposal._id.toString() === el.proposal._id.toString()
            );
            if (proposalIndex != -1) {
              newProposal[proposalIndex].proposalWin = true;
              newProposal[proposalIndex].proposal = proposalList.find(
                a => a._id.toString() === el.proposal._id.toString()
              );
              newProposal[proposalIndex].proposal.proposalWin = true;
            }
          });
          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(el => el.proposal._id.toString()),
            { proposalWin: true }
          );
        }
      }
      if (dto.total_value < proposalWithSmallValue.proposal.total_value) {
        dto.proposalWin = true;
      }
      if (dto.total_value > proposalWithSmallValue.proposal.total_value) {
        dto.proposalWin = false;

        const anotherWithSameValue = newProposal.filter(
          el => el.proposal.total_value === proposalWithSmallValue.proposal.total_value
        );
        if (anotherWithSameValue.length > 0) {
          anotherWithSameValue.forEach((el, index) => {
            const proposalIndex = newProposal.findIndex(
              item => item.proposal._id.toString() === el.proposal._id.toString()
            );
            if (proposalIndex != -1) {
              newProposal[proposalIndex].proposalWin = true;
              newProposal[proposalIndex].proposal = proposalList.find(
                a => a._id.toString() === el.proposal._id.toString()
              );
            }
            newProposal[proposalIndex].proposal.proposalWin = true;
          });
          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(el => el.proposal._id.toString()),
            { proposalWin: true }
          );
        }
      }
    }

    if (newProposal.length === 0) {
      dto.proposalWin = true;
    }

    const result = await this._proposalRepository.register(dto);
    if (!result) throw new BadRequestException("Não foi possivel cadastrar essa proposta!");

    newProposal.push({ proposal: result, proposalWin: dto.proposalWin });

    for (let iterator of dto.allotment) {
      await this._allotmentRepository.addProposal(iterator._id, newProposal);
    }

    return result;
  }

  async list(): Promise<ProposalModel[]> {
    const result = await this._proposalRepository.listNonDeleted();
    return result;
  }

  async updateAcceptfromSupplier(_id: string, dto: ProposalSupplierAcceptUpdateDto): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }

    const result = await this._proposalRepository.updateAcceptSupplier(_id, dto);
    if (result.supplier_accept === true && result.association_accept === true) {
      const newDto = {
        status: ProposalStatusEnum.aceitoRevisor,
      };
      await this._proposalRepository.updateStatus(_id, newDto);
    }
    return result;
  }

  async updateAcceptAssociation(_id: string, dto: ProposalAssociationAcceptUpdateDto): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }

    const result = await this._proposalRepository.updateAcceptAssociation(_id, dto);
    if (result.supplier_accept === true && result.association_accept === true) {
      const newDto = {
        status: ProposalStatusEnum.aceitoAssociacao,
      };

      await this._proposalRepository.updateStatus(_id, newDto);
    }
    return result;
  }

  async updateAcceptReviewer(_id: string, dto: ProposalReviewerAcceptUpdateDto, userId:string): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }
    const result = await this._proposalRepository.updateAcceptReviewer(_id, dto);

    if (result.association_accept && result.reviewer_accept) {
      return await this.acceptProposal(result._id.toString(), userId);
    }
    return result;
  }

  async refusedProposal(
    proposalId: string,
    refusedById: string,
    dto: ProposalRefusedRequestDto
  ): Promise<ProposalModel> {
    const refusedBy = await this._userRepository.getById(refusedById);

    const proposal = await this._proposalRepository.getById(proposalId);

    const list = await this._proposalRepository.listByBid(proposal.bid._id);

    if (refusedBy.type !== "administrador") {
      if (list.length > 1) {
        const listOrder = await list
          .filter(proposal => proposal.total_value !== null && Number(proposal.total_value) > 0)
          .sort((a, b) => Number(a.total_value) - Number(b.total_value));
        await this._proposalRepository.updateProposedWin(listOrder[1]._id, { proposalWin: true });
        await this._proposalRepository.updateProposedWin(proposal._id, { proposalWin: false });
      } else {
        await this._proposalRepository.updateProposedWin(proposal._id, { proposalWin: false });
      }
    } else {
      const result = await this._proposalRepository.updateProposedWin(proposal._id, { proposalWin: false });
    }

    dto.refusedAt = new Date();

    dto.refusedBy = refusedBy;
    if (refusedBy.type === UserTypeEnum["associacao"]) {
      dto.status = ProposalStatusEnum["recusadaAssociacao"];
    } else {
      dto.status = ProposalStatusEnum["recusadaRevisor"];
    }

    for (let iterator of proposal.allotment) {
      await this._allotmentService.updateStatus(iterator._id.toString(), AllotmentStatusEnum.cancelado);
    }
    return await this._proposalRepository.refusedProposal(proposalId, dto);
  }

  async acceptProposal(
    proposalId: string,
    acceptById: string,
    dto?: ProposalNotificationInterface
  ): Promise<ProposalModel> {
    const acceptBy = await this._userRepository.getById(acceptById);
    let obj: ProposalAcceptedRequestDto = {
      status: ProposalStatusEnum.aceitoAssociacao,
      acceptBy: acceptBy,
      acceptAt: new Date(),
    };

    if (acceptBy.type === UserTypeEnum.associacao) {
      obj.status = ProposalStatusEnum.aceitoAssociacao;
      const proposal = await this._proposalRepository.getById(proposalId);

      const bid = await this._bidRepository.getById(proposal.bid._id);

      for (let iterator of proposal.allotment) {
        await this._allotmentService.updateStatus(iterator._id.toString(), AllotmentStatusEnum.adjudicado);
      }

      await this._proposalRepository.acceptForFornecedorProposal(proposalId, obj);

      for (let iterator of proposal.allotment) {
        const proposalSave = await this._proposalRepository.getById(proposalId);

        const index = iterator.proposals.findIndex(i => i.proposal._id.toString() === proposalSave._id.toString());

        iterator.proposals[index].proposal = proposalSave;

        const teste = await this._allotmentRepository.register(iterator as any);
      }

      return await this._proposalRepository.updateStatus(proposal._id, obj);
    } else {
      obj.status = ProposalStatusEnum.aceitoRevisor;

      const proposal = await this._proposalRepository.getById(proposalId);

      const bid = await this._bidRepository.getById(proposal.bid._id);

      for (let iterator of proposal.allotment) {
        await this._allotmentService.updateStatus(iterator._id.toString(), AllotmentStatusEnum.adjudicado);
      }

      let contractDto: ContractRegisterDto = {
        contract_number: "1",
        bid_number: proposal.bid._id,
        value: proposal.total_value,
        contract_document: "teste",
        association_accept: false,
        supplier_accept: false,
        status: ContractStatusEnum.aguardando_assinaturas,
        proposal_id: [proposal],
        association_id: bid._id,
        supplier_id: proposal.proposedBy.supplier._id,
      };

      await this._bidRepository.changeStatus(proposal.bid._id, { status: BidStatusEnum["completed"] });

      for (let iterator of proposal.allotment) {
        const proposalSave = await this._proposalRepository.getById(proposalId);

        const index = iterator.proposals.findIndex(i => i.proposal._id.toString() === proposalSave._id.toString());

        iterator.proposals[index].proposal = proposalSave;

        const teste = await this._allotmentRepository.register(iterator as any);
      }

      const result = await this._proposalRepository.acceptForRevisorProposal(proposalId, obj);

      const responseContract = await this._contractService.register(contractDto);

      return result;
    }
  }

  async updateStatus(_id: string, dto: ProposalStatusUpdateDto): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }

    const result = await this._proposalRepository.updateStatus(_id, dto);
    return result;
  }

  async getByUserInBid(proposedById: string, allotmentId: string): Promise<boolean> {
    const proposalList = await this._proposalRepository.listByUser(proposedById);
    const verify = await proposalList.filter(el =>
      el.allotment.find(elemento => elemento._id.toString() === allotmentId)
    );

    if (verify.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  async addItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }
    const result = await this._proposalRepository.addItem(_id, dto);
    return result;
  }

  async removeItem(_id: string, dto: ProposalAddItemUpdateDto): Promise<ProposalModel> {
    const item = await this._proposalRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Proposta não encontrada!");
    }
    const result = await this._proposalRepository.removeItem(_id, dto);
    return result;
  }

  async getById(_id: string): Promise<ProposalModel> {
    const result = await this._proposalRepository.getById(_id);

    if (!result) {
      throw new BadRequestException("Proposta não encontrada!");
    }
    if (result.deleted === true) {
      throw new BadRequestException("Esse contrato já foi deletado!");
    }
    return result;
  }

  async deleteById(_id: string) {
    return await this._proposalRepository.deleteById(_id);
  }

  async listByBid(bidId: string): Promise<ProposalGetByBidResponseDto> {
    const proposals = await this._proposalRepository.listByBid(bidId);
    const bid = await this._bidService.getById(bidId);
    return new ProposalGetByBidResponseDto(proposals, bid);
  }

  async getProposalAcceptByBid(bidId: string): Promise<ProposalModel> {
    const proposals = await this._proposalRepository.listByBid(bidId);
    let result = undefined;
    for (let iterator of proposals) {
      if (iterator.acceptedFornecedor && iterator.proposalWin === true) {
        result = iterator;
      }
    }
    return result;
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
        return objectWithSmallestValue;
      } else {
        return list[0];
      }
    } else {
      return undefined;
    }
  }

  private async proposalWinUpdate(bidId) {
    const proposalWinAtMoment = await this._proposalRepository.getProposalWin(bidId);
    if (proposalWinAtMoment) {
      let request: ProposalWinRequestDto = {
        proposalWin: false,
      };
      return await this._proposalRepository.updateProposedWin(proposalWinAtMoment._id, request);
    } else {
      return undefined;
    }
  }

  async updateValues(id: string, dto: ProposalUpdateValues): Promise<ProposalModel> {
    const newProposal = await this._proposalRepository.updateValues(id, dto);

    const list: MutableObject<ProposalModel>[] = await this._proposalRepository.listByBid(newProposal.bid._id);

    const allotment = await this._allotmentRepository.listByIds(newProposal.allotment.map(item => item._id.toString()));

    const newAllotmentProposal: updateProposalInAllotmentInterface[] = [];
    allotment.forEach(item => {
      item.proposals.forEach(el => {
        el.proposal.proposalWin = false;
        newAllotmentProposal.push({
          allomentId: item._id.toString(),
          proposal: el.proposal,
          proposalWin: false,
        });
      });
    });

    if (list) {
      if (list[0].bid.bid_type === "globalPrice") {
        await this._proposalRepository.updateListProposedWin(
          list.map(item => item._id.toString()),
          { proposalWin: false }
        );

        const objectWithSmallestValue = list.reduce((prev: any, current: any) => {
          return current.total_value < prev.total_value ? current : prev;
        });

        const anotherWithSameValue = list.filter(el => el.total_value === objectWithSmallestValue.total_value);

        if (anotherWithSameValue.length >= 1) {
          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(item => item._id.toString()),
            { proposalWin: true }
          );
          if (newAllotmentProposal.length > 0)
            for (let data of anotherWithSameValue) {
              const index = newAllotmentProposal.findIndex(el => el.proposal._id.toString() === data._id.toString());
              data.proposalWin = true;
              newAllotmentProposal[index].proposalWin = true;
              newAllotmentProposal[index].proposal = data;
            }
        }
      }
      if (list[0].bid.bid_type !== "globalPrice" && newAllotmentProposal.length > 0) {
        await this._proposalRepository.updateListProposedWin(
          newAllotmentProposal.map(item => item.proposal._id.toString()),
          { proposalWin: false }
        );

        const proposalWithSmallValue = newAllotmentProposal.reduce((prev, current) => {
          return current.proposal.total_value < prev.proposal.total_value ? current : prev;
        });

        const anotherWithSameValue = newAllotmentProposal.filter(
          el => el.proposal.total_value === proposalWithSmallValue.proposal.total_value
        );

        if (anotherWithSameValue.length > 0) {
          anotherWithSameValue.forEach(el => {
            const proposalIndex = newAllotmentProposal.findIndex(
              item => item.proposal._id.toString() === el.proposal._id.toString()
            );
            const data = list.find(a => a._id.toString() === el.proposal._id.toString());
            if (proposalIndex != -1 && data) {
              newAllotmentProposal[proposalIndex].proposalWin = true;
              newAllotmentProposal[proposalIndex].proposal = data;
              newAllotmentProposal[proposalIndex].proposal.proposalWin = true;
            }
          });

          await this._proposalRepository.updateListProposedWin(
            anotherWithSameValue.map(el => el.proposal._id.toString()),
            { proposalWin: true }
          );
        }
      }
    }

    for (let iterator of allotment) {
      const array = newAllotmentProposal
        .filter(el => el.allomentId === iterator._id.toString())
        .map(item => {
          return { proposal: item.proposal, proposalWin: item.proposalWin };
        });

      await this._allotmentRepository.addProposal(iterator._id, array);
    }

    return newProposal;
  }
}
