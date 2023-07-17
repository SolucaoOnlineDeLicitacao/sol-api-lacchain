import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Bids } from "./bids.schema";
import mongoose from "mongoose";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";
import { LanguageContractEnum } from "../enums/language-contract.enum";
import { ModelContractClassificationEnum } from "../enums/modelContract-classification.enum";

@Schema({ timestamps: true, collection: ModelContract.name.toLowerCase() })
export class ModelContract {

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, enum: Object.keys(ModelContractStatusEnum), default: ModelContractStatusEnum.ativo })
    status: ModelContractStatusEnum;

    @Prop({ enum:Object.values(ModelContractClassificationEnum)})
    classification: ModelContractClassificationEnum;

    @Prop({ type: String })
    contract: string;

    @Prop({ enum: Object.keys(LanguageContractEnum), default: LanguageContractEnum.portuguese })
    language: LanguageContractEnum;

}

export const ModelContractSchema = SchemaFactory.createForClass(ModelContract);