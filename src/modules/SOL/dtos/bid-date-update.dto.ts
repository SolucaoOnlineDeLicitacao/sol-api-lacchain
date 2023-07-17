import { ApiProperty } from "@nestjs/swagger";

export abstract class BidDateUpdateDto {


    @ApiProperty({ type: String })
    start_at: string;

    @ApiProperty({ type: String })
    end_at: string;


    
}