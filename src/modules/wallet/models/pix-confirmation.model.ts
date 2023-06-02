import { Document } from "mongoose";
import { PixConfirmationInterface } from "../interfaces/pix-confirmation.interface";

export interface PixConfirmationModel extends PixConfirmationInterface, Document{
}