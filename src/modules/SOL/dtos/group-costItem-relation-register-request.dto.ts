import { ApiProperty } from "@nestjs/swagger";

export abstract class GroupCostItemRelationDto {

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    cost_item_id: string;

    @ApiProperty({ type: String })
    quantity: string;

    @ApiProperty({ type: String })
    estimated_cost: string;

}