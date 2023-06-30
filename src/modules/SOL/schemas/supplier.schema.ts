import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SuplierTypeEnum } from "../enums/supplier-type.enum";
import { Address, AddressSchema } from "src/shared/schemas/address.schema";
import { LegalRepresentative, LegalRepresentativeSchema } from "src/shared/schemas/legal-representative.schema";
import { Notification } from "./notification.schema";
import { Category } from "./category.schema";


@Schema({ timestamps: true, collection: Supplier.name.toLowerCase() })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  cpf: string;

  @Prop({ required: true, type: Boolean, default: false })
  blocked: boolean;

  @Prop({ required: false, type: String })
  blocked_reason: string;

  @Prop({ required: false, enum: Object.keys(SuplierTypeEnum) })
  type: SuplierTypeEnum;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ type: LegalRepresentativeSchema, required: true })
  legal_representative: LegalRepresentative;

  @Prop({ required: false, type: Array })
  group_id: string[];

  @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Notification.name })
  notification_list: Notification[];

  @Prop({ required: false, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }] })
  categories: Category[];
  
}
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
