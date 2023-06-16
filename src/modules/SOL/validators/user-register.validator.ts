import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { UserRegisterRequestDto } from "../dtos/user-register-request.dto";
import { UserTypeEnum } from "../enums/user-type.enum";

@Injectable()
export class UserRegisterValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: UserRegisterRequestDto): boolean {

        const validator = new ValidatorsUtil();
        
        validator.isRequired(dto.email, 'Email é obrigatório!');
        validator.isEmail(dto.email, 'Email inválido!');
        validator.isRequired(dto.name, 'Nome é obrigatório!');
        validator.isRequired(dto.type, 'Tipo é obrigatório!');

        if(dto.type == UserTypeEnum.administrador) {
            validator.isRequired(dto.roles, 'Função é obrigatória!');
        }

        if(dto.type == UserTypeEnum.associacao) {
            validator.isRequired(dto.phone, 'Telefone é obrigatório!');
            validator.isRequired(dto.document, 'CPF/CNPJ é obrigatório!');
            validator.isRequired(dto.association, 'Associação é obrigatório!');
        }

        if(dto.type == UserTypeEnum.fornecedor) {
            validator.isRequired(dto.type, 'Telefone é obrigatório!');
            validator.isRequired(dto.document, 'CPF é obrigatório!');
            validator.isRequired(dto.supplier, 'Fornecedor é obrigatório!');
        }


        this.errors = validator.errors;
        return validator.isValid();
    }
}