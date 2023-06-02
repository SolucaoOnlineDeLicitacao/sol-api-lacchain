import { TokenFeeService } from './services/token-fee.service';
import { TutorialRepository } from './repositories/tutorial.repository';
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";
import { JwtStrategy } from "src/shared/strategies/jwt-strategy";
import { AuthenticationService } from "./services/authentication.service";
import { AuthenticationController } from "./controllers/authentication.controller";
import { SecurityService } from "src/shared/services/security.service";
import { WalletService } from "./services/wallet.service";
import { UserController } from "./controllers/user.controller";
import { TokenRepository } from "./repositories/token.repository";
import { TfaRepository } from "./repositories/tfa.repository";
import { TfaController } from "./controllers/tfa.controller";
import { TfaService } from "./services/tfa.service";
import { VerificationRepository } from "./repositories/verification.repository";
import { VerificationService } from "./services/verification.service";
import { EmailService } from "src/shared/services/email.service";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";
import { TokenController } from "./controllers/token.controller";
import { TokenService } from "./services/token.service";
import { BinanceRepository } from "./repositories/binance.repository";
import { HttpModule } from "@nestjs/axios";
import { AgreementController } from "./controllers/agreement.controller";
import { AgreementRepository } from "./repositories/agreement.repository";
import { AirdropService } from "./services/agreement.service";
import { GasStationService } from "src/shared/services/gas-station.service";
import { PixConfirmationRepository } from "./repositories/pix-confirmation.repository";
import { PixConfirmationController } from "./controllers/pix-confirmation.controller";
import { S3Service } from "src/shared/services/s3.service";
import { PixConfirmationService } from "./services/pix-confirmation.service";
import { GeckoRepository } from "./repositories/gecko.repository";
import { ConversionService } from "./services/conversion.service";
import { SmsRepository } from "./repositories/sms.repository";
import { PushNotificationsController } from "./controllers/push-notification.controller";
import { FirebaseService } from "./services/firebase.service";
import { RefreshTokenStrategy } from "src/shared/strategies/jwt-refresh-token-strategy";
import { TutorialController } from "./controllers/tutorial.controller";
import { TutorialService } from "./services/tutorial.service";
import { IndicateController } from "./controllers/indicate.controller";
import { IndicateService } from "./services/indicate.service";
import { IndicateRepository } from "./repositories/indicate.repository";
import { ZiFeeRepository } from './repositories/zi-fee.repository';
import { TokenFeeRepository } from './repositories/token-fee.repository';
import { AssociationController } from './controllers/association.controller';
import { AssociationService } from './services/association.service';
import { AssociationRepository } from './repositories/association.repository';
import { CostItemsController } from './controllers/cost-items.controller';
import { CostItemsService } from './services/cost-items.service';
import { CostItemsRepository } from './repositories/cost-items.repository';
import { BidController } from './controllers/bid.controller';
import { BidService } from './services/bid.service';
import { BidRepository } from './repositories/bid.repository';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { GroupRepository } from './repositories/group.repository';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        SendGridModule.forRootAsync({
            imports: [
                ConfigModule,
            ],
            useFactory: async (
                configService: ConfigService,
            ) => ({
                apiKey: configService.get(EnviromentVariablesEnum.SENDGRID_API_KEY),
            }),
            inject: [
                ConfigService,
            ]
        }),
        
        DatabaseModule,
        HttpModule,
    ],
    controllers: [
        AuthenticationController,
        BidController,
        UserController,
        TfaController,
        TokenController,
        AgreementController,
        PixConfirmationController,
        PushNotificationsController,
        TutorialController,
        IndicateController,
        AssociationController,
        CostItemsController,
        GroupController,
        ProductController,
        CategoryController,
    ],
    providers: [
        JwtStrategy,
        RefreshTokenStrategy,

        UserRepository,
        TokenRepository,
        TfaRepository,
        VerificationRepository,
        AgreementRepository,
        BinanceRepository,
        PixConfirmationRepository,
        GeckoRepository,
        TutorialRepository,
        IndicateRepository,
        SmsRepository,
        ZiFeeRepository,
        TokenFeeRepository,

        AuthenticationService,
        UserService,
        SecurityService,
        WalletService,
        TfaService,
        VerificationService,
        EmailService,
        TokenService,
        AirdropService,
        GasStationService,
        S3Service,
        PixConfirmationService,
        ConversionService,
        FirebaseService,
        TutorialService,
        IndicateService,
        TokenFeeService,
        AssociationService,
        AssociationRepository,
        CostItemsService,
        CostItemsRepository,
        
        BidService,
        BidRepository,

        GroupService,
        GroupRepository,

        ProductService,
        ProductRepository,

        CategoryService,
        CategoryRepository
        
    ],
    exports: [
        AuthenticationService,
        UserService,
        TokenService,

        UserRepository,
        ZiFeeRepository,
        TokenFeeRepository,
    ]
})
export class WalletModule { }