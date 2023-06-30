import { EndPointsStatusEnum } from "../enums/endpoints-status.enum";
import { EndPointsTypeEnum } from "../enums/endpoints-type.enum";

export abstract class EndPointsInterface {
    endpointPath: string;
    token: string;
    frequency: string;
    lastRun?: Date;
    status: EndPointsStatusEnum;
    endpointType: EndPointsTypeEnum;
    messageError?: string;
}