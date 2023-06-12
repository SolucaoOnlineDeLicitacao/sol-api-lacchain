import { Document } from "mongoose";
import { CostItemsInterface } from "../interfaces/cost-items.interface";

export interface CostItemsModel extends CostItemsInterface, Document{
}