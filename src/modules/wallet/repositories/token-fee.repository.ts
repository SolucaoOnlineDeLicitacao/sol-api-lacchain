import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TokenFeeInterface } from "../interfaces/token-fee.interface";
import { TokenFee } from "../schemas/token-fee.schema";

@Injectable()
export class TokenFeeRepository {

  constructor(
    @InjectModel(TokenFee.name) private readonly model: Model<TokenFeeInterface>,
  ) { }

  async getBySymbol(symbol: string): Promise<TokenFeeInterface> {
    return this.model.findOne({
      symbol
    });
  }
}