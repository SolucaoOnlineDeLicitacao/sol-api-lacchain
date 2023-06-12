import { Injectable } from "@nestjs/common";
import { WorkPlan } from "../schemas/work-plan.schema";
import { WorkPlanModel } from "../models/work-plan.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WorkPlanInterface } from "../interfaces/agreement.interface";

@Injectable()
export class WorkPlanRepository {
  constructor(@InjectModel(WorkPlan.name) private readonly _model: Model<WorkPlanModel>) {}

  async findById(id: string): Promise<WorkPlanModel> {
    return await this._model.findOne({ _id: id }).populate('product.costItems');
  }

  async deleteById(id: string): Promise<WorkPlanModel> {
    return await this._model.findByIdAndDelete({ _id: id });
  }

  async register(dto: WorkPlanInterface): Promise<WorkPlanModel> {
    const data = new this._model(dto);
    return await data.save();
  }

  async findAll(): Promise<WorkPlanModel[]> {
    return await this._model.find().populate('product.costItems');
  }

  async update(id: string, dto: WorkPlanInterface): Promise<WorkPlanModel> {
    return await this._model.findByIdAndUpdate({ _id: id }, { $set: { ...dto } }, { new: true });
  }

  async listByIds(ids: string[]): Promise<WorkPlanModel[]> {
    return await this._model.find({ _id: { $in: ids } }).populate('product.costItems');
  }
}
