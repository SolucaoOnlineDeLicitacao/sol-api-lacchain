import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Items, ItemsSchema } from "./items.schema";

@Schema({ timestamps: true, collection: Allotment.name.toLowerCase() })
export class Allotment {

    @Prop({ required: true, type: String })
    allotment_name: string;

    @Prop({ required: true, type: String })
    days_to_delivery: string;

    @Prop({ required: true, type: String })
    place_to_delivery: string;

    @Prop({ required: true, type: String })
    quantity: string;

    @Prop({ required: true, type: String })
    files: string;

    @Prop({ required: false, type: mongoose.Schema.Types.String, ref: Items.name })
    add_item: Items;


}

export const AllotmentSchema = SchemaFactory.createForClass(Allotment);