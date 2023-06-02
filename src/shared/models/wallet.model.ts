import { Document } from "mongoose";
import { WalletInterface } from "../interfaces/wallet.interface";

export interface WalletModel extends WalletInterface, Document {

}