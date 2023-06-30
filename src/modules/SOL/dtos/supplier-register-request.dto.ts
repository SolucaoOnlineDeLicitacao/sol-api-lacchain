import { ApiProperty } from "@nestjs/swagger";
import { AddressRegisterDto } from "src/shared/dtos/address-register.dto";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { SuplierTypeEnum } from "../enums/supplier-type.enum";
import { Address } from "src/shared/schemas/address.schema";
import { LegalRepresentative } from "src/shared/schemas/legal-representative.schema";
import { CategoryInterface } from "../interfaces/category.interface";

export abstract class SupplierRegisterDto {

    @ApiProperty({ type: String })
    name: string

    @ApiProperty({ type: String })
    cpf: string;

    @ApiProperty({ type: String, enum: SuplierTypeEnum })
    type: SuplierTypeEnum;

    @ApiProperty({ type: AddressRegisterDto })
    address: Address;

    @ApiProperty({ type: LegalRepresentativeRegisterDto })
    legal_representative: LegalRepresentative;

    @ApiProperty({ type: Array })
    group_id: string[];

    @ApiProperty({ type: Array })
    categoriesId: string[];

    categories: CategoryInterface[];

    blocked: boolean;


}