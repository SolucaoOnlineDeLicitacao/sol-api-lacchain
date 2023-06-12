import { ApiProperty } from "@nestjs/swagger";
import { AddressRegisterDto } from "src/shared/dtos/address-register.dto";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";

export abstract class AssociationRegisterRequestDto {

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    cnpj: string;

    @ApiProperty({ type: AddressRegisterDto })
    address: AddressRegisterDto;

    @ApiProperty({ type: LegalRepresentativeRegisterDto })
    legalRepresentative: LegalRepresentativeRegisterDto;
    
}