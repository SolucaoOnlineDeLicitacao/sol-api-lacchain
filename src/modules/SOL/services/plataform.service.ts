import {  Injectable, Logger } from "@nestjs/common";
import { BidDateUpdateDto } from "../dtos/bid-date-update.dto";
import { PlataformRepository } from "../repositories/plataform.repository";
import { PlataformModel } from "../models/plataform.model";

@Injectable()
export class PlataformService {
  private readonly _logger = new Logger(PlataformService.name);

  constructor(
    private readonly _plataformRepository: PlataformRepository,

  ) { }

 async register(dto:BidDateUpdateDto): Promise<PlataformModel>{
  const config = await this._plataformRepository.findOne()
  if (config) {
    return await this._plataformRepository.update(config._id,dto)
  }
  return await this._plataformRepository.register(dto)
 }
 async findOne(): Promise<PlataformModel>{
  return await this._plataformRepository.findOne()
 }
 async update(_id:string, dto:BidDateUpdateDto): Promise<PlataformModel>{
  return await this._plataformRepository.update(_id,dto)
 }

}
