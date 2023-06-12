import { SetMetadata } from "@nestjs/common";
import { UserTypeEnum } from "src/modules/SOL/enums/user-type.enum";



export const Funcoes = (...functions: UserTypeEnum[]) => SetMetadata('type', functions);