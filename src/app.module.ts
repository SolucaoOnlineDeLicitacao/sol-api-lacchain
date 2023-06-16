
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { configuration } from 'config/env/configuration';
import { SolModule } from './modules/SOL/sol.module';
import { SeedModule } from './modules/database_seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`
        : `${process.cwd()}/config/env/dev.env`,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    SolModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
