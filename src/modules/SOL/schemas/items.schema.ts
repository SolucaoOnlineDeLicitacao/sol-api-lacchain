import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UnitMeasureEnum } from "../enums/unit-measure.enum";

@Schema({ timestamps: true, collection: Items.name.toLowerCase() })
export class Items {

    @Prop({ required: true, type: String })
    group: string;

    @Prop({ required: true, unique: true, type: String })
    item: string;


    @Prop({ required: true, type: String })
    quantity: string;

}

export const ItemsSchema = SchemaFactory.createForClass(Items);