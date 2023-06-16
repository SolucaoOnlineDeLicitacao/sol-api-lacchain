import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryModel } from "../models/category.model";
import { CategoryRegisterDto } from "../dtos/category-register-request.dto";
import { randomBytes } from 'crypto';
@Injectable()
export class CategoryService {

    private readonly _logger = new Logger(CategoryService.name);

    constructor(
        private readonly _categoryRepository: CategoryRepository,

    ) { }

    async register(dto: CategoryRegisterDto): Promise<CategoryModel> {

        let numeroAleatorio = parseInt(randomBytes(2).toString('hex'), 16) % 10000;

        const verify = await this._categoryRepository.getByIdentifier(numeroAleatorio);
        if (verify) {
            numeroAleatorio = parseInt(randomBytes(2).toString('hex'), 16) % 10000;
        }

        dto.identifier = numeroAleatorio

        const result = await this._categoryRepository.register(dto);

        return result;

    }

    async list(): Promise<CategoryModel[]> {
        const result = await this._categoryRepository.list();
        return result;
    }

    async update(_id: string, dto: CategoryRegisterDto): Promise<CategoryModel> {
        const item = await this._categoryRepository.getById(_id);
        if(!item) {
            throw new BadRequestException('Categoria não encontrada!');
        }
        const result = await this._categoryRepository.update(_id, dto);
        return result;
    }


    async getById(_id: string): Promise<CategoryModel> {
        const result = await this._categoryRepository.getById(_id);
        if(!result) {
            throw new BadRequestException('Categoria não encontrada!');
        }
        return result;
    }


    async deleteById(_id: string) {
        return await this._categoryRepository.deleteById(_id);
    }


}
