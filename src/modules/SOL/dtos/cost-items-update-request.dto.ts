import { ApiProperty } from "@nestjs/swagger";
import { UnitMeasureEnum } from "../enums/unit-measure.enum";
import { ProductModel } from "../models/product.model";
import { CategoryModel } from "../models/category.model";

export abstract class CostItemsUpdateRequestDto {

    @ApiProperty({ type: String })
    code: string;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String, enum: Object.keys(UnitMeasureEnum) })
    unitMeasure: string;

    @ApiProperty({ type: String })
    categoryId: string;

    @ApiProperty({ type: String })
    productId: string;

    product: ProductModel;

    category: CategoryModel;

    @ApiProperty({ type: String })
    specification: string;

    @ApiProperty({ type: Boolean })
    sustainable: boolean

    @ApiProperty({ type: String })
    product_relation: string

}