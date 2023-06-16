import { ApiProperty } from "@nestjs/swagger";
import { ContractStatusEnum } from "../enums/contract-status.enum";

export abstract class ContractUpdateDto {


    @ApiProperty({ type: String, enum: ContractStatusEnum })
    status: ContractStatusEnum;

    @ApiProperty({ type: String })
    association_id: string;

}