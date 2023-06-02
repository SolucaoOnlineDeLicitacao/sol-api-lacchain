import { ApiProperty } from '@nestjs/swagger';
import { MaritalStatusEnum } from 'src/modules/wallet/enums/marital-status.enum';
import { AddressRegisterDto } from './address-register.dto';

export class LegalRepresentativeRegisterDto {

    @ApiProperty({ type: String, required: true })
    name: string;

    @ApiProperty({ type: String, required: true })
    nationality: string;

    @ApiProperty({ type: String, enum: MaritalStatusEnum,  required: true })
    maritalStatus: MaritalStatusEnum;

    @ApiProperty({ type: String, required: true })
    cpf: string;

    @ApiProperty({ type: String, required: true })
    rg: string;

    @ApiProperty({ type: Date, required: true })
    validityData: Date;

    @ApiProperty({ type: AddressRegisterDto })
    address: AddressRegisterDto;

}
