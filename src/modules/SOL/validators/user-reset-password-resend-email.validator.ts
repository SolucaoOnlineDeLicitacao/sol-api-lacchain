import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { UserResetPasswordResendEmailRequestDto } from "../dtos/user-reset-password-resend-email-request.dto";

@Injectable()
export class UserResetPasswordResendEmailValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: UserResetPasswordResendEmailRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.email, 'Email é obrigatório!');
        validator.isEmail(dto.email, 'Email inválido!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}