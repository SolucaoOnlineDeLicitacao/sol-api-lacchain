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
import { GroupCostItemRealation } from "../schemas/group-costItem-relation.schema";
import { GroupCostItemRelationDto } from "./group-costItem-relation-register-request.dto";

export abstract class GroupRegisterDto {

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    idAgreements: string;

    @ApiProperty({ type: GroupCostItemRelationDto })
    items: GroupCostItemRelationDto[];

}