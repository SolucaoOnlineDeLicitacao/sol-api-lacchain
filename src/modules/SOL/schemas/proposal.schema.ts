import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProposalStatusEnum } from "../enums/proposal-status.enum";

@Schema({ timestamps: true, collection: Proposal.name.toLowerCase() })
export class Proposal {

    @Prop({ required: true, type: String })
    total_value: string;

    @Prop({ required: true, enum: Object.keys(ProposalStatusEnum), default:ProposalStatusEnum.aguardando })
    status: ProposalStatusEnum;

    @Prop({ required: true, type: Boolean, default: false })
    deleted: boolean;

    @Prop({ required: true, type: Array })
    item_list: string[];


}

export const ProposaltSchema = SchemaFactory.createForClass(Proposal);