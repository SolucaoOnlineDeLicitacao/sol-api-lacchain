import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export abstract class ProposalAssociationAcceptUpdateDto {

    @ApiProperty({ type: Boolean, default: false })
    association_accept: boolean;



}