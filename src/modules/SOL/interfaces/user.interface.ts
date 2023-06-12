import { WalletModel } from "src/shared/models/wallet.model";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRolesEnum } from "../enums/user-roles.enum";

export interface UserInterface {

    readonly name: string;
    readonly email: string;
    // readonly pushNotificationToken: string[];
    readonly password: string;
    // readonly refreshToken: string;
    readonly phone?: string;
    readonly document?: string;
    readonly status: UserStatusEnum;
    readonly type: UserTypeEnum;
    readonly createdAt: Date;
    readonly wallet: WalletModel;
    readonly profilePicture?: string;
    readonly office?: string;
    readonly association?: string;
    readonly supplier?: string;
    readonly roles?: UserRolesEnum;

}