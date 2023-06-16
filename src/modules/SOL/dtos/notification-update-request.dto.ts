import { ApiProperty } from "@nestjs/swagger";

export abstract class NotificationUpdateDto {

  

    @ApiProperty({ type: String })
    to_user: string;

}