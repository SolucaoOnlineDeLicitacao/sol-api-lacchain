import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { TfaRegisterRequestDto } from "../dtos/tfa-register-request.dto";

@Injectable()
export class TfaRegisterValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: TfaRegisterRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.secret, 'secret is required!');
        validator.isRequired(dto.url, 'url is required!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}