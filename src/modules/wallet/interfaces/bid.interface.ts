import { WalletModel } from "src/shared/models/wallet.model";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRolesEnum } from "../enums/user-roles.enum";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { Allotment } from "../schemas/allotment.schema";
import { User } from "../schemas/user.schema";

import { BidStatusEnum } from "../enums/bid-status.enum";

import { UserInterface } from "./user.interface";

export interface BidInterface {

    readonly description: string;
    readonly agreement: string;

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
    readonly add_allotment?: Allotment;
    readonly invited_suppliers?: string[];

    readonly bid_count: string;

    readonly status: BidStatusEnum;

    readonly association: UserInterface;

    readonly proofreader?: UserInterface;


}