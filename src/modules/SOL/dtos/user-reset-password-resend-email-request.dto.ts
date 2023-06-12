import { ApiProperty } from "@nestjs/swagger";

export abstract class UserResetPasswordResendEmailRequestDto {

    @ApiProperty({ type: String })
    email: string;
}