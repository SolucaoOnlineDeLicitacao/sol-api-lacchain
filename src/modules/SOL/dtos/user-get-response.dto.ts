import { NotificationInterface } from "../interfaces/notification.interface";
import { AssociationModel } from "../models/association.model";
import { SupplierModel } from "../models/supplier.model";

export class UserGetResponseDto {
    constructor(
        public _id: string,
        public name: string,
        public email: string,
        public phone: string,
        public status: string,
        public document: string,
        public profilePicture?: string,
        public office?: string,
        public association?: AssociationModel,
        public supplier?: SupplierModel,
        public roles?: string,
        public notification_list?: NotificationInterface[]
        
    ) { }
}