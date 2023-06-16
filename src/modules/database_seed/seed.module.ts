import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { DatabaseSeedCommand } from './command/database-seed.command';
import { SolModule } from '../SOL/sol.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, SolModule, CommandModule],
  providers: [DatabaseSeedCommand],
  exports: [DatabaseSeedCommand],
})
export class SeedModule {}