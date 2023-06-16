import { Injectable } from "@nestjs/common";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AgreementRepository } from "../repositories/agreement.repository";
import { UserRepository } from "../repositories/user.repository";
import { AgreementInterface } from "../interfaces/agreement.interface";
import { WorkPlanService } from "./work-plan.service";
import { AssociationService } from "../services/association.service";

@Injectable()
export class AgreementService {
  constructor(
    private readonly _agreementRepository: AgreementRepository,
    private readonly _userRepository: UserRepository,
    private readonly _workPlanService: WorkPlanService,
    private readonly _associationService: AssociationService
  ) {}

  async findById(id: string): Promise<AgreementInterface> {
    return await this._agreementRepository.findById(id);
  }

  async deleteById(id: string): Promise<AgreementInterface> {
    return await this._agreementRepository.deleteById(id);
  }

  async register(dto: AgreementRegisterRequestDto): Promise<AgreementInterface> {
    const user = await this._userRepository.getById(dto.reviewerId);
    if (!user) throw new Error("User not found");
    dto.reviewer = user;

    const association = await this._associationService.getById(dto.associationId);
    if (!association) throw new Error("Association not found");
    dto.association = association;

    const result = await this._agreementRepository.register(dto);

    return result;
  }

  async findAll(): Promise<AgreementInterface[]> {
    const result = await this._agreementRepository.findAll();

    return result;
  }

  async update(id: string, dto: AgreementRegisterRequestDto): Promise<AgreementInterface> {
    dto.reviewer = await this._userRepository.getById(dto.reviewerId);
    if(!dto.reviewer) throw new Error("User not found");
    
    dto.association = await this._associationService.getById(dto.associationId);
    if(!dto.association) throw new Error("Association not found");

    return await this._agreementRepository.update(id, dto);
  }

  async addWorkPlan(id: string, workPlanIds: string): Promise<AgreementInterface> {
    const agreement = await this._agreementRepository.findById(id);

    if (!agreement.workPlan) agreement.workPlan = [];
    if (agreement.workPlan.some(item => item._id.toString() === workPlanIds)) return agreement;

    const works = await this._workPlanService.listByIds([
      workPlanIds,
      ...agreement.workPlan?.map(item => item._id.toString()),
    ]);
    agreement.workPlan = works;

    return await this._agreementRepository.update(agreement._id, agreement);
  }

  async removeWorkPlan(id: string, workPlanId: string): Promise<AgreementInterface> {
    const agreement = await this._agreementRepository.findById(id);
    agreement.workPlan = agreement.workPlan.filter(item => item._id.toString() !== workPlanId);
    await this._workPlanService.deleteById(workPlanId);
    return await this._agreementRepository.update(id, agreement);
  }
}
