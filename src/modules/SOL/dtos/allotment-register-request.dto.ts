import { ApiProperty } from "@nestjs/swagger";
import { ProposalRegisterDto } from "./proposal-register-request.dto";
import { ItemRequestDto } from "./item-register-request.dto";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";

export abstract class AllotmentRegisterDto {

    @ApiProperty({ type: String })
    allotment_name: string

    @ApiProperty({ type: String })
    days_to_delivery: string;

    @ApiProperty({ type: String })
    place_to_delivery: string;

    @ApiProperty({ type: String })
    quantity: string;

    @ApiProperty({ type: String })
    files: string;

    @ApiProperty({ type: ProposalRegisterDto })
    proposals: ProposalRegisterDto[];

    @ApiProperty({ type: ItemRequestDto })
    add_item: ItemRequestDto[];

    @ApiProperty({ enum: AllotmentStatusEnum, type: String })
    status:AllotmentStatusEnum;

}