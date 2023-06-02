import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class AirdropUpdateRequestDto {
    
    @ApiProperty({ type: String })
    linkedln: string;

    @ApiProperty({ type: String })
    instagram: string;

    @ApiProperty({ type: String })
    twitter: string;

    @ApiProperty({ type: String })
    facebook: string;
}