import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidRepository } from "../repositories/bid.repository";
import { BidModel } from "../models/bid.model";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { UserRepository } from "../repositories/user.repository";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";
import { BidAddProposalDto } from "../dtos/bid-add-proposal.dto";
import { AllotmentRepository } from "../repositories/allotment.repository";
import { NotificationService } from "./notification.service";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { AgreementService } from "./agreement.service";
import { FileRepository } from "../repositories/file.repository";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";
import { SupplierService } from "./supplier.service";
import { Cron } from "@nestjs/schedule";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { MutableObject } from "src/shared/interfaces/mutable-object.interface";
import { ProposalRepository } from "../repositories/proposal.repository";
import { SupplierRepository } from "../repositories/supplier.repository";
import { AssociationRepository } from "../repositories/association.repository";
import { ModelContractRepository } from "../repositories/model-contract.repository";
import { ContractRepository } from "../repositories/contract.repository";
import * as moment from 'moment';
import { text } from "aws-sdk/clients/customerprofiles";

@Injectable()
export class BidService {
  private readonly _logger = new Logger(BidService.name);

  constructor(
    private readonly _bidsRepository: BidRepository,
    private readonly _userRepository: UserRepository,
    private readonly _allotmentRepository: AllotmentRepository,
    private readonly _notificationService: NotificationService,
    private readonly _agreementService: AgreementService,
    private readonly _fileRepository: FileRepository,
    private readonly _supplierService: SupplierService,
    private readonly _proposalRepository: ProposalRepository,
    private readonly _contractRepository: ContractRepository,
    private readonly _modelContractRepository: ModelContractRepository,
    private readonly _associationRepository: AssociationRepository,
    private readonly _supplierRepository: SupplierRepository,
  ) { }

  @Cron('0 0 6 * * 0-6')
  async handleCron() {
    this._logger.debug('rotine status bids');
    const allBids: MutableObject<BidModel>[] = await this._bidsRepository.list();

    for (let bid of allBids) {
      if (bid.status === BidStatusEnum.open || bid.status === BidStatusEnum.reopened || bid.status === BidStatusEnum.tiebreaker) {
        const date = new Date(bid.end_at);
        const now = new Date();

        if (bid.status === BidStatusEnum.tiebreaker)
          date.setDate(date.getDate() + Number(bid.days_to_delivery));

        if (date.getTime() < now.getTime()) {
          try {
            this._logger.debug("update to analysis " + bid._id);
            await this._bidsRepository.rotineStatus(bid._id, BidStatusEnum.analysis);
            continue;
          }
          catch (error) {
            this._logger.error("error update " + 'bid._id' + " " + error);
            continue;
          }
        }
      }
      if (bid.status === BidStatusEnum.released) {
        const date = new Date(bid.start_at);
        const now = new Date();
        if (date.getTime() < now.getTime()) {
          try {
            this._logger.debug("update to open " + bid._id);
            await this._bidsRepository.rotineStatus(bid._id, BidStatusEnum.open);
            continue;
          }
          catch (error) {
            this._logger.error("error update " + 'bid._id' + " " + error);
            continue;
          }
        }
      }
    }
  }

