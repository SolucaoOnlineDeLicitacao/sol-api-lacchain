import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { TokenConversionRequestDto } from "../dtos/token-conversion-request.dto";
import { TokenSwapRequestDto } from "../dtos/token-swap-request.dto";
import { TokenSwapSymbolEnum } from "../dtos/token-swap-symbol.enum";
import { TokenTransferRequestDto } from "../dtos/token-transfer-request.dto";

@Injectable()
export class TokenSwapValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: TokenSwapRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.to, 'to is required!');
        validator.isRequired(dto.from, 'from is required!');
        validator.isRequired(dto.value, 'value is required!');

        if (dto.to === dto.from)
            validator.addError('to must be different from from');

        this.errors = validator.errors;
        return validator.isValid();
    }
}