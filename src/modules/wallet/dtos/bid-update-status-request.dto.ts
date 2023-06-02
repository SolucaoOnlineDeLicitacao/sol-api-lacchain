import { ApiProperty } from "@nestjs/swagger";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { UserInterface } from "../interfaces/user.interface";

export abstract class BidUpdateStatusRequestDto {
    @ApiProperty({ type: String, enum: BidStatusEnum })
    status: BidStatusEnum;

    proofreader: UserInterface;
}