import { ApiProperty } from "@nestjs/swagger";

export abstract class UserRegisterResendEmailRequestDto {

    @ApiProperty({ type: String })
    email: string;
}