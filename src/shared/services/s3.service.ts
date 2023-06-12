import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { EnviromentVariablesEnum } from '../enums/enviroment.variables.enum';


@Injectable()
export class S3Service {

    s3: S3;

    constructor(
        private readonly configService: ConfigService,
    ) {

        this.s3 = new S3({
            region: this.configService.get(EnviromentVariablesEnum.AWS_REGION),
            accessKeyId: configService.get(EnviromentVariablesEnum.AWS_ACCESS_KEY_ID),
            secretAccessKey: configService.get(EnviromentVariablesEnum.AWS_SECRET_ACCESS_KEY),
        });
    }

    async upload(key: string, base64File: String) {
        console.log('a chave', key)

        const S3_BUCKET = await this.configService.get(EnviromentVariablesEnum.S3_BUCKET);
        console.log('bucket', S3_BUCKET)

        const pos = base64File.indexOf(';base64,');
        console.log('pos', pos)
        const type = base64File.substring(5, pos);
        var b64 = base64File.substr(pos + 8);

        const buffer = Buffer.from(b64, 'base64');

        return await this.s3
            .upload({
                Bucket: S3_BUCKET,
                Key: String(key),
                Body: buffer,
                ContentEncoding: 'base64',
                ContentType: type,
                ACL: 'public-read'
            })
            .promise();
    }

    async download(key: string) {

        const S3_BUCKET = await this.configService.get(EnviromentVariablesEnum.S3_BUCKET);

        return await this.s3
            .getObject({
                Bucket: S3_BUCKET,
                Key: String(key),
            })
            .promise();
    }
}