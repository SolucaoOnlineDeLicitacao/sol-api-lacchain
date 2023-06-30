import { ApiProperty } from "@nestjs/swagger";
import { ContractStatusEnum } from "../enums/contract-status.enum";

export abstract class ContractUpdateStatusItemDto {


    @ApiProperty({ type: String, enum: ContractStatusEnum })
    status: ContractStatusEnum;

    @ApiProperty({ type: Number })
    items_received: number;

}