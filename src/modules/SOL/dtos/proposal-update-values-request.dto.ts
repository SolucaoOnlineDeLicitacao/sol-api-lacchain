import { ApiProperty } from "@nestjs/swagger";

export abstract class ProposalUpdateValues{
  @ApiProperty({type:Number})
  freight:number;

  @ApiProperty({type:String})
  total_value:string
}