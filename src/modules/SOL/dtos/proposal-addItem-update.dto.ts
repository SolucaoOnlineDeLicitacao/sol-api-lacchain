import { ApiProperty } from "@nestjs/swagger";


export abstract class ProposalAddItemUpdateDto {

    @ApiProperty({ type: String, })
    item_list: string;



}