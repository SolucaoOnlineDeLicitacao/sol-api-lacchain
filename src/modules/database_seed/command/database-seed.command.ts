import { Injectable, Logger } from "@nestjs/common";
import { Command } from "nestjs-command";
import { UserService } from "../../SOL/services/user.service";
import { UserTypeEnum } from "../../SOL/enums/user-type.enum";
import { UserRolesEnum } from "../../SOL/enums/user-roles.enum";
import { UserStatusEnum } from "../../SOL/enums/user-status.enum";
import { AssociationService } from "../../SOL/services/association.service";
import { MaritalStatusEnum } from "../../SOL/enums/marital-status.enum";

@Injectable()
export class DatabaseSeedCommand {

    logger: Logger;

    constructor(
        private readonly _userService: UserService,
        private readonly _associationService: AssociationService,
    ) {
        this.logger = new Logger(DatabaseSeedCommand.name);
    }


    @Command({ command: 'seed:database', describe: 'seed database' })
    async seed() {

        try {
            const association = await this._associationService.register({
                name: 'associação principal',
                cnpj: '57.964.193/0001-18',
                address: {
                    zipCode: '01124020',
                    publicPlace: 'rua salvador leme',
                    neighborhood: 'bom retiro',
                    city: 'são paulo',
                    state: 'sp',
                    latitude: '-23.5272227',
                    longitude: '-46.6347055',
                    complement: '',
                    referencePoint: '',
                    number: '100',
                },
                legalRepresentative: {
                    name: 'admin',
                    nationality: 'brasileiro',
                    maritalStatus: MaritalStatusEnum.solteiro,
                    cpf: '11111111111',
                    rg: '111111111',
                    validityData: new Date(),
                    address: {
                        zipCode: '01124020',
                        publicPlace: 'rua salvador leme',
                        neighborhood: 'bom retiro',
                        city: 'são paulo',
                        state: 'sp',
                        latitude: '-23.5272227',
                        longitude: '-46.6347055',
                        complement: '',
                        referencePoint: '',
                        number: '100',
                    },
                }
            });

            const admin = await this._userService.register({
                email: 'admin@lacchain.com',
                name: 'administrador',
                phone: '011313121545',
                document: '1111111110',
                office: 'admin1',
                association: association._id,
                supplier: '',
                roles: UserRolesEnum.geral,
                type: UserTypeEnum.administrador,
                status: UserStatusEnum.inactive,
            });

            await this._userService.registerPassword(
                admin._id,
                {
                    email: admin.email,
                    status: UserStatusEnum.active,
                    password: 'P@ssw0rd',
                });

            console.log('seed finished');
        } catch (error) {
            console.error(error);
        }
    }
}
