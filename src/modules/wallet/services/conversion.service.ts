import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ethers } from "ethers";
import { TokenSwapInfoResponseDto } from "../dtos/token-swap-info-response.dto";
import { TokenZiPriceToResponseDto } from "../dtos/token-zi-price-response.dto";
import { ZiPriceResposne } from "../dtos/zi-price-response.dto";
import { BinanceRepository } from "../repositories/binance.repository";
import { GeckoRepository } from "../repositories/gecko.repository";
import { TokenFeeRepository } from "../repositories/token-fee.repository";
import { ZiFeeRepository } from "../repositories/zi-fee.repository";

@Injectable()
export class ConversionService {

    private readonly _logger = new Logger(ConversionService.name);

    constructor(
        private readonly _binanceRepository: BinanceRepository,
        private readonly _geckoRepository: GeckoRepository,
        private readonly _ziFeeRepository: ZiFeeRepository,
        private readonly _tokenFeeRepository: TokenFeeRepository,
    ) { }

    async convertBRLToZiWithSpread(value: string): Promise<string> {

        const usdBrl = await this._binanceRepository.getAvgPrice('USDTBRL');

        let valueNumber = Number(value) / usdBrl.data.price;
        const ziPrice = await this.getZiPrice();

        const divFactorToken = ziPrice.valuePlusSpread;

        const result = valueNumber / divFactorToken;
        const tokenValue = result.toFixed(18);
        return tokenValue;
    }

    async convertZiWithSwapFee(symbol: string, value: string): Promise<TokenSwapInfoResponseDto> {

        const valueBn = ethers.utils.parseUnits(value, 18);

        let avgPriceValue = 1;

        if (symbol !== 'USDT') {
            const avgPrice = await this._binanceRepository.getAvgPrice(`${symbol}USDT`);
            avgPriceValue = Number(avgPrice.data.price);
        }

        //desagio
        const tokenFee = await this._tokenFeeRepository.getBySymbol(symbol);
        if (tokenFee)
            avgPriceValue = (avgPriceValue - (avgPriceValue * tokenFee.sell));

        const ziPrice = await this.getZiPrice();
        let divFactorToken = ziPrice.value;

        //agio
        const ziFee = await this._tokenFeeRepository.getBySymbol('ZI');
        if (ziFee)
            divFactorToken = (divFactorToken + (divFactorToken * ziFee.buy))

        const tokenPrice = (avgPriceValue / divFactorToken).toFixed(0);
        const tokenValueBn = valueBn.mul(tokenPrice);
        const tokenValue = ethers.utils.formatEther(tokenValueBn);

        return new TokenSwapInfoResponseDto(
            tokenValue,
        );
    }

    async convertTokenWithSwapFee(symbol: string, value: string): Promise<TokenSwapInfoResponseDto> {

        const valueBn = ethers.utils.parseUnits(value, 18);

        let avgPriceValue = 1;

        if (symbol !== 'USDT') {
            const avgPrice = await this._binanceRepository.getAvgPrice(`${symbol}USDT`);
            avgPriceValue = Number(avgPrice.data.price);
        }

        //agio
        const tokenFee = await this._tokenFeeRepository.getBySymbol(symbol);
        if (tokenFee)
            avgPriceValue = (avgPriceValue + (avgPriceValue * tokenFee.buy));

        const ziPrice = await this.getZiPrice();
        let divFactorToken = ziPrice.value;

        //desagio
        const ziFee = await this._tokenFeeRepository.getBySymbol('ZI');
        if (ziFee)
            divFactorToken = (divFactorToken - (divFactorToken * ziFee.sell))

        const tokenPrice = (avgPriceValue / divFactorToken).toFixed(0);
        const tokenPriceBn = ethers.utils.parseUnits(tokenPrice, 18);
        const tokenValueNumber = Number(valueBn) / Number(tokenPriceBn);
        const tokenValue = tokenValueNumber.toString();

        return new TokenSwapInfoResponseDto(
            tokenValue,
        );
    }

    async convertTokenWithPair(to: string, from: string, value: string): Promise<TokenSwapInfoResponseDto> {

        const valueBn = ethers.utils.parseUnits(value, 18);

        let avgPriceValueTo = 1;

        if (to !== 'USDT') {
            const avgPriceTo = await this._binanceRepository.getAvgPrice(`${to}USDT`);
            avgPriceValueTo = Number(avgPriceTo.data.price);
        }

        //agio
        const tokenFeeTo = await this._tokenFeeRepository.getBySymbol(from);
        if (tokenFeeTo)
            avgPriceValueTo = (avgPriceValueTo - (avgPriceValueTo * tokenFeeTo.sell));

        let avgPriceValueFrom = 1;

        if (from !== 'USDT') {
            const avgPriceFrom = await this._binanceRepository.getAvgPrice(`${from}USDT`);
            avgPriceValueFrom = Number(avgPriceFrom.data.price);
        }

        //agio
        const tokenFeeFrom = await this._tokenFeeRepository.getBySymbol(from);
        if (tokenFeeFrom)
            avgPriceValueFrom = (avgPriceValueFrom + (avgPriceValueFrom * tokenFeeFrom.buy));

        const tokenPrice = avgPriceValueTo / avgPriceValueFrom;
        const tokenPriceBn = ethers.utils.parseUnits(tokenPrice.toString(), 18);
        const tokenValueNumber = Number(valueBn) / Number(tokenPriceBn);
        const tokenValue = tokenValueNumber.toString();

        return new TokenSwapInfoResponseDto(
            tokenValue,
        );
    }

    async getZiPrice(): Promise<TokenZiPriceToResponseDto> {

        const response = await this._geckoRepository.getPrice();
        
        const ziPriceResponse:ZiPriceResposne = response.data.data.attributes;

        const value = Number(ziPriceResponse.token_prices_by_token_id[13870076].price_in_usd);

        const spreadResponse = await this._ziFeeRepository.getByName('SPREAD');
        const swappFeeResponse = await this._ziFeeRepository.getByName('SWAP');

        if (!spreadResponse)
            throw new BadRequestException(`SPREAD fee not registered`);

        if (!swappFeeResponse)
            throw new BadRequestException(`SWAP fee not registered`);

        return new TokenZiPriceToResponseDto(
            value,
            spreadResponse.value,
            swappFeeResponse.value,
            value + (value * spreadResponse.value),
        );
    }
}