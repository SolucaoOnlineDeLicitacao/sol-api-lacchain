import { ApiProperty } from "@nestjs/swagger";

export class TokenTransferToResponseDto {

    constructor(
        public transactionHash: string
    ) { }
}