import { Injectable } from "@nestjs/common";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AgreementRepository } from "../repositories/agreement.repository";
import { UserRepository } from "../repositories/user.repository";
import { AgreementInterface } from "../interfaces/agreement.interface";
import { WorkPlanService } from "./work-plan.service";
import { AssociationService } from "../services/association.service";
import { ResponseEndpointAgreementDto } from "../dtos/response-endpoint-agreement.dto";
import { AgreementStatusEnum } from "../enums/agreement-status.enum";
import { CostItemsService } from "./cost-items.service";

@Injectable()
export class AgreementService {
  constructor(
    private readonly _agreementRepository: AgreementRepository,
    private readonly _userRepository: UserRepository,
    private readonly _workPlanService: WorkPlanService,
    private readonly _associationService: AssociationService,
    private readonly _costItemsService: CostItemsService
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

  async findForAssociation(associationId: string): Promise<AgreementInterface[]> {
    const user = await this._userRepository.getById(associationId);
    //@ts-ignore
    const result = await this._agreementRepository.findForAssociation(user.association?._id.toString());
    return result;
  }

  async update(id: string, dto: AgreementRegisterRequestDto): Promise<AgreementInterface> {
    dto.reviewer = await this._userRepository.getById(dto.reviewerId);
    if (!dto.reviewer) throw new Error("User not found");

    dto.association = await this._associationService.getById(dto.associationId);
    if (!dto.association) throw new Error("Association not found");

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

  async handlerJob(data: ResponseEndpointAgreementDto[]) {
    const costItemsAll = await this._costItemsService.list();
    data.forEach(async item => {
      const association = await this._associationService.getByCnpj(item.covenant_cnpj);
      const reviewer = await this._userRepository.getByEmail(item.admin.email);

      if (!association || !reviewer) return;

      const signature_date = new Date(item.signature_date || "");
      const validity_date = new Date(item.validity_date || "");
      
      const agreement = await this._agreementRepository.register({
        association: association,
        reviewer: reviewer,
        city: item.city_code,
        status: AgreementStatusEnum.inExecution,
        register_number: item.number,
        signature_date: signature_date,
        value: item.estimated_cost,
        register_object: item.name,
        validity_date: validity_date,
        states: "",
        associationId: association._id.toString(),
        reviewerId: reviewer._id.toString(),
      });
      item.groups.forEach(async group => {
        let products: {
          quantity: number;
          unitValue: number;
          costItems: string;
        }[] = [];
        group.group_items.forEach(async produtcs => {
          const costItems = await this._costItemsService.register({
            categoryId: costItemsAll[0].category._id,
            category: costItemsAll[0].category,
            name: Number(produtcs.group_id).toString(),
            code: Number(produtcs.code).toString(),
            productId: costItemsAll[0].product._id,
            product: costItemsAll[0].product,
            product_relation: costItemsAll[0].product_relation,
            unitMeasure: produtcs.unit,
            specification: produtcs.description,
            sustainable: false,
          });
          products.push({
            quantity: produtcs.quantity,
            unitValue: produtcs.estimated_cost,
            costItems: costItems as any,
          });
        });
        const workPlan = await this._workPlanService.register({
          name: group.name,
          product: products,
        });
        await this.addWorkPlan(agreement._id.toString(), workPlan._id.toString())
      });
    });
  }
}
