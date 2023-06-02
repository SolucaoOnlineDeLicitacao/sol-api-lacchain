import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterConfirmationCodeRequestDto {
    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: Number })
    code: number;
}