import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ZiFeeInterface } from "../interfaces/zi-fee.interface";
import { ZiFee } from "../schemas/zi-fee.schema";

@Injectable()
export class ZiFeeRepository {

  constructor(
    @InjectModel(ZiFee.name) private readonly model: Model<ZiFeeInterface>,
  ) { }

  async getByName(name: string): Promise<ZiFeeInterface> {
    return this.model.findOne({
      name
    });
  }
}