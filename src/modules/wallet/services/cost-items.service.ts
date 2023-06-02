import { Injectable, Logger } from "@nestjs/common";
import { CostItemsRegisterRequestDto } from "../dtos/cost-items-register-request.dto";
import { CostItemsModel } from "../models/cost-items.model";
import { CostItemsRepository } from "../repositories/cost-items.repository";
import { CostItemsUpdateRequestDto } from "../dtos/cost-items-update-request.dto";
import { CategoryRepository } from "../repositories/category.repository";
import { ProductRepository } from "../repositories/product.repository";

@Injectable()
export class CostItemsService {

    private readonly _logger = new Logger(CostItemsService.name);

    constructor(
        private _constItemsRepository: CostItemsRepository,
        private _categoryRepository: CategoryRepository,
        private _productRepository: ProductRepository
    ) { }

    async register(dto: CostItemsRegisterRequestDto): Promise<CostItemsModel> {
        const category = await this._categoryRepository.getById(dto.categoryId);
        dto.category = category;

        const product = await this._productRepository.getById(dto.productId);
        dto.product = product;
        
        const result = await this._constItemsRepository.register(dto);
        return result;
    }

    async list(): Promise<CostItemsModel[]> {
        const result = await this._constItemsRepository.list();
        return result;
    }

    async getById(_id: string): Promise<CostItemsModel> {
        const result = await this._constItemsRepository.getById(_id);
        return result;
    }

    async update(_id: string, dto: CostItemsUpdateRequestDto): Promise<CostItemsModel[]> {
        const result = await this._constItemsRepository.update(_id, dto);
        return result;
    }

    async deleteById(_id: string) {
        return await this._constItemsRepository.deleteById(_id);
    }

}