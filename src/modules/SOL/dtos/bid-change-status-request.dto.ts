import { ApiProperty } from "@nestjs/swagger";
import { BidStatusEnum } from "../enums/bid-status.enum";

export abstract class BidChangeStatusRequestDto {
    @ApiProperty({ type: String, enum: BidStatusEnum })
    status: BidStatusEnum;
}