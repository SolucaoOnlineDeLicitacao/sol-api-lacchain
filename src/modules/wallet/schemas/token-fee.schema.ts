import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: TokenFee.name.toLowerCase() })
export class TokenFee {

    @Prop({ required: true, type: String, unique: true })
    symbol: string;

    @Prop({ required: true })
    buy: number;

    @Prop({ required: true })
    sell: number;
}
export const TokenFeeSchema = SchemaFactory.createForClass(TokenFee);