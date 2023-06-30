import { ApiProperty } from "@nestjs/swagger";

export abstract class SupplierRegisterBlockRequestDto {
    @ApiProperty({ type: String })
    blocked_reason: string;
}