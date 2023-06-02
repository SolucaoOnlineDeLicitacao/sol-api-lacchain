import { Tutorial, TutorialSchema } from './../wallet/schemas/tutorial.schema';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";
import { PixControl, PixControlSchema } from "../asaas/schema/pix-control.schema";
import { Agreement, AgreementSchema } from "../wallet/schemas/agreement.schema";
import { Indicate, IndicateSchema } from "../wallet/schemas/indicate.schema";
import { PixConfirmation, PixConfirmationSchema } from "../wallet/schemas/pix-confirmation.schema";
import { Tfa, TfaSchema } from "../wallet/schemas/tfa-schema";
import { User, UserSchema } from "../wallet/schemas/user.schema";
import { Verification, VerificationSchema } from "../wallet/schemas/verification.schema";
import { ZiFee, ZiFeeSchema } from '../wallet/schemas/zi-fee.schema';
import { TokenFee, TokenFeeSchema } from '../wallet/schemas/token-fee.schema';
import { PurchasedCurrencyControl, PurchasedCurrencyControlSchema } from '../asaas/schema/purchased-currency-control.schema';
import { Association, AssociationSchema } from '../wallet/schemas/association.schema';
import { CostItems, CostItemsSchema } from '../wallet/schemas/cost-items.schema';
import { Bids, BidsSchema } from '../wallet/schemas/bids.schema';
import { Group, GroupSchema } from '../wallet/schemas/group.schema';
import { Products, ProductsSchema } from '../wallet/schemas/product.schema';
import { Category, CategorySchema } from '../wallet/schemas/category.schema';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [
                ConfigModule,
            ],
            useFactory: (
                configService: ConfigService,
            ) => ({
                uri: configService.get(EnviromentVariablesEnum.NOSQL_CONNECTION_STRING),
                useNewUrlParser: true,
            }),
            inject: [
                ConfigService,
            ]
        }),

        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Tfa.name, schema: TfaSchema },
            { name: Verification.name, schema: VerificationSchema },
            { name: Agreement.name, schema: AgreementSchema },
            { name: PixConfirmation.name, schema: PixConfirmationSchema },
            { name: PixControl.name, schema: PixControlSchema },
            { name: Tutorial.name, schema: TutorialSchema },
            { name: Indicate.name, schema: IndicateSchema },
            { name: ZiFee.name, schema: ZiFeeSchema },
            { name: TokenFee.name, schema: TokenFeeSchema },
            { name: PurchasedCurrencyControl.name, schema: PurchasedCurrencyControlSchema },
            { name: Association.name, schema: AssociationSchema },
            { name: CostItems.name, schema: CostItemsSchema },
            { name: Bids.name, schema: BidsSchema },
            { name: Group.name, schema: GroupSchema },
            { name: Products.name, schema: ProductsSchema },
            {name: Category.name, schema: CategorySchema}
        ]),
    ],
    exports: [
        MongooseModule,
    ]
})
export class DatabaseModule { }