import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class PixConfirmationRegisterRequestDto {
    
    @ApiProperty({ type: String })
    pixValue: string;
    
    @ApiProperty({ type: String, description: 'Imagem base64' })
    pixVoucher: string;
    
    @ApiProperty({ type: String })
    tokenValue: string;
    
    status: string;

    userId: string;

    user: UserModel;
}