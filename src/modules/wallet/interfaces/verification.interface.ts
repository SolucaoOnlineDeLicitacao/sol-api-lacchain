import { UserInterface } from "./user.interface";

export interface VerificationInterface {
    readonly attempt: number;
    readonly deadline: Date;
    readonly user: UserInterface;
    readonly code: number;
}