import { ApiProperty } from "@nestjs/swagger";

export abstract class BidAddProposalDto {

    @ApiProperty({ type: String })
    proposal_id: string;

   
    
}