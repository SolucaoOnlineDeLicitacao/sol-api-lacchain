import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { UserUpdateRequestDto } from "../dtos/user-update-request.dto";

@Injectable()
export class UserUpdateValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: UserUpdateRequestDto): boolean {

        const validator = new ValidatorsUtil();

        this.errors = validator.errors;
        return validator.isValid();
    }
}