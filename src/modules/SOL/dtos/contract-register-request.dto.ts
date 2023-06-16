import { ApiProperty } from "@nestjs/swagger";
import { ContractStatusEnum } from "../enums/contract-status.enum";

export abstract class ContractRegisterDto {

    contract_number: string;

    @ApiProperty({ type: String })
    bid_number: string;

    @ApiProperty({ type: String })
    value: string;

    @ApiProperty({ type: String })
    contract_document: string

    @ApiProperty({ type: Boolean, default: false })
    association_accept: boolean;

    @ApiProperty({ type: Boolean, default: false })
    supplier_accept: boolean;

    @ApiProperty({ type: String, enum: ContractStatusEnum })
    status: ContractStatusEnum;

    @ApiProperty({ type: Array })
    proposal_id: string[];

    @ApiProperty({ type: String })
    association_id: string;

    @ApiProperty({ type: String })
    supplier_id: string;
}