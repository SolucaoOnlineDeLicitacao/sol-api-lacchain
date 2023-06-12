import { Injectable } from "@nestjs/common";
import { AssociationModel } from "../models/association.model";
import { Association } from "../schemas/association.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { Bids } from "../schemas/bids.schema";
import { BidModel } from "../models/bid.model";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { Products } from "../schemas/product.schema";
import { ProductModel } from "../models/product.model";
import { ProductRegisterDto } from "../dtos/product-register-request.dto";

@Injectable()
export class ProductRepository {

    constructor(
        @InjectModel(Products.name) private readonly _model: Model<ProductModel>,
    ) { }

    async register(dto: ProductRegisterDto): Promise<any > {
        const data = await new this._model(dto);
        return data.save();
    }

    async update(_id: string, dto: ProductRegisterDto): Promise<ProductModel> {
        return await this._model.findOneAndUpdate({ _id }, {
            $set: {
                product_name: dto.product_name,
     
             
            }
        }, {new: true });
    }

    async list(): Promise<ProductModel[]> {
        return await this._model.find();
    }

    async getById(_id: string): Promise<ProductModel> {
        return await this._model.findOne({ _id });
    }

    async getByIdentifier(identifier: number): Promise<ProductModel> {
        return await this._model.findOne({ identifier });
    }

    async deleteById(_id: string) {
        return await this._model.findByIdAndDelete({ _id });
    }

}