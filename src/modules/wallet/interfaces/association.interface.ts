import { AddressInterface } from "src/shared/interfaces/address.interface";
import { LegalRepresentativeInterface } from "src/shared/interfaces/legal-representative.interface";

export interface AssociationInterface {

    readonly name: string;
    readonly cnpj: string;
    readonly legalRepresentative: LegalRepresentativeInterface;
    readonly address: AddressInterface;
    
}