  async register(associationId: string, dto: BideRegisterDto, files: Array<Express.Multer.File>): Promise<BidModel> {

    const numberOfBids = await this._bidsRepository.list();
    const association = await this._userRepository.getById(associationId);
    const agreement = await this._agreementService.findById(dto.agreementId);

    if (!agreement) throw new BadRequestException("Convênio não encontrado!");
    if (!association) throw new BadRequestException("Associação nao encontrada!");

    dto.agreement = agreement;
    dto.association = association;

    dto.bid_count = ((Number(numberOfBids.length) + 1))?.toString();

    const now = new Date();

    if (dto.editalFile) {
      dto.editalFile = this._fileRepository.upload(`${((Number(numberOfBids.length) + 1))?.toString()}-${now.getFullYear()}-edital-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.pdf`, dto.editalFile);
    }

    const aditionalFiles: string[] = [];

    files.forEach(file => {
      aditionalFiles.push(file.buffer.toString('base64'))
    });

    dto.additionalDocuments = [];

    aditionalFiles.forEach((item, index) => {
      dto.additionalDocuments.push(this._fileRepository.upload(`${index}-${((Number(numberOfBids.length) + 1))?.toString()}-${now.getFullYear()}-arquivo-complementar-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.pdf`, item));
    });

    let newArray = [];
    for (let i = 0; i < dto.add_allotment.length; i++) {
      dto.add_allotment[i].files = this._fileRepository.upload(`product_${new Date().getTime()}.pdf`, dto.add_allotment[i].files);
      dto.add_allotment[i].status = AllotmentStatusEnum.rascunho;
      newArray.push(await this._allotmentRepository.register(dto.add_allotment[i]));
    }

    dto.add_allotment = newArray;

    if (!dto.add_allotment) throw new BadRequestException("Não foi possivel cadastrar essa licitação!");
    const result = await this._bidsRepository.register(dto);
    if (!result) {
      throw new BadRequestException("Não foi possivel cadastrar essa licitação!");
    }

    const obj = {
      title: `Convite para licitação de número ${dto.bid_count}`,
      description: dto.description,
      from_user: associationId,
      to_user: ["aaa"],
      deleted: false,
    };
    if (dto.modality === BidModalityEnum.openClosed) {
      const listSuppliers = await this._supplierService.list();

      const suppliers = listSuppliers
        .filter(item => !item.blocked)
        .map(ele => ele._id?.toString() as string);

      for (let j = 0; j < suppliers.length; j++) {
        await this._notificationService.registerByBidCreation(suppliers[j], obj);
      }
      return result;
    } else {
      if (result.invited_suppliers.length)
        for (let j = 0; j < result.invited_suppliers.length; j++) {
          await this._notificationService.registerByBidCreation(result.invited_suppliers[j]?._id, obj);
        }

      return result;
    }
  }

  async list(): Promise<BidModel[]> {
    const result = await this._bidsRepository.list();
    return result;
  }

  async listAllotmentBydBidId(_id: string): Promise<any> {
    const result = await this._bidsRepository.listAllotmentByBidId(_id);
    if (!result) {
      throw new BadRequestException("Licitação não encontrada!");
    }
    return result;
  }

  async listByAssociation(userId: string): Promise<any> {
    const user = await this._userRepository.getById(userId);
    const list = await this._bidsRepository.list();
    let verify: any = [];
    for (let item of list) {
      if (item.association.association._id.toString() === user.association._id.toString()) {
        verify.push(item)
      }
    }
    return verify
  }

  async update(_id: string, dto: BidUpdateDto): Promise<BidModel> {
    const item = await this._bidsRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Não foi possivel atualizar a licitação!");
    }

    const agreement = await this._agreementService.findById(dto.agreementId);
    if (!agreement) throw new BadRequestException("Convênio não encontrado!");
    dto.agreement = agreement;

    let newArray = [];
    for (let i = 0; i < dto.add_allotment.length; i++) {
      if (dto.add_allotment[i]?._id) {
        const old = await this._allotmentRepository.listById(dto.add_allotment[i]?._id);
        if (old) {
          newArray.push(old);
          continue;
        }
      }
      dto.add_allotment[i].files = this._fileRepository.upload(`product_${new Date().getTime()}.pdf`, dto.add_allotment[i].files);
      dto.add_allotment[i].status = AllotmentStatusEnum.rascunho;
      newArray.push(await this._allotmentRepository.register(dto.add_allotment[i]));
    }
    dto.add_allotment = newArray;

