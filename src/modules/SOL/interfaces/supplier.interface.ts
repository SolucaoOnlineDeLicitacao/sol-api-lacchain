
import { SuplierTypeEnum } from "../enums/supplier-type.enum";
import { Address } from "src/shared/schemas/address.schema";
import { LegalRepresentative } from "src/shared/schemas/legal-representative.schema";
import { Notification } from "../schemas/notification.schema";
import { CategoryModel } from "../models/category.model";
import { Category } from "../schemas/category.schema";

export interface SupplierInterface {
    readonly name: string;
    readonly cpf: string;
    readonly blocked: boolean;
    readonly blocked_reason: string;
    readonly type: SuplierTypeEnum;
    readonly categories: Category[];
    readonly address: Address;
    readonly legal_representative: LegalRepresentative;
    readonly group_id: string[];
    readonly notification_list: Notification[];
    readonly createdAt: Date;

}