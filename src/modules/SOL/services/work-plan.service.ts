import { Injectable } from "@nestjs/common";
import { WorkPlanRepository } from "../repositories/work-plan.repository";
import { WorkPlanInterface } from "../interfaces/agreement.interface";
import { WorkPlanRegisterRequestDto } from "../dtos/work-plan-register-request.dto";
import { CostItemsService } from "./cost-items.service";
import { WorkPlanModel } from "../models/work-plan.model";

@Injectable()
export class WorkPlanService {
  constructor(
    private readonly _workPlanRepository: WorkPlanRepository,
    private readonly _costItemsService: CostItemsService
  ) {}

  async findById(id: string): Promise<WorkPlanInterface> {
    return await this._workPlanRepository.findById(id);
  }

  async deleteById(id: string): Promise<WorkPlanInterface> {
    return await this._workPlanRepository.deleteById(id);
  }

  async register(dto: WorkPlanRegisterRequestDto): Promise<WorkPlanInterface> {
    const costItems = await this._costItemsService.listByIds(dto.product.map(item => item.costItems));

    for (let i = 0; i < dto.product.length; i++) {
      const item = costItems.find(item => item._id.toString() === dto.product[i].costItems);
      dto.product[i].costItems = item as any;
    }

    const result = await this._workPlanRepository.register(dto as any);

    return result;
  }

  async findAll(): Promise<WorkPlanInterface[]> {
    const result = await this._workPlanRepository.findAll();

    return result;
  }

  async listByIds(ids: string[]): Promise<WorkPlanModel[]> {
    const result = await this._workPlanRepository.listByIds(ids);

    return result;
  }

  async update(id: string, dto: any): Promise<WorkPlanInterface> {
    return await this._workPlanRepository.update(id, dto);
  }
}
