import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { Notification } from "../schemas/notification.schema";
import { NotificationRegisterDto } from "../dtos/notification-register-request.dto";
import { NotificationUpdateDto } from "../dtos/notification-update-request.dto";
import { NotificationTitleUpdateDto } from "../dtos/notification-title-update-request.dto";

@Injectable()
export class NotificationRepository {

    constructor(
        @InjectModel(Notification.name) private readonly _model: Model<NotificationModel>,
    ) { }

    async register(dto: NotificationRegisterDto): Promise<NotificationModel> {

        const data = await new this._model(dto);
        return data.save();
    }

    async addUser(_id: string, dto: NotificationUpdateDto): Promise<NotificationModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $push: {
                to_user: dto.to_user,
            }
        }, {new: true });
    }

    async remove(_id: string, dto: NotificationUpdateDto): Promise<NotificationModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $pull: {
                to_user: dto.to_user,
            }
        }, {new: true });
    }

    async updateTitleDescription(_id: string, dto: NotificationTitleUpdateDto): Promise<NotificationModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                title: dto.title,
                description: dto.description
            }
        }, {new: true });
    }

    async list(): Promise<NotificationModel[]> {
        return await this._model.find();
    }

    async listNonDeleted(): Promise<NotificationModel[]> {
        return await this._model.find({deleted: false});
    }

    async getById(_id: string): Promise<NotificationModel> {
        return await this._model.findOne({ _id });
    }

    async deleteById(_id: string) {
        return await this._model.findByIdAndUpdate({ _id }, {$set: {
            deleted: true
        }}, {new: true});
    }

}