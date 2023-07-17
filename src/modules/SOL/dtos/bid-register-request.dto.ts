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
import { AgreementInterface } from "../interfaces/agreement.interface";

export abstract class BideRegisterDto {

    @ApiProperty({ type: String })
    bid_count: string

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: String })
    agreementId: string;

    @ApiProperty({ type: String })
    classification: string;

    @ApiProperty({ type: String })
    start_at: string;

    @ApiProperty({ type: String })
    end_at: string;

    @ApiProperty({ type: String })
    days_to_delivery: string;

    @ApiProperty({ type: String })
    days_to_tiebreaker: string;

    @ApiProperty({ type: String })
    local_to_delivery: string;

    @ApiProperty({ type: String, enum: BidStatusEnum })
    status: BidStatusEnum;

    @ApiProperty({ type: String, enum: BidTypeEnum })
    bid_type: BidTypeEnum;

    @ApiProperty({ type: String, enum: BidModalityEnum })
    modality: BidModalityEnum;

    @ApiProperty({ type: String })
    aditional_site: string;

    @ApiProperty({ type: [AllotmentRequestDto] })
    add_allotment: AllotmentRequestDto[];

    @ApiProperty({ type: Array })
    invited_suppliers: string[];

    @ApiProperty({ type: String })
    editalFile: string;

    @ApiProperty({ type: String })
    ataFile: string;

    @ApiProperty({ type: String })
    state: string;

    @ApiProperty({ type: String })
    city: string;

    association: UserInterface;

    agreement: AgreementInterface;

    additionalDocuments:string[];

}