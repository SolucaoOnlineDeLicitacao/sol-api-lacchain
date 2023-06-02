import { TokenFeeRepository } from './../repositories/token-fee.repository';
import { BinanceRepository } from './../repositories/binance.repository';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ValidatorInterceptor } from "src/shared/interceptors/validator.interceptor";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { TokenConversionRequestDto } from "../dtos/token-conversion-request.dto";
import { TokenTransferRequestDto } from "../dtos/token-transfer-request.dto";
import { TokenTransferToRequestDto } from "../dtos/token-transfer-to-request.dto";
import { TokenService } from "../services/token.service";
import { TokenConversionValidator } from "../validators/token-conversion.validator";
import { TokenTransferValidator } from "../validators/token-transfer.validator";
import { ConversionService } from "../services/conversion.service";
import { GeckoRepository } from '../repositories/gecko.repository';
import { TokenFeeService } from '../services/token-fee.service';

@ApiTags('licitacao')
@Controller('licitacao')
export class TokenController {

    private readonly logger = new Logger(TokenController.name);

    constructor(
        private readonly _tokenService: TokenService,
        private readonly _conversionService: ConversionService,
        private readonly _binanceRepository: BinanceRepository,
        private readonly _tokenFeeRepository: TokenFeeRepository,
        private readonly _geckoRepository: GeckoRepository,
        private readonly _tokenFeeService: TokenFeeService
    ) { }

    @Post('register-licitacao')
    @HttpCode(200)
    @UseInterceptors(new ValidatorInterceptor(new TokenConversionValidator()))
    async buyingConversion(
        @Body() dto: TokenConversionRequestDto,
    ) {

        try {

            const response = await this._tokenService.conversionBuy(dto);

            return new ResponseDto(
                true,
                response,
                null,
            );


        } catch (error) {
            this.logger.error(error.message);

            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Post('register-data')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(new ValidatorInterceptor(new TokenTransferValidator()))
    async transfer(
        @Req() request,
        @Body() dto: TokenTransferRequestDto
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this._tokenService.transferToHotWallet(payload.userId, dto);

            return new ResponseDto(
                true,
                response,
                null
            );
        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('register-app')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(new ValidatorInterceptor(new TokenTransferValidator()))
    async transferTo(
        @Req() request,
        @Body() dto: TokenTransferToRequestDto
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this._tokenService.transferTo(payload.userId, dto);

            return new ResponseDto(
                true,
                response,
                null
            );
        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('tag-lacchain')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(new ValidatorInterceptor(new TokenTransferValidator()))
    async withdraw(
        @Req() request,
    ) {

        try {

            const payload: JwtPayload = request.user;


            return new ResponseDto(
                true,
                {},
                null
            );
        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }

    @Get('transaction')
    @HttpCode(200)
    async getZiPrice(
    ) {

        try {

            const response = await this._conversionService.getZiPrice();

            return new ResponseDto(
                true,
                response,
                null,
            );


        } catch (error) {
            this.logger.error(error.message);

            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // @Get('swap/pair/:to/:from/value/:value')
    // @HttpCode(200)
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // async getSwap(
    //     @Param('from') from: string,
    //     @Param('to') to: string,
    //     @Param('value') value: string,
    // ) {

    //     try {

    //         const response = await this._tokenService.conversionSwap(
    //             from,
    //             to,
    //             value
    //         );

    //         return new ResponseDto(true, response, null);

    //     } catch (error) {
    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }

    @Get('symbol/:symbol')
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getTokenfeeBuy(
        @Param('symbol') symbol: string,
    ) {

        try {

            let valueSymbol;

            if (symbol == 'ZI') {
                const response = await this._geckoRepository.getPrice();
                valueSymbol = Number(response.data.data.attributes.price_in_usd);
            } else if (symbol == 'USDT') {
                valueSymbol = 1;
            } else {
                const avgPriceTo = await this._binanceRepository.getAvgPrice(`${symbol}USDT`);
                valueSymbol = avgPriceTo.data.price;
            }

            const tokenFee = await this._tokenFeeRepository.getBySymbol(symbol);
            const result = valueSymbol + (valueSymbol * tokenFee.buy);

            return new ResponseDto(true, result, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('data/symbol/:symbol')
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getTokenfeeSell(
        @Param('symbol') symbol: string,
    ) {

        try {

            let valueSymbol;

            if (symbol == 'ZI') {
                const response = await this._geckoRepository.getPrice();
                valueSymbol = Number(response.data.data.attributes.price_in_usd);
            } else if (symbol == 'USDT') {
                valueSymbol = 1;
            } else {
                const avgPriceTo = await this._binanceRepository.getAvgPrice(`${symbol}USDT`);
                valueSymbol = avgPriceTo.data.price;
            }

            const tokenFee = await this._tokenFeeRepository.getBySymbol(symbol);

            const result = valueSymbol - (valueSymbol * tokenFee.sell);

            return new ResponseDto(true, result, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // @Post('swap')
    // @HttpCode(200)
    // @ApiBearerAuth()
    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(new ValidatorInterceptor(new TokenSwapValidator()))
    // async swap(
    //     @Req() request,
    //     @Body() dto: TokenSwapRequestDto,
    // ) {

    //     try {

    //         const payload: JwtPayload = request.user;

    //         await this._swapProducer.swapRequest(payload, dto);

    //         return new ResponseDto(true, {}, null);

    //     } catch (error) {
    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }

    @Get('nonce')
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getFee(
    ) {

        try {

            const response = await this._tokenService.getTokenFee();

            return new ResponseDto(true, response, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get('nodeprivate/:symbol')
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getTokenFee(
        @Param('symbol') symbol: string,
    ) {

        try {

            const response = await this._tokenFeeService.getTokenFee(symbol);

            return new ResponseDto(true, response, null);

        } catch (error) {
            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}