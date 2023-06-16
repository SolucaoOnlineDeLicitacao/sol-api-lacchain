import { Document } from "mongoose";
import { CategoryInterface } from "../interfaces/category.interface";

export interface CategoryModel extends CategoryInterface, Document{
}