import { UserModel } from "../models/user.model";

export interface ReportGeneratedInterface {
    readonly situation: string;
    readonly name: string;
    readonly archive: string;
    readonly generatedBy: UserModel;
}