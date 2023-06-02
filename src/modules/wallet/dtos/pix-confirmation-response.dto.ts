import { UserModel } from "../models/user.model";

export abstract class PixConfirmationDto {
    pixValue: string;
    
    pixVoucher: string;
    
    tokenValue: string;
    
    status: string;

    userId?: string;

    user?: UserModel;
}