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
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserStatusEnum } from "../enums/user-status.enum";
import { AgreementService } from "./agreement.service";
import { FileRepository } from "../repositories/file.repository";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";

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
  ) { }

  async register(associationId: string, dto: BideRegisterDto): Promise<BidModel> {
    const numberOfBids = await this._bidsRepository.list();
    const association = await this._userRepository.getById(associationId);
    const agreement = await this._agreementService.findById(dto.agreementId);
    if (!agreement) throw new BadRequestException("Convênio não encontrado!");
    if (!association) throw new BadRequestException("Associação nao encontrada!");

    dto.agreement = agreement;
    dto.association = association;

    dto.bid_count = (Number(numberOfBids.length) + 1).toString();

    if(dto.editalFile){
      dto.editalFile = this._fileRepository.upload(`edital_${new Date().getTime()}.pdf`, dto.editalFile);

    }

    if(dto.ataFile){
      dto.ataFile = this._fileRepository.upload(`ata_${new Date().getTime()}.pdf`, dto.ataFile);
 
    }

    let newArray = [];

    for (let i = 0; i < dto.add_allotment.length; i++) {

      if (dto.add_allotment[i].files) {
        dto.add_allotment[i].files = this._fileRepository.upload(`product_${new Date().getTime()}.pdf`, dto.add_allotment[i].files);
      }


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
      const users = await this._userRepository.getAll();
      const suppliers = users
        .filter(item => item.type === UserTypeEnum.fornecedor && item.status === UserStatusEnum.active)
        .map(ele => ele._id.toString());

      for (let j = 0; j < suppliers.length; j++) {

        await this._notificationService.registerByBidCreation(suppliers[j]._id.toString(), obj);
      }
      return result;
    } else {
      for (let j = 0; j < result.invited_suppliers.length; j++) {
        await this._notificationService.registerByBidCreation(result.invited_suppliers[j]._id, obj);
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

  async downloadFile(id: string, type:string): Promise<any> {
    const item = await this._bidsRepository.getById(id);
    if (!item) 
      throw new BadRequestException("Licitação não encontrada!");
    
    const result = await this._fileRepository.download(item[type]);
    if (!result) {
      throw new BadRequestException("Arquivo não encontrado!");
    }
    
    return result;
  }
}
