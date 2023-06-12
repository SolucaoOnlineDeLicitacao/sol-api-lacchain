import { ApiProperty } from "@nestjs/swagger";

export abstract class TfaVerifyAuthRequestDto {

    @ApiProperty({ type: Number })
    code: number;
}