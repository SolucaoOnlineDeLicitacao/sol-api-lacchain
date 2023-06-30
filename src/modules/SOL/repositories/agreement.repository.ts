import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AgreementModel } from "../models/agreement.model";
import { Agreement } from "../schemas/agreement.schema";

@Injectable()
export class AgreementRepository {
  constructor(@InjectModel(Agreement.name) private readonly _model: Model<AgreementModel>) { }

  async findById(id: string): Promise<AgreementModel> {
    return await this._model.findOne({ _id: id }).populate('reviewer').populate('workPlan').populate('association');
  }

  async deleteById(id: string): Promise<AgreementModel> {
    return await this._model.findByIdAndDelete({ _id: id });
  }

  async register(dto: AgreementRegisterRequestDto): Promise<AgreementModel> {
    const data = new this._model(dto);
    return await data.save();
  }

  async findAll(): Promise<AgreementModel[]> {
    return await this._model.find().populate('reviewer').populate('association').populate(
      {
        path: "workPlan",
        populate: {
          path: "product",
          populate: {
            path: "costItems",
            populate: {
              path: "category"
            }
          }
        }
      }
    );
  }

  async findForAssociation(associationId: string): Promise<AgreementModel[]> {
    return await this._model.find({ association: { _id: associationId } }).populate('reviewer').populate('workPlan').populate('association');
  }

  async update(id: string, dto: any): Promise<AgreementModel> {
    return await this._model.findByIdAndUpdate({ _id: id }, {
      $set: {
        ...dto
      }
    }, { new: true });
  }
}
