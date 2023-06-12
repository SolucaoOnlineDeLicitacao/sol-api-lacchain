import { WalletModel } from "src/shared/models/wallet.model";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRolesEnum } from "../enums/user-roles.enum";
import { BidTypeEnum } from "../enums/bid-type.enum";
import { BidModalityEnum } from "../enums/bid-modality.enum";
import { Allotment } from "../schemas/allotment.schema";
import { User } from "../schemas/user.schema";
import { CostItems } from "../schemas/cost-items.schema";
import { GroupCostItemRealation } from "../schemas/group-costItem-relation.schema";

export interface GroupInterface {

    name: string;
    idAgreements: string;
    items: GroupCostItemRealation[];

}