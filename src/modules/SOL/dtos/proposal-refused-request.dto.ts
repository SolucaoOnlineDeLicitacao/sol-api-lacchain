import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { UserModel } from "../models/user.model";
import { ProposalNotificationInterface } from "../interfaces/proposal-notification-dto";

export abstract class ProposalRefusedRequestDto {
    @ApiProperty({type: String})
    refusedBecaused: string;

    @ApiProperty({type: Date, default: new Date()})
    refusedAt: Date;

    @ApiProperty({type: Object })
    data: ProposalNotificationInterface;

    @ApiProperty({ type: String, enum: ProposalStatusEnum, default: ProposalStatusEnum.recusadaAssociacao })
    status: ProposalStatusEnum;

    refusedBy: UserModel;

}