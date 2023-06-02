import { Document } from "mongoose";
import { AgreementInterface} from "../interfaces/agreement.interface";

export interface AgreementpModel extends AgreementInterface, Document{
}