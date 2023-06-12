import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { CostItems } from "./cost-items.schema";

@Schema({ timestamps: true, collection: WorkPlan.name.toLowerCase() })
export class WorkPlan {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({
    required: true,
    type: [
      {
        quantity: { type: Number, required: true },
        unitValue: { type: Number, required: true },
        costItems: { type: mongoose.Schema.Types.ObjectId, ref: CostItems.name, required: true },
      },
    ],
  })
  product: Array<{ quantity: number; unitValue: number; costItems: CostItems }>;

}
export const WorkPlanSchema = SchemaFactory.createForClass(WorkPlan);
