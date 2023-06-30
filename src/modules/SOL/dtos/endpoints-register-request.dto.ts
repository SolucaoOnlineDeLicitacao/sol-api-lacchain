import { ApiProperty } from "@nestjs/swagger";
import { EndPointsStatusEnum } from "../enums/endpoints-status.enum";
import { EndPointsTypeEnum } from "../enums/endpoints-type.enum";

export abstract class EndPointsRegisterRequestDto {
  @ApiProperty({ required: true, type: String })
  endpointPath: string;

  @ApiProperty({ required: true, type: String })
  token: string;

  @ApiProperty({ required: true, type: String })
  frequency: string;

  @ApiProperty({ required: false, type: Date, default: null })
  lastRun: Date;

  @ApiProperty({ required: true, enum: Object.keys(EndPointsStatusEnum), default: EndPointsStatusEnum.stopped })
  status: EndPointsStatusEnum;

  @ApiProperty({ required: true, enum: Object.keys(EndPointsTypeEnum) })
  endpointType: EndPointsTypeEnum;
}
