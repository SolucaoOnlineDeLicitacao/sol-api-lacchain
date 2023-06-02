import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { TfaVerifyAuthRequestDto } from "../dtos/tfa-verify-auth-request.dto";

@Injectable()
export class TfaVerifyAuthValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: TfaVerifyAuthRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.code, 'code is required!');
        validator.isSixDigitNumber(dto.code, 'code must be a number with 4 positions!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}