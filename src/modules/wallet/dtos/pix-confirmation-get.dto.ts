import { UserModel } from "../models/user.model";

export class PixConfirmationGetResponseDto {
    constructor(
        public _id: string,
        public pixValue: string,
        public pixVoucher: string,
        public tokenValue: string,
        public status: string,
        public  user: UserModel,
    ) { }
}