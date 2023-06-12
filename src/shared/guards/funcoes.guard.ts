/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserTypeEnum } from "src/modules/SOL/enums/user-type.enum";


@Injectable()
export class FuncoesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
     // console.log('context', context)
        const requiredFunctions = this.reflector.getAllAndOverride<UserTypeEnum[]>('type', [
            context.getHandler(),
            context.getClass(),
        ]);

    
        if (!requiredFunctions)
            return true;

        const { user } = context.switchToHttp().getRequest();``

        console.log(user, requiredFunctions[0])

        if (requiredFunctions.some(item => item === user.type)) {
          return true
        } else {
          console.log('entrie no false')
          return false
        }
        // return user.type.some(a => requiredFunctions.includes(a));
    }
}

