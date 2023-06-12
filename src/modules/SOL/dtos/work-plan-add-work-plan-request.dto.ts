import { ApiProperty } from "@nestjs/swagger";

export abstract class WorkPlanWorkPlanRequestDto {
  @ApiProperty({ required: true, type: String })
  workPlanId: string;

}
