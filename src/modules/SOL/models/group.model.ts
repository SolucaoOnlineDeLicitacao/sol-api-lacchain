import { Document } from "mongoose";
import { AssociationInterface } from "../interfaces/association.interface";
import { BidInterface } from "../interfaces/bid.interface";
import { GroupInterface } from "../interfaces/group.interface";

export interface GroupModel extends GroupInterface, Document{
}