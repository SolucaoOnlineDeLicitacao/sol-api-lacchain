import { Document } from "mongoose";
import { ModelContractInterface } from "../interfaces/model-contract.interface";

export interface ModelContractModel extends ModelContractInterface, Document{
}