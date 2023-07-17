import { Tutorial, TutorialSchema } from "../SOL/schemas/tutorial.schema";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EnviromentVariablesEnum } from "src/shared/enums/enviroment.variables.enum";

import { Agreement, AgreementSchema } from "../SOL/schemas/agreement.schema";

import { Tfa, TfaSchema } from "../SOL/schemas/tfa-schema";
import { User, UserSchema } from "../SOL/schemas/user.schema";
import { Verification, VerificationSchema } from "../SOL/schemas/verification.schema";
import { Association, AssociationSchema } from "../SOL/schemas/association.schema";
import { CostItems, CostItemsSchema } from "../SOL/schemas/cost-items.schema";
import { Bids, BidsSchema } from "../SOL/schemas/bids.schema";
import { Group, GroupSchema } from "../SOL/schemas/group.schema";
import { Products, ProductsSchema } from "../SOL/schemas/product.schema";
import { Category, CategorySchema } from "../SOL/schemas/category.schema";
import { Supplier, SupplierSchema } from "../SOL/schemas/supplier.schema";
import { Contract } from "ethers";
import { ContractSchema } from "../SOL/schemas/contract.schema";
import { Proposal, ProposaltSchema } from "../SOL/schemas/proposal.schema";
import { WorkPlan, WorkPlanSchema } from "../SOL/schemas/work-plan.schema";
import { Allotment, AllotmentSchema } from "../SOL/schemas/allotment.schema";
import { ModelContract, ModelContractSchema } from "../SOL/schemas/model-contract.schemay";
import { Notification, NotificationSchema } from "../SOL/schemas/notification.schema";
import { ReportGenerated, ReportGeneratedSchema } from "../SOL/schemas/report-generated.schema";
import { EndPoints, EndPointsSchema } from "../SOL/schemas/endpoints.schema";
import { Plataform, PlataformSchema } from "../SOL/schemas/plataform.schema";


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
      { name: ModelContract.name, schema: ModelContractSchema },
      { name: Proposal.name, schema: ProposaltSchema },
      { name: WorkPlan.name, schema: WorkPlanSchema },
      { name: Allotment.name, schema: AllotmentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: ReportGenerated.name, schema: ReportGeneratedSchema },
      { name: EndPoints.name, schema: EndPointsSchema },
      {name:Plataform.name, schema: PlataformSchema}
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
