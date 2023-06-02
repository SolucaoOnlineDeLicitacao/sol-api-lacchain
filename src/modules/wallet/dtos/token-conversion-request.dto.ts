import { ApiProperty } from "@nestjs/swagger";
import { AvaibleSymbolEnum } from "../enums/avaible-symbol.enum";

export class TokenConversionRequestDto {

    @ApiProperty({ type: String, enum: Object.keys(AvaibleSymbolEnum) })
    symbol: string;

    @ApiProperty({ type: String })
    value: string;
}