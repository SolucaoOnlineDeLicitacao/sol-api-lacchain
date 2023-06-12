import { Document } from "mongoose";
import { VerificationInterface } from "../interfaces/verification.interface";

export interface VerificationModel extends VerificationInterface, Document{
}