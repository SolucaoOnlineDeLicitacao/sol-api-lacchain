import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ethers } from "ethers";
import { authenticator } from "otplib";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";
import { TokenConversionRequestDto } from "../dtos/token-conversion-request.dto";
import { TokenConversionResponseDto } from "../dtos/token-conversion-response.dto";
import { TokenFeeResponseDto } from "../dtos/token-fee-response.dto";
import { TokenTransferRequestDto } from "../dtos/token-transfer-request.dto";
import { TokenTransferResponseDto } from "../dtos/token-transfer-response.dto";
import { TokenTransferToRequestDto } from "../dtos/token-transfer-to-request.dto";
import { TokenTransferToResponseDto } from "../dtos/token-transfer-to-response.dto";
import { BinanceRepository } from "../repositories/binance.repository";
import { TfaRepository } from "../repositories/tfa.repository";
import { TokenRepository } from "../repositories/token.repository";
import { ZiFeeRepository } from "../repositories/zi-fee.repository";
import { ConversionService } from "./conversion.service";

@Injectable()
export class TokenService {

    private readonly _logger = new Logger(TokenService.name);

    constructor(
        private readonly _binanceRepository: BinanceRepository,
        private readonly _configService: ConfigService,
        private readonly _tokenRepository: TokenRepository,
        private readonly _tfaRepository: TfaRepository,
        private readonly _conversionService: ConversionService,
        private readonly _ziFeeRepository: ZiFeeRepository,
    ) { }

    async conversionBuy(dto: TokenConversionRequestDto): Promise<TokenConversionResponseDto> {

        const result = await this._conversionService.convertBRLToZiWithSpread(
            dto.value
        );

        const response = new TokenConversionResponseDto(result);

        return response;
    }

    async getTokenPairPrice(coinPair: string) {
        const avgPrice = await this._binanceRepository.getAvgPrice(coinPair);
        return avgPrice.data.price;
    }

    async transferToHotWallet(userId: string, dto: TokenTransferRequestDto): Promise<TokenTransferResponseDto> {

        const hotWallet = this._configService.get(EnviromentVariablesEnum.HOT_WALLET);
        const valueBigNumber = ethers.utils.parseUnits(dto.value, 18);
        const tx = await this._tokenRepository.transferFromCLient(userId, hotWallet, dto.symbol, valueBigNumber);

        return new TokenTransferResponseDto(tx.hash);
    }

    async transferTo(userId: string, dto: TokenTransferToRequestDto): Promise<TokenTransferToResponseDto> {

        const tfa = await this._tfaRepository.getByUserId(userId);

        if (!tfa)
            throw new BadRequestException('2fa is required!');

        const verifyTfa = authenticator.verify({ token: dto.code.toString(), secret: tfa.secret });

        if (!verifyTfa)
            throw new BadRequestException('invalid 2fa!');

        const valueBigNumber = ethers.utils.parseUnits(dto.value, 18);
        const tx = await this._tokenRepository.transferFromCLient(userId, dto.to, dto.symbol, valueBigNumber);

        return new TokenTransferResponseDto(tx.hash);
    }

    getNetworkScanLink(symbol: string): string {
        if (symbol === 'ETH' || symbol === 'USDT')
            return this._configService.get<string>(EnviromentVariablesEnum.ETHEREUM_SCAN);
        else if (symbol === `BNB` || symbol === `BUSD`)
            return this._configService.get<string>(EnviromentVariablesEnum.BSC_SCAN);
        else if (symbol === `MATIC` || symbol === `ZI`)
            return this._configService.get<string>(EnviromentVariablesEnum.POLYGON_SCAN);
        else '';
    }

    async getTokenFee(): Promise<TokenFeeResponseDto> {

        const ziFee = await this._ziFeeRepository.getByName('SWAP');

        return new TokenFeeResponseDto(
            ziFee.value.toFixed(18),
        );
    }
}