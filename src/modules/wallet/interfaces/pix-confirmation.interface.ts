import { UserModel } from "../models/user.model";

export interface PixConfirmationInterface {

    readonly pixValue: string;
    readonly pixVoucher: string;
    readonly tokenValue: string;
    readonly status: string;
    readonly comment: string;
    readonly user: UserModel;
}