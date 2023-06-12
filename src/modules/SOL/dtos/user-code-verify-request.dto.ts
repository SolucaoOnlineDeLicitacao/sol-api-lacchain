import { ApiProperty } from "@nestjs/swagger";

export abstract class UserCodeVerifyRequestDto {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: Number })
    code: number;
}