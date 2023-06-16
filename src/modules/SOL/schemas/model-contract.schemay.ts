import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Bids } from "./bids.schema";
import mongoose from "mongoose";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";

@Schema({ timestamps: true, collection: ModelContract.name.toLowerCase() })
export class ModelContract {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, enum: Object.keys(ModelContractStatusEnum), default: ModelContractStatusEnum.ativo })
    status: ModelContractStatusEnum;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Bids.name })
    bid: Bids;

    @Prop({ type: String })
    contract: string;

}

export const ModelContractSchema = SchemaFactory.createForClass(ModelContract);