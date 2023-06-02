import { UserModel } from "../models/user.model";

export class VerificationRegisterRequestDto {
    constructor(
        public attempt: number,
        public deadline: Date,
        public user: UserModel,
        public code: number,
    ) { }
}