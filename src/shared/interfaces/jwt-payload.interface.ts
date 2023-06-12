import { UserTypeEnum } from "src/modules/SOL/enums/user-type.enum";

export interface JwtPayload {
    userId: string;
    email: string;
    type: UserTypeEnum;
    tfaRegistered: boolean;
    tfaAuthenticate: boolean;
}