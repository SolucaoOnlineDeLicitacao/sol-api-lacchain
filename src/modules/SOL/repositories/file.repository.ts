import { Injectable, Scope, StreamableFile } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from 'fs';
import { EnviromentVariablesEnum } from "../../../shared/enums/enviroment.variables.enum";

@Injectable()
export class FileRepository {

    constructor(
        private readonly _configService: ConfigService,
    ) { }

    upload(filename: string, base64: string): string {

        const bucket = this._configService.get<string>(EnviromentVariablesEnum.BUCKET);
        const path = bucket + '/' + filename;

        const base64Data = base64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

        fs.writeFileSync(path, base64Data, { encoding: 'base64' });

        return path;
    }

    async download(filename: string): Promise<Buffer> {
        const pdf = await new Promise<Buffer>((resolve, reject) => {
			fs.readFile(filename, {}, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
		return pdf;
    }
}