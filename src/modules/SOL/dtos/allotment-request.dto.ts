import { ApiProperty } from "@nestjs/swagger";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { ItemRequestDto } from "./item-register-request.dto";
import { ProposalRegisterDto } from "./proposal-register-request.dto";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";

export abstract class AllotmentRequestDto {
    
    @ApiProperty({ type: String })
    allotment_name: string;

    @ApiProperty({ type: String })
    days_to_delivery: string;

    @ApiProperty({ type: String })
    place_to_delivery: string;

    @ApiProperty({ type: String })
    quantity: string;

    @ApiProperty({ type: String })
    files: string;

    @ApiProperty({ type: ItemRequestDto })
    add_item: ItemRequestDto[];

    @ApiProperty({ type: ProposalRegisterDto })
    proposals: ProposalRegisterDto[];

    @ApiProperty({ enum: AllotmentStatusEnum, type: String })
    status:AllotmentStatusEnum;

    _id?: string;
}