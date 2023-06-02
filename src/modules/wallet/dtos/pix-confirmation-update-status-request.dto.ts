import { ApiProperty } from "@nestjs/swagger";
import { PixConfirmationStatus } from "./pix-confirmation-status";

export abstract class PixConfirmationUpdateStatusRequestDto {

    @ApiProperty({ type: String, enum: Object.keys(PixConfirmationStatus) })
    status: PixConfirmationStatus;

    @ApiProperty({ type: String })
    comment?: string;
}