import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export abstract class AllotAddProposalDto {

    @ApiProperty({ type: String })
    total_value: string

    @ApiProperty({ type: Boolean, default: false })
    deleted: boolean;

    @ApiProperty({ type: Boolean, default: false })
    association_accept: boolean;

    @ApiProperty({ type: Boolean, default: false })
    supplier_accept: boolean;

    @ApiProperty({ type: String, enum: ProposalStatusEnum })
    status: ProposalStatusEnum;

    @ApiProperty({ type: Array })

    item_list: string[];

}
