import { ApiProperty } from '@nestjs/swagger';

export class AddressRegisterDto {

    @ApiProperty({ type: String, required: true })
    zipCode: string;

    @ApiProperty({ type: String, required: true })
    publicPlace: string;

    @ApiProperty({ type: String, required: true })
    neighborhood: string;

    @ApiProperty({ type: String, required: true })
    city: string;

    @ApiProperty({ type: String, required: true })
    state: string;

    @ApiProperty({ type: String, required: true })
    latitude: string;

    @ApiProperty({ type: String, required: true })
    longitude: string;

    @ApiProperty({ type: String, required: false })
    complement: string;

    @ApiProperty({ type: String, required: false })
    referencePoint: string;

    @ApiProperty({ type: String, required: false })
    number: string;

}
