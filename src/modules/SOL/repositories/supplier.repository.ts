import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Supplier } from "../schemas/supplier.schema";
import { SupplierModel } from "../models/supplier.model";
import { SupplierRegisterDto } from "../dtos/supplier-register-request.dto";
import { SupplierUpdateStatusDto } from "../dtos/supplier-update-status-request.dto";
import { SupplierGroupIdUpdateDto } from "../dtos/supplier-group-id-update.dto";
import { NotificationInterface } from "../interfaces/notification.interface";
import { SupplierRegisterBlockRequestDto } from "../dtos/supplier-register-block-request.dt";

@Injectable()
export class SupplierRepository {

    constructor(
        @InjectModel(Supplier.name) private readonly _model: Model<SupplierModel>,
    ) { }

    async register(dto: SupplierRegisterDto): Promise<SupplierModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async list(): Promise<SupplierModel[]> {
        const data = await this._model.find().populate('categories');
        return data
    }

    async listById(_id: string): Promise<SupplierModel> {
        const data = await this._model.findOne({ _id }).populate('categories');
        return data
    }


    async updateNotifications(_id: string, dto: NotificationInterface): Promise<SupplierModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $push: {
                notification_list: dto
            }
        });
    }

    async findByIdAndUpdate(_id: string, dto: SupplierRegisterDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id }, { $set: dto }, { new: true });
        return data
    }

    async findByIdAndUpdateStatus(_id: string, dto: SupplierUpdateStatusDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id }, {
            $set: {
                blocked: dto.blocked,
                blocked_reason: dto.blocked_reason,

            }
        }, { new: true });
        return data
    }

    async findByIdAndAddGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id }, {
            $push: {
                group_id: dto.group_id,

            }
        }, { new: true });
        return data
    }

    async findByIdAndRemoveGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id }, {
            $pull: {
                group_id: dto.group_id,

            }
        }, { new: true });
        return data
    }

    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

    async block(supplierId: string, dto: SupplierRegisterBlockRequestDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id: supplierId }, {
            $set: {
                blocked: true,
                blocked_reason: dto.blocked_reason
            }
        }, { new: true });
        return data
    }

    async unblock(supplierId: string, dto: SupplierRegisterBlockRequestDto): Promise<SupplierModel> {
        const data = await this._model.findByIdAndUpdate({ _id: supplierId }, {
            $set: {
                blocked: false,
                blocked_reason: dto.blocked_reason
            }
        }, { new: true });
        return data
    }
}
