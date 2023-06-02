import { ApiProperty } from "@nestjs/swagger";

export class TokenTransferToRequestDto {

    @ApiProperty({ type: String })  
    symbol: string;
        
    @ApiProperty({ type: String })  
    to: string;

    @ApiProperty({ type: String })
    value: string;

    @ApiProperty({ type: String })
    code: number;
}