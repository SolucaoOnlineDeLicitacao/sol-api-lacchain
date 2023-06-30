import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SupplierRepository } from "../repositories/supplier.repository";
import { SupplierModel } from "../models/supplier.model";
import { SupplierRegisterDto } from "../dtos/supplier-register-request.dto";
import { SupplierUpdateStatusDto } from "../dtos/supplier-update-status-request.dto";
import { SupplierGroupIdUpdateDto } from "../dtos/supplier-group-id-update.dto";
import { CategoryRepository } from "../repositories/category.repository";
import { SupplierRegisterBlockRequestDto } from "../dtos/supplier-register-block-request.dt";

@Injectable()
export class SupplierService {

    private readonly _logger = new Logger(SupplierService.name);

    constructor(

        private readonly _supplierRepository: SupplierRepository,
        private readonly _categoryRepository: CategoryRepository,
    ) { }

    async register(dto: SupplierRegisterDto): Promise<SupplierModel> {

        if (dto.categoriesId.length) {
            const categories = await this._categoryRepository.listByIds(dto.categoriesId);
            if (!categories.length)
                throw new BadRequestException('Categoria não encontrada!');

            dto.categories = categories
        }


        dto.blocked = false;

        const result = await this._supplierRepository.register(dto)
        if (!result) {
            throw new BadRequestException('Não foi possivel cadastrar o fornecedor!');
        }

        return result;

    }

    async list(): Promise<SupplierModel[]> {
        const result = await this._supplierRepository.list();
        return result;
    }

    async listById(_id: string): Promise<SupplierModel> {
        const result = await this._supplierRepository.listById(_id);
        if (!result) {
            throw new BadRequestException('Fornecedor não encontrado!');
        }
        return result;
    }

    async update(_id: string, dto: SupplierRegisterDto): Promise<SupplierModel> {
        const item = await this._supplierRepository.listById(_id)
        if (!item) {
            throw new BadRequestException('Fornecedor não encontrado!');
        }
        if (dto.categoriesId.length) {
            const categories = await this._categoryRepository.listByIds(dto.categoriesId);
            if (!categories.length)
                throw new BadRequestException('Categoria não encontrada!');

            dto.categories = categories
        }
        const result = await this._supplierRepository.findByIdAndUpdate(_id, dto);
        return result;
    }

    async updateStatus(_id: string, dto: SupplierUpdateStatusDto): Promise<SupplierModel> {
        const item = await this._supplierRepository.listById(_id)
        if (!item) {
            throw new BadRequestException('Fornecedor não encontrado!');
        }
        const result = await this._supplierRepository.findByIdAndUpdateStatus(_id, dto);
        return result;
    }


    async updateGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        if (!dto.group_id) {
            throw new BadRequestException('Informe a categoria e segmento.');
        }
        const item = await this._supplierRepository.listById(_id)
        const hasItem = item.group_id.find(ele => ele === dto.group_id)
        if (hasItem !== undefined) {
            if (item.group_id.find(ele => ele === dto.group_id).length === 0) {
                const result = await this._supplierRepository.findByIdAndAddGroup(_id, dto);
                return result;

            } else {
                const result = await this._supplierRepository.findByIdAndRemoveGroup(_id, dto);
                return result;
            }
        } else {
            const result = await this._supplierRepository.findByIdAndAddGroup(_id, dto);
            return result;
        }



    }

    async deleteById(_id: string) {
        return await this._supplierRepository.deleteById(_id);
    }

    async block(supplierId: string, dto: SupplierRegisterBlockRequestDto) {
        return await this._supplierRepository.block(supplierId, dto);
    }

    async unblock(supplierId: string, dto: SupplierRegisterBlockRequestDto) {
        return await this._supplierRepository.unblock(supplierId, dto);
    }


}
