import { BadRequestException, Injectable, Logger, StreamableFile } from "@nestjs/common";
import { AllotmentRepository } from "../repositories/allotment.repository";
import { AllotmentModel } from "../models/allotment.model";
import { AllotmentRegisterDto } from "../dtos/allotment-register-request.dto";
import { AllotAddProposalDto } from "../dtos/allotment-add-proposal-request.dto";
import { ItemRequestDto } from "../dtos/item-register-request.dto";
import { FileRepository } from "../repositories/file.repository";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";
import { MutableObject } from "src/shared/interfaces/mutable-object.interface";

@Injectable()
export class AllotmentService {
  private readonly _logger = new Logger(AllotmentService.name);

  constructor(
    private readonly _allotmentRepository: AllotmentRepository,
    private readonly _fileRepository: FileRepository,
  ) { }

  async register(dto: AllotmentRegisterDto): Promise<AllotmentModel> {
    dto.status = AllotmentStatusEnum.rascunho;

    const result = await this._allotmentRepository.register(dto);

    if (!result) throw new BadRequestException("Não foi possivel cadastrar essa essa proposta!");

    return result;
  }

  async list(): Promise<AllotmentModel[]> {
    const result = await this._allotmentRepository.list();
    return result;
  }

  async listById(_id: string): Promise<AllotmentModel> {
    const result = await this._allotmentRepository.listById(_id);
    if (!result) {
      throw new BadRequestException("Não foi possivel cadastrar essa essa proposta!");
    }

    return result;
  }

  async updateStatus(_id: string, status: AllotmentStatusEnum): Promise<AllotmentModel> {
    const item: MutableObject<AllotmentModel> = await this._allotmentRepository.listById(_id);
    if (!item) {
      throw new BadRequestException("Não foi possivel cadastrar essa essa proposta!");
    }
    item.status = status;
    const result = await this._allotmentRepository.update(_id, item);
    return result;
  }

  async updateProposal(_id: string, dto: AllotAddProposalDto): Promise<AllotmentModel> {
    const item = await this._allotmentRepository.listById(_id);
    if (!item) {
      throw new BadRequestException('Não foi possivel cadastrar essa essa proposta!');
    }
    return
  }

  async downloadAllotmentById(_id: string): Promise<any> {
    const result = await this._allotmentRepository.listById(_id);
    if (!result) {
      throw new BadRequestException('Não foi possivel cadastrar essa essa proposta!');
    }
    return this._fileRepository.download(result.files);
  }

  async updateItem(_id: string, dto: ItemRequestDto): Promise<AllotmentModel> {
    const result = await this._allotmentRepository.updateItem(_id, dto);
    return result;
  }

}
