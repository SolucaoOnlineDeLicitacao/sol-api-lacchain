import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';
import { EnviromentVariablesEnum } from './shared/enums/enviroment.variables.enum';
import BooleanUtil from './shared/utils/boolean.util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {

  const enviroment = process.env.NODE_ENV.toUpperCase();

  const keyFileExists = fs.existsSync('./../secrets/sol-app.api.key.pem');
  const certFileExists = fs.existsSync('./../secrets/sol-app.api.crt.pem');
  const httpsOptions = keyFileExists && certFileExists
    ? {
      key: fs.readFileSync('./../secrets/sol-app.api.key.pem'),
      cert: fs.readFileSync('./../secrets/sol-app.api.crt.pem'),
    }
    : null;

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const configService = app.get(ConfigService);
  const logger = new Logger('main');

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  if (BooleanUtil.getBoolean(configService.get(EnviromentVariablesEnum.ENABLE_CORS))) {
    const corsOptions = {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization, ResponseType'
    };
    app.enableCors(corsOptions);

    logger.debug('* CORS ENABLED');
  }

  if (configService.get<boolean>(EnviromentVariablesEnum.ENABLE_DOCS)) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(`SOL Sistema Online de Licitação - API | ${enviroment}`)
      .setVersion('0.0.1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('docs', app, document);

    logger.debug('* DOCS ENABLED');
  }

  const port = configService.get(EnviromentVariablesEnum.PORT) || 3000;
  await app.listen(port);
  logger.log(`${enviroment} | Sol API started at port ${port}`);
}
bootstrap();
