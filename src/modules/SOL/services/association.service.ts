import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AssociationRepository } from "../repositories/association.repository";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { AssociationModel } from "../models/association.model";
import { AssociationUpdateRequestDto } from "../dtos/association-update-request.dto";
import { ResponseEndpointAssociationDto } from "../dtos/response-endpoint-association.dto";
import { MaritalStatusEnum } from "../enums/marital-status.enum";
import { UserService } from "./user.service";
import { UserRolesEnum } from "../enums/user-roles.enum";
import { UserStatusEnum } from "../enums/user-status.enum";
import { UserTypeEnum } from "../enums/user-type.enum";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class AssociationService {
  private readonly _logger = new Logger(AssociationService.name);

  constructor(private _associationRepository: AssociationRepository, private _userRepository: UserRepository) {}

  async register(dto: AssociationRegisterRequestDto): Promise<AssociationModel> {
    const result = await this._associationRepository.register(dto);
    if (!result) throw new BadRequestException("Não foi possivel criar a associação!");

    return result;
  }

  async update(_id: string, dto: AssociationUpdateRequestDto): Promise<AssociationModel> {
    const item = await this._associationRepository.getById(_id);
    if (!item) {
      throw new BadRequestException("Associação não encontrada!");
    }
    const result = await this._associationRepository.update(_id, dto);
    return result;
  }

  async list(): Promise<AssociationModel[]> {
    const result = await this._associationRepository.list();
    return result;
  }

  async getById(_id: string): Promise<AssociationModel> {
    const result = await this._associationRepository.getById(_id);
    if (!result) {
      throw new BadRequestException("Associação não encontrada!");
    }
    return result;
  }

  async deleteById(_id: string) {
    return await this._associationRepository.deleteById(_id);
  }

  async getByCnpj(cnpj: string): Promise<AssociationModel> {
    return await this._associationRepository.getByCnpj(cnpj);
  }

  async handlerJob(data: ResponseEndpointAssociationDto[]) {
    const now = new Date();
    for (let item of data) {
      const result = await this.register({
        address: {
          city: "",
          complement: item.address.complement || "",
          latitude: (item.address.latitude || 0).toString(),
          longitude: (item.address.longitude || 0).toString(),
          neighborhood: item.address.neighborhood || "",
          number: item.address.number || "",
          zipCode: item.address.cep || "",
          publicPlace: item.address.address || "",
          referencePoint: item.address.reference_point || "",
          state: "",
        },
        cnpj: item.cnpj,
        name: item.name,
        legalRepresentative: {
          address: {
            city: item.legal_representative.address.city_code || "",
            complement: item.legal_representative.address.complement || "",
            latitude: (item.legal_representative.address.latitude || 0).toString(),
            longitude: (item.legal_representative.address.longitude || 0).toString(),
            neighborhood: item.legal_representative.address.neighborhood || "",
            number: (item.legal_representative.address.number || 0).toString(),
            zipCode: item.legal_representative.address.cep || "",
            publicPlace: item.legal_representative.address.address || "",
            referencePoint: item.legal_representative.address.reference_point || "",
            state: "",
          },
          cpf: item.legal_representative.cpf || "",
          maritalStatus: MaritalStatusEnum.solteiro,
          name: item.legal_representative.name || "",
          nationality: item.legal_representative.nationality || "",
          rg: item.legal_representative.rg || "",
          validityData: now,
        },
      });

      item.users.forEach(async user => {
        await this._userRepository.register({
          association: result as any,
          document: user.cpf,
          email: user.email,
          name: user.name,
          office: user.role,
          phone: user.phone,
          roles: UserRolesEnum.geral,
          status: UserStatusEnum.inactive,
          supplier: "",
          type: UserTypeEnum.associacao,
        });
      });
    }
  }
}
