import { ApiProperty } from "@nestjs/swagger";
import { UserStatusEnum } from "../enums/user-status.enum";

export class UserRegisterPasswordRequestDto {
    @ApiProperty({type: String})
    email: string;

    @ApiProperty({ type: String,  enum: Object.keys(UserStatusEnum) })
    status: UserStatusEnum;

    @ApiProperty({type: String})
    password: string;
}