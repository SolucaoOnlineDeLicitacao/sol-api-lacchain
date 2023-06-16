import { ApiProperty } from "@nestjs/swagger";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";
import { Bids } from "../schemas/bids.schema";
import { BidModel } from "../models/bid.model";

export abstract class ModelContractUpdateDto {

    @ApiProperty({ type: String })
    name: string;
    
    @ApiProperty({ type: String, enum: ModelContractStatusEnum })
    status: ModelContractStatusEnum;

    @ApiProperty({ type: String})
    bid: string;
    
    @ApiProperty({ type: String })
    contract: string;
}