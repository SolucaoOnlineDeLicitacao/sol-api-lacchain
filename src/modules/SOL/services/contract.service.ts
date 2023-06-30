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
import { ModelContractRepository } from "../repositories/model-contract.repository";
import * as cheerio from "cheerio";
import { AssociationRepository } from "../repositories/association.repository";
import { UserRepository } from "../repositories/user.repository";
import { SupplierRepository } from "../repositories/supplier.repository";
import { text } from "aws-sdk/clients/customerprofiles";
import { ContractUpdateStatusItemDto } from "../dtos/contract-update-status-item-request.dto";
import * as moment from "moment";

@Injectable()
export class ContractService {
  private readonly _logger = new Logger(ContractService.name);

  constructor(
    private readonly _contractRepository: ContractRepository,
    private readonly _notificationService: NotificationService,
    private readonly _fileRepository: FileRepository,
    private readonly _proposalRepository: ProposalRepository,
    private readonly _modelContractRepository: ModelContractRepository,
    private readonly _associationRepository: AssociationRepository,
    private readonly _userRepository: UserRepository,
    private readonly _supplierRepository: SupplierRepository
  ) {}

  async register(dto: ContractRegisterDto): Promise<ContractModel> {
    //dto.contract_document = this._fileRepository.upload(`product_${new Date().getTime()}.pdf`, dto.contract_document);
    const count = await this._contractRepository.list();
    dto.contract_number = Number(count.length + 1).toString();

    dto.value = dto.proposal_id.total_value;

    const result = await this._contractRepository.register(dto);
    // await this._contractRepository.updateContractNumber(result._id, result.sequencial_number);

    if (!result) throw new BadRequestException("Não foi possivel cadastrar esse grupo!");

    return result;
  }

  async list(): Promise<ContractModel[]> {
    const result = await this._contractRepository.listNonDeleted();
    return result;
  }

  async updateStatus(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    const contract = await this._contractRepository.getById(_id);
    if (!contract) {
      throw new BadRequestException("Contrato não encontrado!");
    }
    if (contract.status === ContractStatusEnum.aguardando_assinaturas) {
      const result = await this._contractRepository.updateStatus(_id, dto);
      return result;
    } else {
      throw new BadRequestException("A situação do contrato já foi atualizada!");
    }
  }

  async updateStatusItens(_id: string, dto: ContractUpdateStatusItemDto): Promise<ContractModel> {
    const contract = await this._contractRepository.getById(_id);
    if (!contract) throw new BadRequestException("Contrato não encontrado!");

    const result = await this._contractRepository.updateStatusAndItens(_id, dto);
    return result;
  }

  async signAssociation(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    const contract = await this._contractRepository.getById(_id);
    if (!contract) {
      throw new BadRequestException("Contrato não encontrado!");
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
      return this.checkAllsignatures(_id);
    } else {
      throw new BadRequestException("A situação do contrato já foi atualizada!");
    }
  }

  async signSupplier(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    const contract = await this._contractRepository.getById(_id);
    if (!contract) {
      throw new BadRequestException("Contrato não encontrado!");
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
      return this.checkAllsignatures(_id);
    } else {
      throw new BadRequestException("A situação do contrato já foi atualizada!");
    }
  }

  async checkAllsignatures(_id: string): Promise<ContractModel> {
    const contract = await this._contractRepository.getById(_id);

    if (!contract) {
      throw new BadRequestException("Contrato não encontrado!");
    }
    if (contract.status === ContractStatusEnum.aguardando_assinaturas) {
      if (contract.supplier_accept && contract.association_accept) {
        const result = await this._contractRepository.checkAllsignatures(_id);
        return result;
      }
    }

    return contract;
  }

