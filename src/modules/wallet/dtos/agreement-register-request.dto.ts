import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class AgreementRegisterRequestDto {
    
    @ApiProperty({ type: String })
    register_number: string;

    @ApiProperty({ type: String })
    register_object: string;

    @ApiProperty({ type: String })
    status: string;

    @ApiProperty({ type: String })
    city: string;

    @ApiProperty({ type: String })
    value: string;

    @ApiProperty({ type: String })
    signature_date: string;

    @ApiProperty({ type: String })
    validity_date: string;

    @ApiProperty({ type: String })
    associate_name: string;

    @ApiProperty({ type: String })
    reviewer: string;

    @ApiProperty({ type: String })
    work_plan: string[];

    @ApiProperty({ type: String })
    states: string;
}