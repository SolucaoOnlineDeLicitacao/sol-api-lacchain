import { Tutorial, TutorialSchema } from "../SOL/schemas/tutorial.schema";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";

import { Agreement, AgreementSchema } from "../SOL/schemas/agreement.schema";

import { Tfa, TfaSchema } from "../SOL/schemas/tfa-schema";
import { User, UserSchema } from "../SOL/schemas/user.schema";
import { Verification, VerificationSchema } from "../SOL/schemas/verification.schema";
import { Association, AssociationSchema } from '../SOL/schemas/association.schema';
import { CostItems, CostItemsSchema } from '../SOL/schemas/cost-items.schema';
import { Bids, BidsSchema } from '../SOL/schemas/bids.schema';
import { Group, GroupSchema } from '../SOL/schemas/group.schema';
import { Products, ProductsSchema } from '../SOL/schemas/product.schema';
import { Category, CategorySchema } from '../SOL/schemas/category.schema';
import { Supplier, SupplierSchema } from '../SOL/schemas/supplier.schema';
import { Contract } from 'ethers';
import { ContractSchema } from '../SOL/schemas/Contract.schema';
import { Proposal, ProposaltSchema } from '../SOL/schemas/proposal.schema';
import { WorkPlan, WorkPlanSchema } from "../SOL/schemas/work-plan.schema";


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(EnviromentVariablesEnum.NOSQL_CONNECTION_STRING),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tfa.name, schema: TfaSchema },
      { name: Verification.name, schema: VerificationSchema },
      { name: Agreement.name, schema: AgreementSchema },
      { name: Tutorial.name, schema: TutorialSchema },
      { name: Association.name, schema: AssociationSchema },
      { name: CostItems.name, schema: CostItemsSchema },
      { name: Bids.name, schema: BidsSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Products.name, schema: ProductsSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Proposal.name, schema: ProposaltSchema },
      { name: WorkPlan.name, schema: WorkPlanSchema },

    ]),
  ],
  exports: [
    MongooseModule,
  ]
})
export class DatabaseModule { }
