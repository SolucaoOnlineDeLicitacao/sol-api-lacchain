import { ApiProperty } from "@nestjs/swagger";
import { LegalRepresentativeRegisterDto } from "src/shared/dtos/legal-representative-register.dto";
import { ItemRequestDto } from "./item-register-request.dto";

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
    add_item: ItemRequestDto;
}