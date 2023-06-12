import { ApiProperty } from "@nestjs/swagger";

export abstract class UserResetPasswordConfirmationRequestDto {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: Number })
    code: number;

    @ApiProperty({ type: String })
    newPassword: string;
}