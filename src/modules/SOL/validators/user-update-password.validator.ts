import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { UserUpdatePasswordRequestDto } from "../dtos/user-update-password-request.dto";

@Injectable()
export class UserUpdatePasswordValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: UserUpdatePasswordRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.password, 'Senha é obrigatória!');
        validator.hasMinLen(dto.password, 8, 'Senha deve ter no mínimo 8 caracteres!');
        validator.hasMaxLen(dto.password, 20, 'Senha deve ter no máximo 20 caracteres!');

        validator.isRequired(dto.newPassword, 'Nova senha é obrigatória!');
        validator.hasMinLen(dto.newPassword, 8, 'Nova senha deve ter no mínimo 8 caracteres!');
        validator.hasMaxLen(dto.newPassword, 20, 'Nova senha deve ter no máximo 20 caracteres!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}