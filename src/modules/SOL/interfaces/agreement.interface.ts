import { AgreementStatusEnum } from "../enums/agreement-status.enum";
import { AssociationModel } from "../models/association.model";
import { CostItemsModel } from "../models/cost-items.model";
import { UserModel } from "../models/user.model";
import { WorkPlanModel } from "../models/work-plan.model";

export interface AgreementInterface {
  register_number: string;
  register_object: string;
  status: AgreementStatusEnum;
  city: string;
  states: string;
  value: number;
  validity_date: Date;
  signature_date: Date;
  association: AssociationModel;
  reviewer: UserModel;
  workPlan: WorkPlanModel[];
}

export interface WorkPlanInterface {
  name: string;
  product: Array<{ quantity: string; unitValue: number; costItems: CostItemsModel }>;

}
