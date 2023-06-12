import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnviromentVariablesEnum } from "../../../shared/enums/enviroment.variables.enum";

@Injectable()
export class SmsRepository {

    private readonly _logger = new Logger(SmsRepository.name);

    private _apiUrl: string;

    constructor(
        private readonly _configService: ConfigService,
        private readonly _httpService: HttpService,
    ) {
        this._apiUrl = this._configService.get(EnviromentVariablesEnum.SMS_API_URL);
    }

    async send(phone: string, message: string) {

        const headers = {
            headers: {
                "X-API-TOKEN": `${this._configService.get(EnviromentVariablesEnum.SMS_API_TOKEN)}`,
                "Content-Type": "application/json"
            }
        };

        const req = {
            "from": "cto",
            "to": phone.replace('+', ''),

            "contents": [
                {
                    "type": "text",
                    "text": message
                }
            ],
            "json": true
        };

        return await this._httpService.post(
            this._apiUrl,
            req,
            headers,
        ).toPromise();
    }
}