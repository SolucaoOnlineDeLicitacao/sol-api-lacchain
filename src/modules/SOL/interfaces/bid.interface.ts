import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { BidStatusEnum } from "../enums/bid-status.enum";
import { UserInterface } from "./user.interface";
import { AgreementInterface } from "./agreement.interface";
import { AllotmentModel } from "../models/allotment.model";
import { SupplierModel } from "../models/supplier.model";

export interface BidInterface {

    readonly description: string;
    readonly agreement: AgreementInterface;

    readonly password: string;

    readonly classification?: string;
    readonly start_at?: string;
    readonly end_at: string;
    readonly days_to_tiebreaker: string;
    readonly days_to_delivery: string;
    readonly local_to_delivery: string;
    readonly bid_type?: BidTypeEnum;
    readonly modality?: BidModalityEnum;
    readonly aditional_site?: string;
    readonly add_allotment?: AllotmentModel[];
    readonly invited_suppliers?: SupplierModel[];
    readonly bid_count: string;
    readonly editalFile?: string;
    readonly ataFile?: string;

    readonly status: BidStatusEnum;

    readonly association: UserInterface;

    readonly proofreader?: UserInterface;

    readonly additionalDocuments: string[];
    readonly createdAt: Date;

}