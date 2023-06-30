import { UserModel } from "../models/user.model";

export abstract class ReportGeneratedRegisterRequestDto {
    situation: string;
    name: string;
    archive: string;
    generatedBy: UserModel;
}