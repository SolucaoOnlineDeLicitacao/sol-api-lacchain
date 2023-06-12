import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export abstract class ProposalRegisterDto {

    @ApiProperty({ type: String })
    total_value: string

    @ApiProperty({ type: Boolean , default: false})
    deleted: boolean;

    @ApiProperty({ type: String, enum: ProposalStatusEnum, default: ProposalStatusEnum.aguardando })
    status: ProposalStatusEnum;

    @ApiProperty({ type: Array })
    item_list: string[];

}