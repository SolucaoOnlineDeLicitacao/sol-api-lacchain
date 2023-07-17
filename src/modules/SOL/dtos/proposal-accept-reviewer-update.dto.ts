import { ApiProperty } from "@nestjs/swagger";
import { boolean } from "yargs";

export abstract class ProposalReviewerAcceptUpdateDto {

    @ApiProperty({ type: String, default: new Date })
    acceptedRevisorAt:  string;

    @ApiProperty({ type: Boolean, default: false })
    reviewer_accept:  boolean;
}