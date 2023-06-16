import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupModel } from "../models/group.model";
import { Group } from "../schemas/group.schema";
import { GroupRegisterDto } from "../dtos/group-register-request.dto";
import { GroupUpdatenameDto } from "../dtos/group-update-name-request.dto";
import { GroupAddItemsRequestDto } from "../dtos/group-add-items-request.dto";

@Injectable()
export class GroupRepository {

    constructor(
        @InjectModel(Group.name) private readonly _model: Model<GroupModel>,
    ) { }

    async register(dto: GroupRegisterDto): Promise<any> {

        const data = await new this._model(dto);
        return data.save();
    }

    async updateName(_id: string, dto: GroupUpdatenameDto): Promise<GroupModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                name: dto.name,
            }
        }, {new: true });
    }

    async addItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel | any> {

        return await this._model.findByIdAndUpdate({ _id }, {
            $push: {
                items: dto,
            }
        }, {new: true });
    }

    async removeItem(_id: string, dto: GroupAddItemsRequestDto): Promise<GroupModel> {

        return await this._model.findOneAndUpdate({ _id }, {
            $pull: {
                items: { cost_item_id: dto.cost_item_id },
            }
        }, {new: true });
    }

    async list(): Promise<GroupModel[]> {
        return await this._model.find();
    }

    async getById(_id: string): Promise<GroupModel> {
        return await this._model.findOne({ _id });
    }

    async deleteById(_id: string) {
        return await this._model.findOneAndDelete({ _id });
    }

}