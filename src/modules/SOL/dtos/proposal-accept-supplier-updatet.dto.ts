import { ApiProperty } from "@nestjs/swagger";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

export abstract class ProposalSupplierAcceptUpdateDto {

    @ApiProperty({ type: Boolean, default: false })
    supplier_accept: boolean;



}