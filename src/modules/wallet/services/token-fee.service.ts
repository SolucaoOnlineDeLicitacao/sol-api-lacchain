import { Injectable } from "@nestjs/common";
import { TokenFeeInterface } from "../interfaces/token-fee.interface";
import { TokenFeeRepository } from "../repositories/token-fee.repository";
import { ConversionService } from "./conversion.service";

@Injectable()
export class TokenFeeService {

    constructor(
        private readonly _tokenFeeRepository: TokenFeeRepository,
        private readonly _conversionService: ConversionService
    ) { }

    async getTokenFee(symbol: string): Promise<TokenFeeInterface> {

        const response = await this._tokenFeeRepository.getBySymbol(symbol);

        return response;
    }


}