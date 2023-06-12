import { Document } from "mongoose";
import { AgreementInterface} from "../interfaces/agreement.interface";

export interface AgreementModel extends AgreementInterface, Document{
}