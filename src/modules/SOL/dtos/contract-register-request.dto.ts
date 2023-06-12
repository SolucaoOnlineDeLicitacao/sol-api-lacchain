import { ApiProperty } from "@nestjs/swagger";
import { ContractStatusEnum } from "../enums/contract-status.enum";

export abstract class ContractRegisterDto {

    @ApiProperty({ type: String })
    contract_number: string;


    @ApiProperty({ type: String })
    bid_number: string;

    @ApiProperty({ type: String })
    supplier_id: string;

    @ApiProperty({ type: String })
    value: string;

    @ApiProperty({ type: String })
    contract_document: string

    @ApiProperty({ type: String, enum: ContractStatusEnum })
    status: ContractStatusEnum;

    @ApiProperty({ type: Array })
    proposal_id: string[];

}