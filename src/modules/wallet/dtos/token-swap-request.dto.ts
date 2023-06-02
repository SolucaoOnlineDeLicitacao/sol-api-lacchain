import { ApiProperty } from "@nestjs/swagger";
import { TokenSwapSymbolEnum } from "./token-swap-symbol.enum";

export abstract class TokenSwapRequestDto {

    userId: string;
    
    userWallet: string;

    @ApiProperty({ type: String, enum: Object.keys(TokenSwapSymbolEnum) })
    from: string;

    @ApiProperty({ type: String, enum: Object.keys(TokenSwapSymbolEnum) })
    to: string;

    @ApiProperty({ type: String })
    value: string;
}