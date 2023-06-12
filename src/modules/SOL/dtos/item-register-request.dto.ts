import { ApiProperty } from "@nestjs/swagger";


export abstract class ItemRequestDto {
    
    @ApiProperty({ type: String })
    group: string;

    @ApiProperty({ type: String })
    item: string;

    @ApiProperty({ type: String })
    quantity: string;

    // @ApiProperty({ type: String })
    // files: string[];
}