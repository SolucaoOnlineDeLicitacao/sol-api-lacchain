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
import { UserController } from "./controllers/user.controller";
import { TfaRepository } from "./repositories/tfa.repository";
import { TfaController } from "./controllers/tfa.controller";
import { TfaService } from "./services/tfa.service";
import { VerificationRepository } from "./repositories/verification.repository";
import { VerificationService } from "./services/verification.service";
import { EmailService } from "src/shared/services/email.service";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";
import { HttpModule } from "@nestjs/axios";
import { AgreementController } from "./controllers/agreement.controller";
import { AgreementRepository } from "./repositories/agreement.repository";
import { RefreshTokenStrategy } from "src/shared/strategies/jwt-refresh-token-strategy";
import { TutorialController } from "./controllers/tutorial.controller";
import { TutorialService } from "./services/tutorial.service";
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
import { SupplierService } from './services/supplier.service';
import { SupplierRepository } from './repositories/supplier.repository';
import { SupplierController } from './controllers/supplier.controller';
import { ContractController } from './controllers/contract.controller';
import { ContractService } from './services/contract.service';
import { ContractRepository } from './repositories/contract.repository';
import { ProposalService } from './services/proposal.service';
import { ProposalRepository } from './repositories/proposal.repository';
import { ProposalController } from './controllers/proposal.controller';
import { WorkPlanRepository } from './repositories/work-plan.repository';
import { WorkPlanService } from './services/work-plan.service';
import { AgreementService } from './services/agreement.service';
import { WorkPlanController } from './controllers/work-plan.controle';
import { AllotmentRepository } from './repositories/allotment.repository';
import { AllotmentService } from './services/allotment.service';
import { AllotmentController } from './controllers/allotment.controller';
import { ModelContractRepository } from './repositories/model-contract.repository';
import { ModelContractController } from './controllers/model-contract.controller';
import { ModelContractService } from './services/model-contract.service';
import { NotificationtController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationRepository } from './repositories/notification.repository';
import { FileRepository } from './repositories/file.repository';
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
        AgreementController,
        TutorialController,
        AssociationController,
        CostItemsController,
        GroupController,
        ProductController,
        CategoryController,
        SupplierController,
        ContractController,
        ModelContractController,
        ProposalController,
        AgreementController,
        WorkPlanController,
        AllotmentController,
        NotificationtController
    ],
    providers: [
        JwtStrategy,
        RefreshTokenStrategy,
        UserRepository,
        TfaRepository,
        VerificationRepository,
        TutorialRepository,
        AuthenticationService,
        UserService,
        SecurityService,
        TfaService,
        VerificationService,
        EmailService,
        TutorialService,
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
        CategoryRepository,
        SupplierService,
        SupplierRepository,
        ContractService,
        ModelContractService,
        ContractRepository,
        ProposalService,
        ProposalRepository,
        WorkPlanRepository,
        WorkPlanService,
        ContractRepository,
        ModelContractRepository,
        AgreementService,
        AgreementRepository,

        AllotmentService,
        AllotmentRepository,

        NotificationService,
        NotificationRepository,
        FileRepository,
    ],
    exports: [
        AuthenticationService,
        UserService,
        UserRepository,
        AssociationService,
    ]
})
export class SolModule { }
