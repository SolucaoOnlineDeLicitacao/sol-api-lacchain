import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";
import { BidModel } from "../models/bid.model";
import { AllotmentModel } from "../models/allotment.model";
import { User } from "../schemas/user.schema";
import { UserModel } from "../models/user.model";
import { ValueForAllotmentInterface } from "../interfaces/value-for-allotment.interface";

export abstract class ProposalRegisterDto {

    @ApiProperty({ type: String })
    total_value: string

    @ApiProperty({ type: Boolean, default: false })
    deleted: boolean;

    @ApiProperty({ type: String, enum: ProposalStatusEnum, default: ProposalStatusEnum.aguardando1 })
    status: ProposalStatusEnum;

    @ApiProperty({ type: Array })
    item_list: string[];

    @ApiProperty({ type: String })
    licitacaoId: string;

    @ApiProperty({ type: String })
    proposedById: string;

    proposedBy: UserModel;

    bid: BidModel;

    @ApiProperty({ type: [String] })
    allotmentIds: string[];

    allotment: AllotmentModel[];

    @ApiProperty({ type: String })
    file: string;

    @ApiProperty({ type: Boolean, default: false })
    association_accept: boolean;

    @ApiProperty({ type: Boolean, default: false })
    supplier_accept: boolean;

    proposalWin: boolean;

    @ApiProperty({ type: Number })
    freight: number;

    totalValueForAllotment?: ValueForAllotmentInterface[]

}