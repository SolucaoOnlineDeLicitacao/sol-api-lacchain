import { ApiProperty } from "@nestjs/swagger";

export abstract class NotificationTitleUpdateDto {

    @ApiProperty({ type: String })
    title: string;

    @ApiProperty({ type: String })
    description: string;


}