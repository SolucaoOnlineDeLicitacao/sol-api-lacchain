import { Injectable } from "@nestjs/common";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { AirdropGetResponseDto } from "../dtos/airdrop-get-response.dto";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AirdropRegisterResponseDto } from "../dtos/airdrop-register-response.dto";
import { AirdropUpdateRequestDto } from "../dtos/airdrop-update-request.dto";
import { AirdropUpdateResponseDto } from "../dtos/airdrop-update-response.dto";
import { AgreementRepository } from "../repositories/agreement.repository";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class AirdropService {

    constructor(
        private readonly _agreementRepository: AgreementRepository,
        private readonly _userRepository: UserRepository,
    ) { }

    async findById(id: string): Promise<AgreementRegisterRequestDto> {

        return await this._agreementRepository.findById(id);

    }

    async deleteById(id: string): Promise<AgreementRegisterRequestDto> {

        return await this._agreementRepository.deleteById(id);

    }

    async register( dto: AgreementRegisterRequestDto): Promise<AgreementRegisterRequestDto> {

        


        const result = await this._agreementRepository.register(dto);

        return result
    }

    async findAll( ): Promise<AgreementRegisterRequestDto[]> {


        const result = await this._agreementRepository.findAll();

        return result
    }

    async update(id: string, dto: AgreementRegisterRequestDto): Promise<AgreementRegisterRequestDto> {
     
       return  await this._agreementRepository.update(id, dto);
    
    }
}