import { Document } from "mongoose";
import { AssociationInterface } from "../interfaces/association.interface";
import { BidInterface } from "../interfaces/bid.interface";
import { productInterface } from "../interfaces/product.interface";
import { CategoryInterface } from "../interfaces/category.interface";

export interface CategoryModel extends CategoryInterface, Document{
}