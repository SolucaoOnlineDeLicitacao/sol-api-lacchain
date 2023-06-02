import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { AuthenticateRequestDto } from "../dtos/authenticate-request.dto";

@Injectable()
export class AuthenticateValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: AuthenticateRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.email, 'Email é obrigatório!');
        validator.isEmail(dto.email, 'Email é inválido!');

        validator.isRequired(dto.password, 'Senha é obrigatória!');
        validator.hasMinLen(dto.password, 8, 'Senha deve ter no mínimo 8 caracteres!');
        validator.hasMaxLen(dto.password, 20, 'Senha deve ter no máximo 20 caracteres!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}