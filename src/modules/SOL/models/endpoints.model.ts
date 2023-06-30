import { Document } from "mongoose";
import { EndPointsInterface } from "../interfaces/endpoits.interface";

export interface EndPointsModel extends EndPointsInterface, Document{
}