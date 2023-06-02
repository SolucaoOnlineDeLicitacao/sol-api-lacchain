import { ApiProperty } from "@nestjs/swagger";

export abstract class UserUpdateProfilePictureRequestDto {

    @ApiProperty({ type: String })
    userId: string;

    @ApiProperty({ type: String })
    profilePicture: string;

}