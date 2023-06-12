/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { EnviromentVariablesEnum } from 'src/shared/enums/enviroment.variables.enum';


import { v4 as uuid } from 'uuid';


@Injectable()
export class S3Repository {

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

    async uploadBase64(key: string, base64File: string) {

        const S3_BUCKET = await this.configService.get(
            EnviromentVariablesEnum.S3_BUCKET,
        );

        // const pos = base64File.indexOf('data:application/pdf;base64,');
        // const type = base64File.substring(5, pos);
        // var b64 = base64File.substr(pos + 8);

        const b64 = base64File.replace('data:application/pdf;base64,', '');

        const buffer = Buffer.from(b64, 'base64');

        const item = await this.s3
            .upload({
                Bucket: S3_BUCKET,
                Key: String(key),
                Body: buffer,
                ContentEncoding: 'base64',
                ContentType: '.pdf',
                // ACL: 'public-read'
            })
            .promise();
        return item
    }

    // async uploadFile(bucket: string, file: Express.Multer.File) {

    //     try {
    //         const s3 = new S3();

    //         const buffer = file.buffer;

    //         const resposta = await s3.upload({
    //             Bucket: bucket,
    //             Body: buffer,
    //             Key: uuid(),
    //         }).promise();
    //         console.log('resposta dentro do S3 repo', resposta)
    //         return resposta
    //     } catch (error) {
    //         console.log('deu erro ao salvar')
    //     }
    // }


    async download(bucket: string, key: string) {


        const response = await this.s3
            .getObject({
                Bucket: bucket,
                Key: String(key),
            })
            .promise();

        const base64String = response.Body.toString('base64');

        return base64String
    }

    async delete(bucket: string, key: string) {

        await this.s3.deleteObject({
            Bucket: bucket,
            Key: key,
        });
    }
}