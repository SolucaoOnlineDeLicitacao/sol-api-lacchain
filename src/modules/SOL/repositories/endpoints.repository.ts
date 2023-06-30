import { Injectable } from "@nestjs/common";
import { EndPoints } from "../schemas/endpoints.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EndPointsModel } from "../models/endpoints.model";
import { EndPointsInterface } from "../interfaces/endpoits.interface";

@Injectable()
export class EndPointsRepository {
  
  constructor(@InjectModel(EndPoints.name) private readonly _model: Model<EndPointsModel>) {}

  async register(dto: EndPointsInterface): Promise<EndPointsModel> {
    const data = await new this._model(dto);
    return data.save();
  }

  async list(): Promise<EndPointsModel[]> {
    return await this._model.find();
  }

  async getById(_id: string): Promise<EndPointsModel> {
    return await this._model.findOne({ _id });
  }

  async update(_id: string, dto: EndPointsInterface): Promise<EndPointsModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: dto,
      },
      { new: true }
    );
  }

  async deleteById(_id: string) {
    return await this._model.findOneAndDelete({ _id });
  }

  async getByEndpointType(endpointType: string): Promise<EndPointsModel> {
    return await this._model.findOne({ endpointType });
  }
}
