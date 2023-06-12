import { Document } from "mongoose";
import { ContractInterface } from "../interfaces/contract.interface";

export interface ContractModel extends ContractInterface, Document{
}