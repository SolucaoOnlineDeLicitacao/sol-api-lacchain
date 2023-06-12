import { UnitMeasureEnum } from "../enums/unit-measure.enum";
import { CategoryModel } from "../models/category.model";
import { ProductModel } from "../models/product.model";
export interface CostItemsInterface {

    readonly code: string;
    readonly name: string;
    readonly unitMeasure: UnitMeasureEnum;
    readonly category: CategoryModel;
    readonly product: ProductModel;
    readonly specification: string;
    readonly sustainable: boolean;
    readonly product_relation: string
    
}