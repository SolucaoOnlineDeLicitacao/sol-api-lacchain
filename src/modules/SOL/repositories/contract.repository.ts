import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Contract } from "../schemas/contract.schema";
import { ContractModel } from "../models/contract.model";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { ContractStatusEnum } from "../enums/contract-status.enum";
import { ContractUpdateStatusItemDto } from "../dtos/contract-update-status-item-request.dto";
import { BidStatusEnum } from "../enums/bid-status.enum";

@Injectable()
export class ContractRepository {
  constructor(@InjectModel(Contract.name) private readonly _model: Model<ContractModel>) { }

  async register(dto: ContractRegisterDto): Promise<ContractModel> {
    const data = await new this._model(dto);
    const saveResult = await data.save();
    await this._model.findOneAndUpdate({ _id: saveResult._id }, { $inc: { sequencial_number: 1 } }, { new: true });
    return saveResult;
  }

  async updateStatus(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: dto.status,
        },
      },
      { new: true }
    );
  }

  async updateContractNumber(_id: string, sequencial: number): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          contract_number: `${sequencial}/${new Date().getFullYear()}`,
        },
      },
      { new: true }
    );
  }

  async signAssociation(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          association_accept: true,
          association_id: dto.association_id,
          association_sign_date: new Date().toDateString(),
        },
      },
      { new: true }
    );
  }

  async signSupplier(_id: string, dto: ContractUpdateDto): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          supplier_accept: true,
          supplier_id: dto.association_id,
          supplier_sign_date: new Date().toDateString(),
        },
      },
      { new: true }
    );
  }

  async checkAllsignatures(_id: string): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: ContractStatusEnum.assinado,
        },
      },
      { new: true }
    );
  }

  async list(): Promise<ContractModel[]> {
    return await this._model
      .find()
      .populate("bid_number")
      .populate({ path: "bid_number", populate: { path: "agreement" } })
      .populate("association_id")
      .populate("supplier_id")
      .populate('proposal_id');
  }

  async listBidStatusCompleted(): Promise<ContractModel[]> {
    let teste = await this._model
      .find({ 'bid_number.status': BidStatusEnum.completed })
      .populate("bid_number")
      .populate({ path: "bid_number", populate: { path: "agreement" } })
      .populate("association_id")
      .populate("supplier_id")
      .populate('proposal_id');
    return teste
  }

  async listNonDeleted(): Promise<ContractModel[]> {
    return await this._model
      .find({ delete: false })
      .populate("bid_number")
      .populate({ path: "bid_number", populate: { path: "agreement" } })
      .populate("association_id")
      .populate("supplier_id")
      .populate('proposal_id');
  }

  async getById(_id: string): Promise<ContractModel> {
    return await this._model
      .findOne({ _id })
      .populate("bid_number")
      .populate({ path: "bid_number", populate: [{ path: "agreement" }, { path: "add_allotment" }, { path: 'association' }] })
      .populate("association_id")
      .populate("supplier_id")
      .populate({ path: "proposal_id", populate: [{ path: "allotment" }] })
  }

  async getByBidId(_id: string): Promise<ContractModel[]> {
    return await this._model
      .find({ bid_number: _id })
      .populate("bid_number")
      .populate({ path: "bid_number", populate: [{ path: "agreement" }, { path: "add_allotment" }, { path: 'association' }] })
      .populate("association_id")
      .populate("supplier_id")
      .populate('proposal_id');
  }

  async deleteById(_id: string) {
    return await this._model.findByIdAndUpdate(
      { _id },
      {
        $set: {
          delete: true,
        },
      },
      { new: true }
    );
  }

  async updateStatusAndItens(_id: string, dto: ContractUpdateStatusItemDto): Promise<ContractModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: dto.status,
          items_received: dto.items_received,
        },
      }
    );
  }
}
