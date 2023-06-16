import { ApiProperty } from "@nestjs/swagger";

export abstract class ProposalWinRequestDto {
    @ApiProperty({ type: Boolean })
    proposalWin: boolean;
}