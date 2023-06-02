import { ZiFeeTypeEnum } from "../enums/zi-fee-type.enum";

export interface ZiFeeInterface extends Document {
    readonly name: string;
    readonly type: ZiFeeTypeEnum;
    readonly value: number;
}