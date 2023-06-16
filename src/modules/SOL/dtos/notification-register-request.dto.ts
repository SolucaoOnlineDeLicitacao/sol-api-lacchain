import { ApiProperty } from "@nestjs/swagger";

export abstract class NotificationRegisterDto {

    @ApiProperty({ type: String })
    title: string;


    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: String })
    from_user: string;

    @ApiProperty({ type: Boolean, default: false })
    deleted: boolean;


}