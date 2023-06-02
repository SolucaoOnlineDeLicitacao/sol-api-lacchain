import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { LacchainController } from "./controllers/lacchain.controller";
import { lacchainService } from "./services/lacchain.service";

@Module({
    imports: [
        DatabaseModule,
        HttpModule,
    ],
    controllers: [
        LacchainController
    ],
    providers: [
        lacchainService
    ],
})
export class LacchainModule { }