import { Document } from "mongoose";
import { productInterface } from "../interfaces/product.interface";

export interface ProductModel extends productInterface, Document{
}