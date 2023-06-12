import { BadRequestException, Injectable, Logger } from "@nestjs/common";


import { SupplierRepository } from "../repositories/supplier.repository";
import { SupplierModel } from "../models/supplier.model";
import { SupplierRegisterDto } from "../dtos/supplier-register-request.dto";
import { SupplierUpdateStatusDto } from "../dtos/supplier-update-status-request.dto";
import { SupplierGroupIdUpdateDto } from "../dtos/supplier-group-id-update.dto";

@Injectable()
export class SupplierService {

    private readonly _logger = new Logger(SupplierService.name);

    constructor(

        private readonly _supplierRepository: SupplierRepository
    ) { }




    async register(dto: SupplierRegisterDto): Promise<SupplierModel> {
       const result = await this._supplierRepository.register(dto)

        return result;

    }

    async list(): Promise<SupplierModel[]> {
        const result = await this._supplierRepository.list();
        return result;
    }

    async listById(_id: string): Promise<SupplierModel> {
        const result = await this._supplierRepository.listById(_id);
        return result;
    }

    async update(_id: string, dto: SupplierRegisterDto): Promise<SupplierModel> {
        const result = await this._supplierRepository.findByIdAndUpdate(_id, dto);
        return result;
    }

    async updateStatus(_id: string, dto: SupplierUpdateStatusDto): Promise<SupplierModel> {
        const result = await this._supplierRepository.findByIdAndUpdateStatus(_id, dto);
        return result;
    }


    async updateGroup(_id: string, dto: SupplierGroupIdUpdateDto): Promise<SupplierModel> {
        if (!dto.group_id) {
            throw new BadRequestException('Informe a categoria e segmento.');
        }
        const item = await this._supplierRepository.listById(_id)
        const hasItem = item.group_id.find(ele => ele === dto.group_id)
        if (hasItem !== undefined ) {
            if ( item.group_id.find(ele => ele === dto.group_id).length === 0 ) {
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


}
