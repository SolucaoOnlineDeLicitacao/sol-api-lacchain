import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRolesEnum } from "../enums/user-roles.enum";

export class UserListByTypeResponseDto {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public status: UserStatusEnum,
        public type: UserTypeEnum,
        public profilePicture?: string,
        public phone?: string,
        public document?: string,
        public office?: string,
        public association?: string,
        public supplier?: string,
        public roles?: UserRolesEnum,
    ) { }
}