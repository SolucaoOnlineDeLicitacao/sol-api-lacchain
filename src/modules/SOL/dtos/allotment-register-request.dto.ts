import { ApiProperty } from "@nestjs/swagger";
import { AddressRegisterDto } from "src/shared/dtos/address-register.dto";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { AllotmentRequestDto } from "./allotment-request.dto";
import { User } from "../schemas/user.schema";
import { UserRegisterRequestDto } from "./user-register-request.dto";
import { BidStatusEnum } from "../enums/bid-status.enum";

import { AssociationInterface } from "../interfaces/association.interface";
import { UserInterface } from "../interfaces/user.interface";
import { Items } from "../schemas/items.schema";
import { Proposal } from "../schemas/proposal.schema";
import { ProposalRegisterDto } from "./proposal-register-request.dto";
import { ItemRequestDto } from "./item-register-request.dto";

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





}