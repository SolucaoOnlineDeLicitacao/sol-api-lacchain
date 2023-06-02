import { Injectable, Logger } from "@nestjs/common";
import { IndicateRegisterRequestDto } from "../dtos/indicate-register-request.dto";
import { IndicateRegisterResponseDto } from "../dtos/indicate-register-response.dto";
import { IndicateModel } from "../models/indicate.model";
import { IndicateRepository } from "../repositories/indicate.repository";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class IndicateService {

    private readonly _logger = new Logger(IndicateService.name);

    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _indicateRespository: IndicateRepository,
    ) { } 

    async register(userId: string, dto: IndicateRegisterRequestDto): Promise<IndicateRegisterResponseDto> {

        dto.userId = userId;

        dto.user = await this._userRepository.getById(dto.userId);

        const result = await this._indicateRespository.register(dto);

        return new IndicateRegisterResponseDto(
            result._id,
        );
    }

    async listByUser(userId: string): Promise<IndicateModel[]> {
        return this._indicateRespository.listByUser(userId);
    }

}