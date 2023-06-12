import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UnitMeasureEnum } from "../enums/unit-measure.enum";
import { Category } from "./category.schema";
import * as mongoose from 'mongoose';
import { Products } from "./product.schema";

@Schema({ timestamps: true, collection: CostItems.name.toLowerCase() })
export class CostItems {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, unique: true, type: String })
    code: string;

    @Prop({ required: true, type: String, enum: Object.keys(UnitMeasureEnum) })
    unitMeasure: string;

    @Prop({ required: true, type: String })
    specification: string;

    @Prop({ required: true, type: Boolean })
    sustainable: boolean

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Category.name })
    category: Category;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Products.name })
    product: Products;

    @Prop({ required: true, type: String })
    product_relation: string;
}

export const CostItemsSchema = SchemaFactory.createForClass(CostItems);