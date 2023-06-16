import { ApiProperty } from "@nestjs/swagger";

export abstract class ProductRegisterDto {

    @ApiProperty({ type: String })
    product_name: string

    identifier?: number;

}