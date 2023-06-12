import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UnitMeasureEnum } from "../enums/unit-measure.enum";
import mongoose from "mongoose";
import { CostItems } from "./cost-items.schema";

@Schema({ timestamps: true, collection: GroupCostItemRealation.name.toLowerCase() })
export class GroupCostItemRealation {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, type: String })
    cost_item_id: string;

    @Prop({ required: true, type: String })
    quantity: string;

    @Prop({ required: true, type: String })
    estimated_cost: string;

}

export const GroupCostItemRealationSchema = SchemaFactory.createForClass(GroupCostItemRealation);