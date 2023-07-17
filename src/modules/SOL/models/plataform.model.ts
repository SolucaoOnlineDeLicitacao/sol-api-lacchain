import { Document } from "mongoose";
import { PlataformInterface } from "../interfaces/plataform.interface";

export interface PlataformModel extends PlataformInterface, Document{
}