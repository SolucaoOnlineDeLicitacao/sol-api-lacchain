import { Document } from "mongoose";
import { AssociationInterface } from "../interfaces/association.interface";

export interface AssociationModel extends AssociationInterface, Document{
}