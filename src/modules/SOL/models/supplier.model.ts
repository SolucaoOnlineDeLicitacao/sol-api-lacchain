import { Document } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";
import { SupplierInterface } from "../interfaces/supplier.interface";

export interface SupplierModel extends SupplierInterface, Document{
}