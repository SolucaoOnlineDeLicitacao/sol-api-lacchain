import { ApiProperty } from "@nestjs/swagger";

export abstract class UserUpdateRequestDto {

    @ApiProperty({ type: String, required: false })
    name: string;

    
   

}