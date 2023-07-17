import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BidModel } from "../models/bid.model";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { Plataform } from "../schemas/plataform.schema";
import { BidDateUpdateDto } from "../dtos/bid-date-update.dto";
import { PlataformModel } from "../models/plataform.model";

@Injectable()
export class PlataformRepository {
  constructor(@InjectModel(Plataform.name) private readonly _model: Model<BidModel>) {}

  async register(dto: BidDateUpdateDto): Promise<PlataformModel> {
    const data = await new this._model(dto);
    return data.save();
  }

  async findOne(): Promise<PlataformModel> {
     return await  this._model.findOne();
    
  }

  async update(_id: string, dto: BidDateUpdateDto): Promise<PlataformModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          start_at: dto.start_at,
          end_at: dto.end_at
        },
      },
      { new: true }
    );
  }

}
