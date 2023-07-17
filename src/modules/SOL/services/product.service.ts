import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { ProductRegisterDto } from "../dtos/product-register-request.dto";
import { ProductModel } from "../models/product.model";
import { randomBytes } from 'crypto';

@Injectable()
export class ProductService {

    private readonly _logger = new Logger(ProductService.name);

    constructor(
        private readonly _productRepository: ProductRepository,
    
        ) { }

    async register( dto: ProductRegisterDto): Promise<ProductModel> {
 
        let numeroAleatorio = parseInt(randomBytes(2).toString('hex'), 16) % 10000;

        const verify = await this._productRepository.getByIdentifier(numeroAleatorio);
        if (verify) {
            numeroAleatorio = parseInt(randomBytes(2).toString('hex'), 16) % 10000;
        }

        dto.identifier = numeroAleatorio
       
        const result = await this._productRepository.register(dto);


        return result;

    }

    async list(): Promise<ProductModel[]> {
        const result = await this._productRepository.list();
        return result;
    }

    async update(_id: string, dto: ProductRegisterDto): Promise<ProductModel> {
        const item = await this._productRepository.getById(_id);
        if (!item) {
            throw new BadRequestException('Produto não encontrado!');
        }
        const result = await this._productRepository.update(_id, dto);
        return result;
    }

    async getById(_id: string): Promise<ProductModel> {
        const result = await this._productRepository.getById(_id);
        if (!result) {
            throw new BadRequestException('Grupo não encontrado!');
        }
        return result;
    }

    async deleteById(_id: string) {
        return await this._productRepository.deleteById(_id);
    }

    getByName(name: string): Promise<ProductModel> {
        return this._productRepository.getByName(name);
    }


}
