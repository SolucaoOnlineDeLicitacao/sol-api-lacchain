import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";

@Injectable()
export class BinanceRepository {

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
    }

    getExchangeInfo() {

        return this.httpService
            .get(`${this.configService.get(EnviromentVariablesEnum.BINANCE_API)}exchangeInfo`)
            .toPromise();
    }

    getAvgPrice(pairSymbol: string) {

        return this.httpService
            .get(`${this.configService.get(EnviromentVariablesEnum.BINANCE_API)}avgPrice?symbol=${pairSymbol}`)
            .toPromise();
    }
}