  async contractPdfDownload(_id: string): Promise<text> {
    let propostas = [];
    let convidados = [];
    let lotes = [];

    const contract = await this._contractRepository.getById(_id);

    if (!contract) {
      throw new BadRequestException("Contrato não encontrado!");
    }

    const result = await this.checkAllsignatures(_id);

    if (!result) {
      throw new BadRequestException("Contrato não encontrado!");
    }

    const modelResponse = await this._modelContractRepository.getByClassification(
      contract.bid_number["classification"].toString()
    );

    if (!modelResponse) {
      throw new BadRequestException("Não foi encontrado um modelo de contrato para essa licitação!");
    }

    const respondeAssociation = await this._associationRepository.getById(
      contract.bid_number["association"]["association"].toString()
    );
    const responseProposal = await this._proposalRepository.listByBid(contract.bid_number["_id"].toString());

    for (let p = 0; p < responseProposal.length; p++) {
      if (p == 0) {
        propostas.push(
          " empresa " +
            responseProposal[p].proposedBy.name +
            ", inscrita no cnpj " +
            responseProposal[p].proposedBy.document +
            " "
        );
      } else {
        propostas.push(
          ", empresa " +
            responseProposal[p].proposedBy.name +
            ", inscrita no cnpj " +
            responseProposal[p].proposedBy.document +
            " "
        );
      }
    }

    for (let q = 0; q < contract.bid_number["invited_suppliers"].length; q++) {
      const suppliers = await this._supplierRepository.listById(contract.bid_number["invited_suppliers"][q].toString());

      if (q == 0) {
        convidados.push(" empresa " + suppliers.name + ", inscrita no cnpj " + suppliers.cpf + " ");
      } else {
        convidados.push(" , empresa " + suppliers.name + ", inscrita no cnpj " + suppliers.cpf + " ");
      }
    }

    for (let l = 0; l < contract.bid_number["add_allotment"].length; l++) {
      if (l == 0) {
        lotes.push("" + contract.bid_number["add_allotment"][l].allotment_name + " ");
      } else {
        lotes.push(contract.bid_number["add_allotment"][l].allotment_name + " ");
      }
    }

    const userResponde = await this._userRepository.getById(contract.proposal_id["proposedBy"].toString());

    const forcedorResponse = await this._supplierRepository.listById(userResponde.supplier._id);
    //console.log(respondeAssociation);

    //Contrato e assinaturas
    let contractFormated = modelResponse.contract
      .replace(/\[contract_number\]/g, " " + contract.contract_number + " ")
      .replace(/\[supplier_signature\]/g, " " + forcedorResponse.legal_representative.name + " ")
      .replace(/\[signature_association\]/g, " " + respondeAssociation.legalRepresentative.name + " ")

      //FORNECEDOR
      .replace(/\[supplier_name\]/g, " " + forcedorResponse.name + " ")
      .replace(/\[supplier\]/g, " " + forcedorResponse.name + " ")
      .replace(/\[supplier_id\]/g, " " + forcedorResponse.cpf + " ")
      .replace(/\[supplier_zip_code\]/g, " " + forcedorResponse.address.zipCode + "")
      .replace(
        /\[supplier_address\]/g,
        " " +
          forcedorResponse.address.publicPlace +
          " " +
          forcedorResponse.address.number +
          " " +
          forcedorResponse.address.neighborhood +
          " " +
          forcedorResponse.address.complement +
          " "
      )
      .replace(/\[supplier_municipality\]/g, " " + forcedorResponse.address.city + " ")
      .replace(/\[supplier_state\]/g, " " + forcedorResponse.address.state + " ")

      .replace(/\[supplier_legal_representative_name\]/g, " " + forcedorResponse.legal_representative.name + " ")
      .replace(/\[supplier_legal_representative_id\]/g, " " + forcedorResponse.legal_representative.cpf + " ")
      .replace(
        /\[supplier_legal_representative_address\]/g,
        " " +
          forcedorResponse.legal_representative.address.publicPlace +
          " " +
          forcedorResponse.legal_representative.address.number +
          " " +
          forcedorResponse.legal_representative.address.neighborhood +
          " " +
          forcedorResponse.legal_representative.address.complement +
          " "
      )
      .replace(
        /\[supplier_legal_representative_supplier_municipality\]/g,
        " " + forcedorResponse.legal_representative.address.city + " "
      )
      .replace(
        /\[supplier_legal_representative_supplier_state\]/g,
        " " + forcedorResponse.legal_representative.address.state + " "
      )

      //DADOS ASSOCIAÇÃO

      .replace(/\[association_name\]/g, "" + respondeAssociation.name + "")
      .replace(/\[association_id\]/g, "" + respondeAssociation.cnpj + " ")
      .replace(/\[association_zip_code\]/g, "" + respondeAssociation.address.zipCode + " ")
      .replace(
        /\[association_address\]/g,
        "" +
          respondeAssociation.address.publicPlace +
          " " +
          respondeAssociation.address.number +
          " " +
          respondeAssociation.address.neighborhood +
          " " +
          respondeAssociation.address.complement +
          " "
      )
      .replace(/\[association_municipality\]/g, "" + respondeAssociation.address.city + "")
      .replace(/\[association_state\]/g, "" + respondeAssociation.address.state + " ")
      .replace(/\[association_legal_representative_name\]/g, "" + respondeAssociation.legalRepresentative.name + " ")
      .replace(/\[association_legal_representative_id\]/g, "" + respondeAssociation.legalRepresentative.cpf + " ")
      .replace(
        /\[association_legal_representative_address\]/g,
        "" +
          respondeAssociation.legalRepresentative.address.publicPlace +
          " " +
          respondeAssociation.legalRepresentative.address.number +
          " " +
          respondeAssociation.legalRepresentative.address.neighborhood +
          " " +
          respondeAssociation.legalRepresentative.address.complement +
          " "
      )
      .replace(
        /\[association_legal_representative_supplier_municipality\]/g,
        "" + respondeAssociation.legalRepresentative.address.city + " "
      )
      .replace(
        /\[association_legal_representative_supplier_state\]/g,
        "" + respondeAssociation.legalRepresentative.address.state + " "
      )

      //CONVENIO
      .replace(/\[covenant_number\]/g, " " + contract.bid_number["agreement"]["register_number"].toString() + " ")
      .replace(/\[covenant_object\]/g, " " + contract.bid_number["agreement"]["register_object"].toString() + " ")
      .replace(/\[municipality_execution_covenant\]/g, " " + contract.bid_number["local_to_delivery"].toString() + " ")

      //LICITACAO
      .replace(
        "[number/year_bidding]",
        " " +
          contract.bid_number["bid_count"].toString() +
          "/" +
          moment(contract.bid_number["start_at"]).format("YYYY").toString()
      )
      .replace(/\[guest_supplier\]/g, "" + convidados + " ")
      .replace(/\[proposed_list\]/g, " " + propostas)
      .replace(/\[winning_supplier\]/g, " " + forcedorResponse.legal_representative.name + " ")
      .replace(/\[document_contract_date\]/g, " " + moment(contract["createdAt"]).format("DD/MM/YYYY").toString() + " ")
      //.replace([document_minutes]', ' ' +
      //.replace('[document_notice_ date]', ' ' +
      .replace("[batch_list]", "" + lotes + " ");

    return contractFormated;
  }

  async getById(_id: string): Promise<ContractModel> {
    const result = await this._contractRepository.getById(_id);
    if (result.deleted === true) {
      throw new BadRequestException("Esse contrato já foi deletado!");
    }
    return result;
  }

  async listByBidId(bid_id: string): Promise<ContractModel[]> {
    const result = await this._contractRepository.getByBidId(bid_id);
    return result;
  }

  async deleteById(_id: string) {
    return await this._contractRepository.deleteById(_id);
  }
}
