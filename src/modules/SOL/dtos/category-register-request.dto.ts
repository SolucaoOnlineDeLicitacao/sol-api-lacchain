import { ApiProperty } from "@nestjs/swagger";
export abstract class CategoryRegisterDto {

    @ApiProperty({ type: String })
    category_name: string;

    @ApiProperty({ type: String })
    segment: string;

    identifier: number;

}