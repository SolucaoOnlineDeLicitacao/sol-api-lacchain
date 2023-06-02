import { Document } from "mongoose";
import { UserInterface } from "../interfaces/user.interface";

export interface UserModel extends UserInterface, Document{
}