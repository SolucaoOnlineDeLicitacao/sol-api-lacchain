import { ApiProperty } from "@nestjs/swagger";
import { AllotmentStatusEnum } from "../enums/allotment-status.enum";

export abstract class AllotUpdateStatusRequestDto {

    @ApiProperty({ enum: AllotmentStatusEnum, type: String })
    status:AllotmentStatusEnum;
    

}
