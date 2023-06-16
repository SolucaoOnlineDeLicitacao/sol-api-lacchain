import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { UserModel } from "../models/user.model";

export abstract class ProposalAcceptedRequestDto {
    @ApiProperty({ type: String, enum: ProposalStatusEnum, default: ProposalStatusEnum.aceitoAssociacao })
    status: ProposalStatusEnum;

    acceptBy: UserModel;

    @ApiProperty({ type: Date, default: new Date() })
    acceptAt: Date;

}