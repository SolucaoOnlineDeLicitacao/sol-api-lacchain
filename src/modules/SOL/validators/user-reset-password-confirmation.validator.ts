import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { UserResetPasswordConfirmationRequestDto } from "../dtos/user-reset-password-confirmation-request.dto";

@Injectable()
export class UserResetPasswordConfirmationValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: UserResetPasswordConfirmationRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.email, 'Email é obrigatório!');
        validator.isEmail(dto.email, 'Email inválido!');

        validator.isRequired(dto.newPassword, 'Senha é obrigatória!');
        validator.hasMinLen(dto.newPassword, 8, 'Senha deve conter no mínimo 8 caracteres!');
        validator.hasMaxLen(dto.newPassword, 20, 'Senha deve conter no máximo 20 caracteres!');

        validator.isRequired(dto.code, 'Código é obrigatório!!');
        validator.hasExactlyTheNumberOfDigits(5, dto.code, 'Código deve conter 5 números!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}