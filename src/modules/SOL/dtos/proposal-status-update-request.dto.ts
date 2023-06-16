import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export abstract class ProposalStatusUpdateDto {

    @ApiProperty({ type: String, enum: ProposalStatusEnum, default: ProposalStatusEnum.aguardando1 })
    status: ProposalStatusEnum;



}