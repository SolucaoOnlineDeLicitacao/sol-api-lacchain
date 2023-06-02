import { Document } from "mongoose";
import { AssociationInterface } from "../interfaces/association.interface";
import { BidInterface } from "../interfaces/bid.interface";

export interface BidModel extends BidInterface, Document{
}