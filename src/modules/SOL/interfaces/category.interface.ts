import { CategoryNameEnum } from "../enums/category-name.enum";

export interface CategoryInterface {

    readonly category_name: CategoryNameEnum;
    readonly segment: string;
    readonly identifier: number;

}