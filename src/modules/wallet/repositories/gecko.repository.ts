import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";

@Injectable()
export class GeckoRepository {

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
    }

    getPrice() {

        return this.httpService
            .get(`${this.configService.get(EnviromentVariablesEnum.GECKO_API)}`)
            .toPromise();
    }
}