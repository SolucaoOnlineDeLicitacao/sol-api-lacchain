import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "../schemas/category.schema";
import { CategoryModel } from "../models/category.model";
import { CategoryRegisterDto } from "../dtos/category-register-request.dto";

@Injectable()
export class CategoryRepository {

    constructor(
        @InjectModel(Category.name) private readonly _model: Model<CategoryModel>,
    ) { }

    async register(dto: CategoryRegisterDto): Promise<any > {
        const data = await new this._model(dto);
        return data.save();
    }

    async update(_id: string, dto: CategoryRegisterDto): Promise<CategoryModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                category_name: dto.category_name,
                segment: dto.segment
            }
        }, {new: true });
    }

    async list(): Promise<CategoryModel[]> {
        return await this._model.find();
    }

    async getById(_id: string): Promise<CategoryModel> {
        return await this._model.findOne({ _id });
    }

    async getByIdentifier(identifier: number): Promise<CategoryModel> {
        return await this._model.findOne({ identifier });
    }

    async deleteById(_id: string) {
        return await this._model.findByIdAndDelete({ _id });
    }

    async listByIds(ids: string[]): Promise<CategoryModel[]> {
        return await this._model.find({ _id: { $in: ids } });
    }

}