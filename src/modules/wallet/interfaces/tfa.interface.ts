import { UserModel } from "../models/user.model";

export interface TfaInterface {
    readonly secret: string;
    readonly url: string;
    readonly user: UserModel;
}