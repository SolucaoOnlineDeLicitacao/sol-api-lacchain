import { ApiProperty } from "@nestjs/swagger";
import { AddressRegisterDto } from "src/shared/dtos/address-register.dto";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { AllotmentRequestDto } from "./allotment-request.dto";
import { User } from "../schemas/user.schema";
import { UserRegisterRequestDto } from "./user-register-request.dto";
import { CostItems } from "../schemas/cost-items.schema";
import { CostItemsRegisterRequestDto } from "./cost-items-register-request.dto";

export abstract class GroupCostItemRelationDto {

    @ApiProperty({ type: String })
    cost_item_id: string;

    @ApiProperty({ type: String })
    quantity: string;

    @ApiProperty({ type: String })
    estimated_cost: string;

}