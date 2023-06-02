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

export interface productInterface {

    readonly product_name: string;
    readonly identifier?: number;


}