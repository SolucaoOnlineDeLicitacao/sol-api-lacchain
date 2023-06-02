import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PixConfirmationRegisterRequestDto } from "../dtos/pix-confirmation-register-request.dto";
import { PixConfirmationStatus } from "../dtos/pix-confirmation-status";
import { PixConfirmationUpdateRequestDto } from "../dtos/pix-confirmation-update.dto";
import { PixConfirmationModel } from "../models/pix-confirmation.model";
import { PixConfirmation } from "../schemas/pix-confirmation.schema";

@Injectable()
export class PixConfirmationRepository {

    constructor(
        @InjectModel(PixConfirmation.name) private readonly _model: Model<PixConfirmationModel>,
    ) { }

    async listByStatus(status: PixConfirmationStatus): Promise<PixConfirmationModel[]> {
        return await this._model.find({ status })
            .populate('user');
    }

    async list(): Promise<PixConfirmationModel[]> {
        return await this._model.find()
            .populate('user');
    }

    async register(dto: PixConfirmationRegisterRequestDto): Promise<PixConfirmationModel> {
        const data = await new this._model(dto);
        return data.save();
    }

    async updateStatus(_id: string, dto: PixConfirmationUpdateRequestDto): Promise<PixConfirmationModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                status: dto.status,
                comment: dto.comment
            }
        });
    }

    async listByUser(userId: string, dateFrom: string, dateTo: string, status: string): Promise<PixConfirmationModel[]> {
        let args = {};
        if (userId) {
            Object.defineProperty(args, 'user', {
                value: userId,
                enumerable: true,
            })
        }
        if (status) {
            Object.defineProperty(args, 'status', {
                value: status,
                enumerable: true,
            })
        }
        if (dateFrom && dateTo) {
            let date = new Date(dateTo)
            let newDate = new Date(date.setDate(date.getDate() + 1));
            let createdAt = {
                $gte: new Date(dateFrom).toISOString(),
                $lt: new Date(newDate).toISOString()
            }

            Object.defineProperty(args, 'createdAt', {
                value: createdAt,
                enumerable: true,
            })
        }

        let result = await this._model.find(args);

        return result;
    }
}