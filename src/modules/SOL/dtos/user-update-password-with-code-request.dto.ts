import { ApiProperty } from "@nestjs/swagger";

export abstract class UserUpdatePasswordWithCodeRequestDto {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: Number })
    code: number;

    @ApiProperty({ type: Number })
    newPassword: string;
}