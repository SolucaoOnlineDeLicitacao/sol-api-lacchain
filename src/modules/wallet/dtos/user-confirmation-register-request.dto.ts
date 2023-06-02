import { ApiProperty } from "@nestjs/swagger";
import { UserConfirmationRegisterTypeEnum } from "../enums/user-confirmation-register-type-send.enum";

export class UserConfirmationRegisterSendRequestDto {

    @ApiProperty({ type: String,  enum: Object.keys(UserConfirmationRegisterTypeEnum) })
    type: UserConfirmationRegisterTypeEnum;

    @ApiProperty({ type: String })
    value: string;
}