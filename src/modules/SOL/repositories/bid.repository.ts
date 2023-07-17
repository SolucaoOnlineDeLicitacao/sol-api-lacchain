import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Bids } from "../schemas/bids.schema";
import { BidModel } from "../models/bid.model";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";
import { BidAddProposalDto } from "../dtos/bid-add-proposal.dto";
import { BidChangeStatusRequestDto } from "../dtos/bid-change-status-request.dto";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { SupplierModel } from "../models/supplier.model";

@Injectable()
export class BidRepository {
  constructor(@InjectModel(Bids.name) private readonly _model: Model<BidModel>) {}

  async register(dto: BideRegisterDto): Promise<any> {
    const data = await new this._model(dto);
    return data.save();
  }

  async update(_id: string, dto: BidUpdateDto): Promise<BidModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          description: dto.description,
          agreement: dto.agreement,
          classification: dto.classification,
          start_at: dto.start_at,
          end_at: dto.end_at,
          days_to_tiebreaker: dto.days_to_tiebreaker,
          days_to_delivery: dto.days_to_delivery,
          local_to_delivery: dto.local_to_delivery,
          status: dto.status,
          aditional_site: dto.aditional_site,
          add_allotment: dto.add_allotment,
          invited_suppliers: dto.invited_suppliers,
        },
      },
      { new: true }
    );
  }

  async updateStatus(_id: string, dto: BidUpdateStatusRequestDto): Promise<BidModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: dto.status,
          proofreader: dto.proofreader,
          declined_reason: dto.declined_reason,
        },
      },
      { new: true }
    );
  }

  async changeStatus(_id: string, dto: BidChangeStatusRequestDto): Promise<BidModel> {
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

  async addProposal(_id: string, dto: BidAddProposalDto): Promise<BidModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $push: {
          proposal_list: dto.proposal_id,
        },
      },
      { new: true }
    );
  }

  async listAllotmentByBidId(_id: string): Promise<any[]> {
    return await this._model
      .find({ _id })
      .populate("agreement")
      .populate("invited_suppliers")
      .populate("add_allotment")
      .populate("association")
      .populate("add_allotment.proposals");
  }

  async listNonDeletedBids(): Promise<BidModel[]> {
    return await this._model.find({ deleted: false }).populate("agreement").populate("association");
  }
  async listBidByStatus(status: BidStatusEnum): Promise<BidModel[]> {
    return await this._model.find({ status: BidStatusEnum[status] });
  }

  async listForDashboard(): Promise<BidModel[]> {
    return await this._model.find({ status: BidStatusEnum["open"] });
  }

  async list(): Promise<BidModel[]> {
    return await this._model
      .find()
      .populate("add_allotment")
      .populate("agreement")
      .populate("invited_suppliers")
      .populate("association")
      .populate("add_allotment.proposals.proposedBy");
  }

  async getById(_id: string): Promise<BidModel> {
    return await this._model
      .findById({ _id })
      .populate("add_allotment")
      .populate("agreement")
      .populate({ path: "agreement", populate: { path: "reviewer" } })
      .populate("invited_suppliers")
      .populate("association")
      .populate({ path: "association", populate: { path: "association" } });
  }

  async getBidById(_id: string): Promise<Bids> {
    return await this._model.findOne({ _id }).populate("invited_suppliers").populate("association");
  }

  async deleteById(_id: string) {
    return await this._model.findByIdAndUpdate({ _id }, { $set: { deleted: true } }, { new: true });
  }

  async rotineStatus(_id: string, status: string) {
    return await this._model.findByIdAndUpdate({ _id }, { $set: { status: status } }, { new: true });
  }

  async addStartHour(_id: string, hour: string) {
    const ele = await this._model.findByIdAndUpdate({ _id }, { $set: { start_at: hour } }, { new: true });
    return ele;
  }
  async addEndHour(_id: string, hour: string) {
    return await this._model.findByIdAndUpdate({ _id }, { $set: { end_at: hour } }, { new: true });
  }

  async listForSupplier(_id: string): Promise<BidModel[]> {
    return await this._model
      .find({
        $and: [
          {
            $or: [
              { modality: "openClosed" },
              {
                modality: "openInvite",
                invited_suppliers: _id,
              },
              {
                modality: "closedInvite",
                invited_suppliers: _id,
              },
            ],
          },
          {
            $or: [
              { status: BidStatusEnum.open },
              { status: BidStatusEnum.released },
              { status: BidStatusEnum.reopened },
              { status: BidStatusEnum.tiebreaker, invited_suppliers: _id },
            ],
          },
        ],
      })
      .populate("agreement")
      .populate("association")
      .populate({ path: "association", populate: { path: "association" } })
      .populate("invited_suppliers");
  }

  async listByIds(ids: string[]): Promise<BidModel[]> {
    return await this._model
      .find({ _id: { $in: ids } })
      .populate("agreement")
      .populate("association")
      .populate({ path: "association", populate: { path: "association" } })
      .populate("invited_suppliers");
  }

  async sendTieBreaker(_id: string, suppliers: SupplierModel[]): Promise<BidModel> {
    return await this._model.findOneAndUpdate(
      { _id },
      {
        $set: {
          status: BidStatusEnum.tiebreaker,
          invited_suppliers: suppliers,
        },
      },
      { new: true }
    );
  }

  async listWithoutConcluded(): Promise<BidModel[]> {
    return await this._model.find({
      $and: [{ status: { $ne: BidStatusEnum.completed } }, { status: { $ne: BidStatusEnum.deserted } }],
    });
  }
}
