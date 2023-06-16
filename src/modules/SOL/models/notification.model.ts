import { Document } from "mongoose";
import { NotificationInterface } from "../interfaces/notification.interface";

export interface NotificationModel extends NotificationInterface, Document{
}