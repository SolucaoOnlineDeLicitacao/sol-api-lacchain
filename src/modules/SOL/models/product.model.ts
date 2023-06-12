import { Document } from "mongoose";
import { AssociationInterface } from "../interfaces/association.interface";
import { BidInterface } from "../interfaces/bid.interface";
import { productInterface } from "../interfaces/product.interface";

export interface ProductModel extends productInterface, Document{
}