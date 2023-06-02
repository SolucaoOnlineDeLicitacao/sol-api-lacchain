import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Wallet {

    @Prop({ required: true, unique: true })
    address: string;

    @Prop({ required: true, unique: true })
    privateKey: string;
}
export const WalletSchema = SchemaFactory.createForClass(Wallet);