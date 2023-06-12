import { MaritalStatusEnum } from "src/modules/SOL/enums/marital-status.enum";
import { AddressInterface } from "./address.interface";

export interface LegalRepresentativeInterface {
    readonly name: string;
    readonly nationality: string;
    readonly maritalStatus: MaritalStatusEnum;
    readonly cpf: string;
    readonly rg: string;
    readonly validityData: Date;
    readonly address: AddressInterface;
}
