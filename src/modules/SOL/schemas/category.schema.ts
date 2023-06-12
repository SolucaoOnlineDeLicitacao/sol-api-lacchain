import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
@Schema({ timestamps: true, collection: Category.name.toLowerCase() })
export class Category {

    @Prop({ required: true, type: String })
    category_name: string;

    @Prop({ required: true, type: String })
    segment: string;

    @Prop({ required: true, unique: true, type: Number })
    identifier: number;

}

export const CategorySchema = SchemaFactory.createForClass(Category);