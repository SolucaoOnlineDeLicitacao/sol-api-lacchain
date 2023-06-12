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

export abstract class ProductRegisterDto {

    @ApiProperty({ type: String })
    product_name: string

    identifier?: number;

}