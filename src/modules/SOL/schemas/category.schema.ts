import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CategoryNameEnum } from "../enums/category-name.enum";
@Schema({ timestamps: true, collection: Category.name.toLowerCase() })
export class Category {

    @Prop({ required: true, enum: Object.keys(CategoryNameEnum) })
    category_name: CategoryNameEnum;

    @Prop({ required: true, type: String })
    segment: string;

    @Prop({ required: true, unique: true, type: Number })
    identifier: number;

}

export const CategorySchema = SchemaFactory.createForClass(Category);