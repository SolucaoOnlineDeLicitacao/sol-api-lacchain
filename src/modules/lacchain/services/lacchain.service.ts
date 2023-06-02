import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { EnviromentVariablesEnum } from 'src/shared/enums/enviroment.variables.enum';
import { ConfigService } from "@nestjs/config";


@Injectable()
export class lacchainService {
  private baseUrlTerminal = this._configService.get<string>(EnviromentVariablesEnum.COIN_GECKO_URL);

  constructor(
        private readonly _configService: ConfigService,
        private readonly httpService: HttpService,
  ) { }

  async getZicoinMarketData( from: number, to: number ): Promise<AxiosResponse<any>> {
    let response;
    await this.httpService.axiosRef.get(
        `${this.baseUrlTerminal}contracts/1/candlesticks.json?token_id=13870076&pool_id=154024627&resolution=1D&from=${from}&to=${to}&for_update=false&count_back=30&currency=usd`
      ).then(data => {
          response = data.data;
      });
    return response;
  }
}