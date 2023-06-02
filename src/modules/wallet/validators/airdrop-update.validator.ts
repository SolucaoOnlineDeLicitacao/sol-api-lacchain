import { Injectable } from "@nestjs/common";
import { ValidatorContractInterface } from "src/shared/interfaces/validator-contract.interface";
import { ValidatorsUtil } from "src/shared/utils/validators.util";
import { AirdropUpdateRequestDto } from "../dtos/airdrop-update-request.dto";

@Injectable()
export class AirdropUpdateValidator implements ValidatorContractInterface {

    errors: any[];

    validate(dto: AirdropUpdateRequestDto): boolean {

        const validator = new ValidatorsUtil();

        validator.isRequired(dto.facebook, 'facebook is required!');
        validator.isRequired(dto.instagram, 'instagram is required!');
        validator.isRequired(dto.linkedln, 'linkedln is required!');
        validator.isRequired(dto.twitter, 'twitter is required!');

        this.errors = validator.errors;
        return validator.isValid();
    }
}