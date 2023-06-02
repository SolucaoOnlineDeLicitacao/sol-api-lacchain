import { UserModel } from "../models/user.model";

export interface AgreementInterface {
    register_number: string;
    register_object: string;
    status: string;
    city: string;
    value: string;
    validity_date:string;
    signature_date: string;
    associate_name:string;
    reviewer:string;
    work_plan:string[];
    states: string;


}