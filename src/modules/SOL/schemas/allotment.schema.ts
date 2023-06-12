import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Items, ItemsSchema } from "./items.schema";
import { Proposal } from "./proposal.schema";
import { uuid } from "aws-sdk/clients/customerprofiles";


@Schema({ timestamps: true, collection: Allotment.name.toLowerCase() })
export class Allotment {
   

    @Prop({ required: false, type: String })
    allotment_name: string;

    @Prop({ required: false, type: String })
    days_to_delivery: string;

    @Prop({ required: false, type: String })
    place_to_delivery: string;

    @Prop({ required: false, type: String })
    quantity: string;

    @Prop({ required: true, type: String })
    files: string;
    @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Proposal.name })
    //@Prop({ required: false, type: [ {type: mongoose.Schema.Types.ObjectId, ref: Proposal.name}] })
    proposals: Proposal[]

    @Prop({ required: false, type: mongoose.Schema.Types.Array, ref: Items.name })
    add_item: Items[];


}

export const AllotmentSchema = SchemaFactory.createForClass(Allotment);