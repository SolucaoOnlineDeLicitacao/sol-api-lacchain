import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Address, AddressSchema } from "src/shared/schemas/address.schema";
import { LegalRepresentative, LegalRepresentativeSchema } from "src/shared/schemas/legal-representative.schema";

@Schema({ timestamps: true, collection: Association.name.toLowerCase() })
export class Association {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    cnpj: string;

    @Prop({ type: LegalRepresentativeSchema, required: true })
    legalRepresentative: LegalRepresentative;

    @Prop({ type: AddressSchema, required: true })
    address: Address;

}

export const AssociationSchema = SchemaFactory.createForClass(Association);