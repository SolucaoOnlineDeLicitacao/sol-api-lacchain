import { Document } from "mongoose";
import { ReportGeneratedInterface } from "../interfaces/report-generated.interface";

export interface ReportGeneratedModel extends ReportGeneratedInterface, Document{
}