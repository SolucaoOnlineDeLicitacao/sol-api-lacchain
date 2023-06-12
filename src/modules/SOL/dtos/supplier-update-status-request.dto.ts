import { ApiProperty } from "@nestjs/swagger";
import { AddressRegisterDto } from "src/shared/dtos/address-register.dto";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { SuplierTypeEnum } from "../enums/supplier-type.enum";
import { Address } from "src/shared/schemas/address.schema";
import { LegalRepresentative } from "src/shared/schemas/legal-representative.schema";

export abstract class SupplierUpdateStatusDto {

    @ApiProperty({ type: Boolean })
    blocked: boolean

    @ApiProperty({ type: String })
    blocked_reason: string;

    


}