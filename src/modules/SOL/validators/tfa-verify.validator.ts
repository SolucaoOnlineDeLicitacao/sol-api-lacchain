import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { TfaVerifyRequestDto } from "../dtos/tfa-verify-request.dto";

@Injectable()
export class TfaVerifyValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: TfaVerifyRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.secret, 'secret is required!');
        validator.isRequired(dto.code, 'code is required!');
        validator.isSixDigitNumber(dto.code, 'code must be a number with 6 positions!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}