import { ApiProperty } from "@nestjs/swagger";

export class TokenTransferResponseDto {

    constructor(
        public transactionHash: string
    ) { }
}