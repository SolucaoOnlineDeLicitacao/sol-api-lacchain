import { ApiProperty } from "@nestjs/swagger";
import { UserModel } from "../models/user.model";

export abstract class TfaDeleteRequestDto {

    @ApiProperty({ type: Number })
    code: number;

    @ApiProperty({ type: String })
    secret: string;

    @ApiProperty({ type: String })
    password: string;

    userId: string;

    user: UserModel;
}