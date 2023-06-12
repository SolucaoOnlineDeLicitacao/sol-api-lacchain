
import { SuplierTypeEnum } from "../enums/supplier-type.enum";
import { Address } from "src/shared/schemas/address.schema";
import { LegalRepresentative } from "src/shared/schemas/legal-representative.schema";

export interface SupplierInterface {

    readonly name: string;
    readonly cpf: string;
    readonly blocked: boolean;
    readonly blocked_reason: string;
    readonly type: SuplierTypeEnum;
    
    readonly address: Address;
    readonly legal_representative: LegalRepresentative;
    readonly group_id: string[];
  
  

}