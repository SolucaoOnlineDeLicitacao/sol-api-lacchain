import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRolesEnum } from "../enums/user-roles.enum";
import { NotificationInterface } from "./notification.interface";

export interface UserInterface {

    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly phone?: string;
    readonly document?: string;
    readonly status: UserStatusEnum;
    readonly type: UserTypeEnum;
    readonly createdAt: Date;
    readonly profilePicture?: string;
    readonly office?: string;
    readonly association?: string;
    readonly supplier?: string;
    readonly roles?: UserRolesEnum;
    readonly notification_list?: NotificationInterface[]

}