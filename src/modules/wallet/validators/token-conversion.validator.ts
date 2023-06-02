import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { TokenConversionRequestDto } from "../dtos/token-conversion-request.dto";

@Injectable()
export class TokenConversionValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: TokenConversionRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.symbol, 'symbol is required!');
        validator.isRequired(dto.value, 'value is required!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}