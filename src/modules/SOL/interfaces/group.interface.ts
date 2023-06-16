import { GroupCostItemRealation } from "../schemas/group-costItem-relation.schema";

export interface GroupInterface {

    name: string;
    idAgreements: string;
    items: GroupCostItemRealation[];

}