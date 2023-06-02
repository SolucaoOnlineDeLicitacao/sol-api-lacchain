import { PixConfirmationStatus } from "./pix-confirmation-status";

export abstract class PixConfirmationUpdateRequestDto {
    status: PixConfirmationStatus;
    comment?: string;
}