import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TfaGetResponseDto } from "../dtos/tfa-get-response.dto";
import { TfaRepository } from "../repositories/tfa.repository";
import { UserRepository } from "../repositories/user.repository";
import { authenticator } from 'otplib';
import { TfaModel } from "../models/tfa.model";
import { TfaRegisterRequestDto } from "../dtos/tfa-register-request.dto";
import { TfaVerifyRequestDto } from "../dtos/tfa-verify-request.dto";
import { TfaVerifyAuthRequestDto } from "../dtos/tfa-verify-auth-request.dto";
import * as bcrypt from 'bcryptjs';
import { TfaDeleteRequestDto } from "../dtos/tfa-delete-request.dto";
import { UserStatusEnum } from "../enums/user-status.enum";
import { AuthenticateResponseDto } from "../dtos/authenticate-responsedto";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class TfaService {

    constructor(
        private readonly _tfaRepository: TfaRepository,
        private readonly _userRepository: UserRepository,
        private readonly authenticationService: AuthenticationService
    ) { }

    async getByUserId(userId: string): Promise<TfaGetResponseDto> {

        const tfa = await this._tfaRepository.getByUserId(userId);

        return new TfaGetResponseDto(
            tfa?._id,
            tfa?.url,
            tfa?.user._id,
            tfa?.secret,
        );
    }

    async register(dto: TfaRegisterRequestDto) {

        const tfa: TfaModel = await this._tfaRepository.getByUserId(dto.userId);

        if (tfa)
            throw new ForbiddenException('2fa already registered!');

        dto.user = await this._userRepository.getById(dto.userId);

        await this._tfaRepository.save(dto);


        const accessToken = this.authenticationService.createAccessToken(
            dto.user._id,
            dto.user.email,
            dto.user.type,
            true,
            true,
        );

        const refreshToken = this.authenticationService.createRefreshToken(
            dto.user._id,
            dto.user.email,
            dto.user.type,
            true,
            true,
        );

        return new AuthenticateResponseDto(
            dto.user.email,
            dto.user.name,
            dto.user.id,
            accessToken.accessToken,
            refreshToken.accessToken,
            dto.user.type,
            dto.user.roles
        );
    }

    async delete(dto: TfaDeleteRequestDto) {

        dto.user = await this._userRepository.getById(dto.userId);

        if (!dto.user)
            throw new NotFoundException('Email ou senha inválido(s)!');

        if (dto.user.status === UserStatusEnum.inactive)
            throw new UnauthorizedException('Erro ao realizar a autenticação!');

        if (dto.user && await bcrypt.compare(dto.password, dto.user.password))
            await this._tfaRepository.delete(dto.userId);
        else
            throw new BadRequestException('Erro ao deletar 2fa!');

        const accessToken = this.authenticationService.createAccessToken(
            dto.user._id,
            dto.user.email,
            dto.user.type,
            true,
            true,
        );

        const refreshToken = this.authenticationService.createRefreshToken(
            dto.user._id,
            dto.user.email,
            dto.user.type,
            true,
            true,
        );

        return new AuthenticateResponseDto(
            dto.user.email,
            dto.user.name,
            dto.user.id,
            accessToken.accessToken,
            refreshToken.accessToken,
            dto.user.type,
            dto.user.roles
        );
    }

    verify(dto: TfaVerifyRequestDto): boolean {
        return authenticator.verify({ token: dto.code.toString(), secret: dto.secret });
    }


    async verifyAuth(userId: string, dto: TfaVerifyAuthRequestDto): Promise<boolean> {

        const tfa: TfaModel = await this._tfaRepository.getByUserId(userId);

        if (!tfa)
            throw new NotFoundException('2fa not found!');

        return authenticator.verify({ token: dto.code.toString(), secret: tfa.secret });
    }
}