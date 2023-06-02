import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UnitMeasureEnum } from "../enums/unit-measure.enum";
import mongoose from "mongoose";
import { CostItems } from "./cost-items.schema";
import { GroupCostItemRealation } from "./group-costItem-relation.schema";

@Schema({ timestamps: true, collection: Group.name.toLowerCase() })
export class Group {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: false,  type: mongoose.Schema.Types.Array, ref: GroupCostItemRealation.name })
    items: GroupCostItemRealation[];


}

export const GroupSchema = SchemaFactory.createForClass(Group);