import { Document } from "mongoose";
import { WorkPlanInterface } from "../interfaces/agreement.interface";


export interface WorkPlanModel extends WorkPlanInterface, Document{
}