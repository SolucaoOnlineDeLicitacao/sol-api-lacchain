import { UserModel } from "../models/user.model";

export interface IndicateInterface {

    readonly code: string;
    readonly transactionId: string;
    readonly user: UserModel;
}