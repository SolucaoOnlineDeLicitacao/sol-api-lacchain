import { Document } from "mongoose";
import { TfaInterface } from "../interfaces/tfa.interface";

export interface TfaModel extends TfaInterface, Document{
}