import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: Products.name.toLowerCase() })
export class Products {

    @Prop({ required: true, type: String })
    product_name: string;

    @Prop({ required: true, unique: true, type: Number })
    identifier: number;

}

export const ProductsSchema = SchemaFactory.createForClass(Products);