    const result = await this._bidsRepository.update(_id, dto);
    return result;
  }

  async addProposal(_id: string, dto: BidAddProposalDto): Promise<BidModel> {
    const item = await this._bidsRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Não foi possivel atualizar a adicionar proposta na licitação!");
    }
    const result = await this._bidsRepository.addProposal(_id, dto);
    return result;
  }

  async updateStatus(userId: string, _id: string, dto: BidUpdateStatusRequestDto): Promise<BidModel> {
    const user = await this._userRepository.getById(userId);
    if (!user) {
      throw new BadRequestException("Usuário não encontrado!");
    }
    if (user.type === "administrador") {
      dto.proofreader = user;
    }
    const result = await this._bidsRepository.updateStatus(_id, dto);
    return result;
  }

  async getById(_id: string): Promise<BidModel> {
    const result = await this._bidsRepository.getById(_id);
    if (!result) {
      throw new BadRequestException("Licitação não encontrada!");
    }
    return result;
  }

  async deleteById(_id: string) {
    const result = await this._bidsRepository.deleteById(_id);
    if (!result) {
      throw new BadRequestException("Licitação não encontrada!");
    }
    return result;
  }

  async downloadFile(id: string, type: string): Promise<any> {
    const item = await this._bidsRepository.getById(id);
    let allFiles = [];
    if (!item){
      throw new BadRequestException("Licitação não encontrada!");
    }
    
    for(let file of item.additionalDocuments){
      const result = await this._fileRepository.download(file);
      allFiles.push({result})
      if (!result) {
        throw new BadRequestException("Arquivo não encontrado!");
      }
    }
  
    return allFiles;
  }

  async listForSupplier(userId: string): Promise<any> {
    const user = await this._userRepository.getByIdPopulate(userId);
    //@ts-ignore
    const supplier = await this._supplierService.listById(user.supplier._id);
    if (!supplier) {
      throw new BadRequestException("Fornecedor não encontrado!");
    }
    const list = await this._bidsRepository.listForSupplier(supplier._id);
    return list;
  }

  async listForProposalSupplier(userId: string): Promise<any> {
    const user = await this._userRepository.getByIdPopulate(userId);
    //@ts-ignore
    const supplier = await this._supplierService.listById(user.supplier._id);
    if (!supplier) {
      throw new BadRequestException("Fornecedor não encontrado!");
    }
    const listProposal = await this._proposalRepository.listProposalByUserSupplier(supplier._id);

    listProposal.filter(ele => ele.proposedBy.supplier._id.toString() === supplier._id.toString() && !!ele.bid);

    const list = await this._bidsRepository.listByIds(listProposal.map(ele => ele.bid?._id ? ele.bid?._id.toString() : ele.bid))
    return list;
  }

  async sendTieBreaker(_id: string): Promise<any> {
    const item = await this._bidsRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Licitação não encontrada!");
    }

    if (item.status !== BidStatusEnum.analysis) {
      throw new BadRequestException("Licitação não está em analise!");
    }

    const proposalTie = await this._proposalRepository.listProposalByBidTie(_id);

    if (!proposalTie.length) {
      throw new BadRequestException("Não foi encontrado propostas para desempate!");
    }

    const suppliers = [...proposalTie.map(ele => ele.proposedBy.supplier), ...item.invited_suppliers];

    const uniqueSuppliers = suppliers.filter((ele, index) => suppliers.findIndex(item => item._id.toString() === ele._id.toString()) === index);

    return await this._bidsRepository.sendTieBreaker(_id, uniqueSuppliers);
  }

  async bidPdfDownload(_id: string, type: string): Promise<text> {

    let propostas = [];
    let convidados = [];
    let lotes = [];

    const respondseBids = await this._bidsRepository.getById(_id);
  
    //const contract = await this._contractRepository.getById(_id);
    //console.log(contract);
    //const result = await this._contractRepository.checkAllsignatures(_id);
    const modelResponse = await this._modelContractRepository.getByClassification(type);

    const respondeAssociation = await this._associationRepository.getById(respondseBids.association.association._id);

    const responseProposal = await this._proposalRepository.listByBid(_id);

    if (responseProposal) {
      for (let p = 0; p < responseProposal.length; p++) {
        if (p == 0) {
          propostas.push(' empresa ' + responseProposal[p].proposedBy.name + ', inscrita no cnpj ' + responseProposal[p].proposedBy.document + ' ')
        } else {
          propostas.push(', empresa ' + responseProposal[p].proposedBy.name + ', inscrita no cnpj ' + responseProposal[p].proposedBy.document + ' ')
        }

      }
    }

    if (respondseBids.invited_suppliers.length > 0) {
      for (let q = 0; q < respondseBids.invited_suppliers.length; q++) {
        const suppliers = await this._supplierRepository.listById(respondseBids.invited_suppliers[q].toString());

        if (q == 0) {
          convidados.push(' empresa ' + suppliers.name + ', inscrita no cnpj ' + suppliers.cpf + ' ')
        } else {
          convidados.push(' , empresa ' + suppliers.name + ', inscrita no cnpj ' + suppliers.cpf + ' ')
        }
      }
    }


    for (let l = 0; l < respondseBids.add_allotment.length; l++) {
      //lotes.push('' + respondseBids.add_allotment[l].allotment_name + ' ')
      //  for(let item of respondseBids.add_allotment[l].add_item){
      //   lotes['item'].push({name: item.item, group: item.group, quantity: item.quantity});
      //  }
      if (l == 0) {
        lotes.push('lote ' + respondseBids.add_allotment[l].allotment_name + ' ')
        for (let item of respondseBids.add_allotment[l].add_item) {
          lotes.push('item ' + item.item + ' grupo ' + item.group + ' quantidade ' + item.quantity);
        }
      } else {
        lotes.push('lote ' + respondseBids.add_allotment[l].allotment_name + ' ')
        for (let item of respondseBids.add_allotment[l].add_item) {
          lotes.push('item ' + item.item + ' grupo ' + item.group + ' quantidade ' + item.quantity);
        }
      }
    }


    //
    //const userResponde = await this._userRepository.getById(respondseBids.add_allotment[0]['proposedBy'].toString());
    //console.log(userResponde);
    //const forcedorResponse = await this._supplierRepository.listById(userResponde.supplier._id);
    //console.log(respondeAssociation);

    //Contrato e assinaturas
    let contractFormated = modelResponse.contract.replace(/\[association_name\]/g, '' + respondeAssociation.name + '')
      //.replace('[signature_association]', ' ' + respondeAssociation.legalRepresentative.name + ' ')
      //.replace('[supplier_signature]', ' ' + forcedorResponse.legal_representative.name + ' ')
      //FORNECEDOR
      //.replace('[supplier_name]', ' ' + forcedorResponse.name + ' ')
      //.replace('[supplier]', ' ' + forcedorResponse.name + ' ')
      //.replace('[supplier_id]', ' ' + forcedorResponse.cpf + ' ')
      //.replace('[supplier_zip_code]', ' ' + forcedorResponse.address.zipCode + '')
      //.replace('[supplier_address]', ' ' + forcedorResponse.address.publicPlace + ' ' + forcedorResponse.address.number + ' ' + forcedorResponse.address.neighborhood + ' ' + forcedorResponse.address.complement + ' ')
      //.replace('[supplier_municipality]', ' ' + forcedorResponse.address.city + ' ')
      //.replace('[supplier_state]', ' ' + forcedorResponse.address.state + ' ')
      //
      //.replace('[supplier_legal_representative_name]', ' ' + forcedorResponse.legal_representative.name + ' ')
      //.replace('[supplier_legal_representative_id]', ' ' + forcedorResponse.legal_representative.cpf + ' ')
      //.replace('[supplier_legal_representative_address]', ' ' + forcedorResponse.legal_representative.address.publicPlace + ' ' + forcedorResponse.legal_representative.address.number + ' ' + forcedorResponse.legal_representative.address.neighborhood + ' ' + forcedorResponse.legal_representative.address.complement + ' ')
      //.replace('[supplier_legal_representative_supplier_municipality]', ' ' + forcedorResponse.legal_representative.address.city + ' ')
      //.replace('[supplier_legal_representative_supplier_state]', ' ' + forcedorResponse.legal_representative.address.state + ' ')


      //DADOS ASSOCIAÇÃO
      
      .replace(/\[association_name\]/g, respondeAssociation.name)
      .replace(/\[association_id\]/g, '' + respondeAssociation.cnpj + ' ')
      .replace(/\[association_zip_code\]/g, '' + respondeAssociation.address.zipCode + ' ')
      .replace(/\[association_address\]/g, '' + respondeAssociation.address.publicPlace + ' ' + respondeAssociation.address.number + ' ' + respondeAssociation.address.neighborhood + ' ' + respondeAssociation.address.complement + ' ')
      .replace(/\[association_municipality\]/g, '' + respondeAssociation.address.city + '')
      .replace(/\[association_state\]/g, '' + respondeAssociation.address.state + ' ')
      .replace(/\[association_legal_representative_name\]/g, '' + respondeAssociation.legalRepresentative.name + ' ')
      .replace(/\[association_legal_representative_id\]/g, '' + respondeAssociation.legalRepresentative.cpf + ' ')
      .replace(/\[association_legal_representative_address\]/g, '' + respondeAssociation.legalRepresentative.address.publicPlace + ' ' + respondeAssociation.legalRepresentative.address.number + ' ' + respondeAssociation.legalRepresentative.address.neighborhood + ' ' + respondeAssociation.legalRepresentative.address.complement + ' ')
      .replace(/\[association_legal_representative_supplier_municipality\]/g, '' + respondeAssociation.legalRepresentative.address.city + ' ')
      .replace(/\[association_legal_representative_supplier_state\]/g, '' + respondeAssociation.legalRepresentative.address.state + ' ')
      //

      .replace('[association_name]', '' + respondeAssociation.name + '')
      .replace('[association_id]', '' + respondeAssociation.cnpj + ' ')
      .replace('[association_zip_code]', '' + respondeAssociation.address.zipCode + ' ')
      .replace('[association_address]', '' + respondeAssociation.address.publicPlace + ' ' + respondeAssociation.address.number + ' ' + respondeAssociation.address.neighborhood + ' ' + respondeAssociation.address.complement + ' ')
      .replace('[association_municipality]', '' + respondeAssociation.address.city + '')
      .replace('[association_state]', '' + respondeAssociation.address.state + ' ')
      .replace('[association_legal_representative_name]', '' + respondeAssociation.legalRepresentative.name + ' ')
      .replace('[association_legal_representative_id]', '' + respondeAssociation.legalRepresentative.cpf + ' ')
      .replace('[association_legal_representative_address]', '' + respondeAssociation.legalRepresentative.address.publicPlace + ' ' + respondeAssociation.legalRepresentative.address.number + ' ' + respondeAssociation.legalRepresentative.address.neighborhood + ' ' + respondeAssociation.legalRepresentative.address.complement + ' ')
      .replace('[association_legal_representative_supplier_municipality]', '' + respondeAssociation.legalRepresentative.address.city + ' ')
      .replace('[association_legal_representative_supplier_state]', '' + respondeAssociation.legalRepresentative.address.state + ' ')
      //
      ////CONVENIO
      .replace(/\[covenant_number\]/g, ' ' + respondseBids.agreement.register_number.toString() + ' ')
      .replace(/\[covenant_object\]/g, ' ' + respondseBids.agreement.register_object.toString() + ' ')
      .replace(/\[municipality_execution_covenant\]/g, ' ' + respondseBids.local_to_delivery.toString() + ' ')


      //LICITACAO
      .replace('[number/year_bidding]', ' ' + respondseBids.bid_count.toString() + '/' + moment(respondseBids.start_at).format('YYYY').toString())
      .replace('[guest_supplier]', '' + convidados + ' ')
      .replace('[proposed_list]', ' ' + propostas)
      //.replace('[winning_supplier]', ' ' + forcedorResponse.legal_representative.name + ' ')
      //.replace('[document_contract_date]', ' ' + moment(contract['createdAt']).format('dd/mm/YYYY').toString() + ' ')
      .replace('[document_minutes]', ' ' + moment(respondseBids.start_at).format('DD/MM/YYYY').toString())
      .replace('[document_notice_ date]', ' ' + moment(respondseBids.start_at).format('DD/MM/YYYY').toString())
      //lote é so nome do lote
      .replace('[batch_list]', '' + lotes + ' ');
   
    return contractFormated;

  }
}
