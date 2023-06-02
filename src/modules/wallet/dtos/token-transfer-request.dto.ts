import { ApiProperty } from "@nestjs/swagger";

export class TokenTransferRequestDto {

    @ApiProperty({ type: String })
    symbol: string;

    @ApiProperty({ type: String })
    value: string;
}