import { UserTypeEnum } from '../enums/user-type.enum';
import { ApiProperty } from "@nestjs/swagger";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserRolesEnum } from '../enums/user-roles.enum';

export abstract class UserRegisterRequestDto {

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    phone: string;

    @ApiProperty({ type: String, enum: UserTypeEnum })
    type: UserTypeEnum;

    @ApiProperty({ type: String })
    document: string

    @ApiProperty({ type: String })
    office: string;

    @ApiProperty({ type: String })
    association: string;

    @ApiProperty({ type: String })
    supplier?: string;

    @ApiProperty({ type: String })
    roles: UserRolesEnum;

    status: UserStatusEnum;
    
  
    
}