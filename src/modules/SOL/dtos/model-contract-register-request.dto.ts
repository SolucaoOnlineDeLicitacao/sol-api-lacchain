import { ApiProperty } from "@nestjs/swagger";
import { Bids } from "../schemas/bids.schema";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";

export abstract class ModelContractRegisterDto {

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, enum: ModelContractStatusEnum })
    status: ModelContractStatusEnum;

    @ApiProperty({ type: String})
    classification: string;

    @ApiProperty({ type: String })
    contract: string;

}