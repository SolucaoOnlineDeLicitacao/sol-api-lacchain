import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class IndicateRegisterRequestDto {
    
    @ApiProperty({ type: String })
    code: string;

    @ApiProperty({ type: String })
    transactionId: string;
    
    userId: string;

    user: UserModel;
}