import { BadRequestException, Injectable, Logger } from "@nestjs/common";
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
  ) {}

  async register(dto: CostItemsRegisterRequestDto): Promise<CostItemsModel> {
    const category = await this._categoryRepository.getById(dto.categoryId);
    if (!category) {
      throw new BadRequestException("Categoria não encontrada!");
    }
    dto.category = category;

    const product = await this._productRepository.getById(dto.productId);
    if (!product) {
      throw new BadRequestException("Produto não encontrado!");
    }
    dto.product = product;

    const result = await this._constItemsRepository.register(dto);
    return result;
  }

  async list(): Promise<CostItemsModel[]> {
    const result = await this._constItemsRepository.list();
    return result;
  }

  async listByIds(ids: string[]): Promise<CostItemsModel[]> {
    const result = await this._constItemsRepository.listByIds(ids);
    return result;
  }

  async getById(_id: string): Promise<CostItemsModel> {
    const result = await this._constItemsRepository.getById(_id);
    if (!result) {
      throw new BadRequestException("Item não encontrado!");
    }
    return result;
  }

  async update(_id: string, dto: CostItemsUpdateRequestDto): Promise<CostItemsModel[]> {
    dto.product = await this._productRepository.getById(dto.productId);
    dto.category = await this._categoryRepository.getById(dto.categoryId);
    const result = await this._constItemsRepository.update(_id, dto);
    if (!result) {
      throw new BadRequestException("Item não encontrado!");
    }
    return result;
  }

  async deleteById(_id: string) {
    return await this._constItemsRepository.deleteById(_id);
  }

  async handlerJob(data: any[]) {
    const costItemsAll = await this.list();
    const now = new Date();
    for (let item of data) {
      const result = await this.register({
        categoryId: costItemsAll[0].category._id,
        category: costItemsAll[0].category,
        name: item.title,
        code: Number(item.id).toString(),
        productId: costItemsAll[0].product._id,
        product: costItemsAll[0].product,
        product_relation: costItemsAll[0].product_relation,
        unitMeasure: item.unit,
        specification: item.description,
        sustainable: false,
      });
      if (!result) throw new BadRequestException("Não foi possivel criar o item!");
    }
  }
}
