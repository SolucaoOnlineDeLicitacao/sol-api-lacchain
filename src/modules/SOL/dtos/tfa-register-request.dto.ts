import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class TfaRegisterRequestDto {

    @ApiProperty({ type: String })
    secret: string;

    @ApiProperty({ type: String })
    url: string;

    userId: string;

    user: UserModel;
}