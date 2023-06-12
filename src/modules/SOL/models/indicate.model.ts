import { Document } from "mongoose";
import { IndicateInterface } from "../interfaces/indicate.interface";

export interface IndicateModel extends IndicateInterface, Document{
}