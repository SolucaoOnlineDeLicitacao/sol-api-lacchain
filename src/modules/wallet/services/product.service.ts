import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AssociationRepository } from "../repositories/association.repository";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationModel } from "../models/association.model";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidRepository } from "../repositories/bid.repository";
import { BidModel } from "../models/bid.model";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { UserRepository } from "../repositories/user.repository";
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
        const result = await this._productRepository.update(_id, dto);
        return result;
    }



    async getById(_id: string): Promise<ProductModel> {
        const result = await this._productRepository.getById(_id);
        return result;
    }



    async deleteById(_id: string) {
        return await this._productRepository.deleteById(_id);
    }


}


// Enquanto a situação da licitação está como "Em rascunho" é possível clicar no botão
// “Editar" para alterar todos os campos, exceto "Tipo de licitação" e "Modalidade", que não
// podem ser modificados.
// Além disso, enquanto está sob o status "Em rascunho", a licitação ainda pode ser excluída
// clicando no botão “Excluir”.