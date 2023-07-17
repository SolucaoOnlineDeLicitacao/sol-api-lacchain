import { TfaRepository } from '../repositories/tfa.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { EnviromentVariablesEnum } from 'src/shared/enums/enviroment.variables.enum';
import { AuthenticateRequestDto } from '../dtos/authenticate-request.dto';
import { AuthenticateResponseDto } from '../dtos/authenticate-responsedto';
import { UserStatusEnum } from '../enums/user-status.enum';
import { UserModel } from '../models/user.model';
import { UserTypeEnum } from '../enums/user-type.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userRepository: UserRepository,
    private readonly _configService: ConfigService,
    private readonly _tfaRepository: TfaRepository,
  ) { }

  private async validate(email: string, password: string): Promise<UserModel> {
    const user = await this._userRepository.getByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) return user;
    else return null;
  }

  createAccessToken(
    userId: string,
    email: string,
    type: UserTypeEnum,
    tfaRegistered: boolean,
    tfaAuthenticate: boolean,
  ) {
    const user: JwtPayload = {
      userId,
      email,
      type,
      tfaRegistered,
      tfaAuthenticate,
    };
    const expiresIn = this._configService.get(
      EnviromentVariablesEnum.JWT_ACCESS_TOKEN_EXPIRATION,
    );
    const accessToken = this._jwtService.sign(user, {
      expiresIn,
      secret: this._configService.get(
        EnviromentVariablesEnum.JWT_KEY,
      )
    });

    return { accessToken, expiresIn };
  }

  createRefreshToken(
    userId: string,
    email: string,
    type: UserTypeEnum,
    tfaRegistered: boolean,
    tfaAuthenticate: boolean,
  ) {
    const user: JwtPayload = {
      userId,
      email,
      type,
      tfaRegistered,
      tfaAuthenticate,
    };
    const expiresIn = this._configService.get(
      EnviromentVariablesEnum.JWT_REFRESH_TOKEN_EXPIRATION,
    );
    const accessToken = this._jwtService.sign(user, {
      expiresIn,
      secret: this._configService.get(
        EnviromentVariablesEnum.JWT_REFRESH_TOKEN_KEY,
      )
    });

    return { accessToken, expiresIn };
  }

  async authenticate(
    dto: AuthenticateRequestDto,
  ): Promise<AuthenticateResponseDto> {

    const userByemail = await this._userRepository.getByEmail(dto.email);
    if (userByemail && userByemail.status == UserStatusEnum.inactive) throw new NotFoundException('Usuário inativo, faça o primeiro acesso!');

    const user = await this.validate(dto.email, dto.password);

    if (!user) throw new NotFoundException('Email ou senha inválido(s)!');

    if (user.status === UserStatusEnum.inactive)
      throw new UnauthorizedException('Erro ao realizar a autenticação!');

    const tfa = await this._tfaRepository.getByUserId(user._id.toString());

    const accessToken = this.createAccessToken(
      user._id,
      user.email,
      user.type,
      !!tfa ? true : false,
      false,
    );

    const refreshToken = this.createRefreshToken(
      user._id,
      user.email,
      user.type,
      !!tfa ? true : false,
      false,
    );

    this.updateRefreshTokenFromUser(user, refreshToken);

    return new AuthenticateResponseDto(
      user.email,
      user.name,
      user.id,
      accessToken.accessToken,
      refreshToken.accessToken,
      user.type,
      user.roles
    );
  }

  async logoutUser(userId: string) {
    await this._userRepository.updateRefreshToken(userId, null);
  }

  async updateRefreshTokenFromUser(user: UserModel, refreshToken: { accessToken: string; expiresIn: any; }) {
    this._userRepository.updateRefreshToken(user._id, await bcrypt.hash(refreshToken.accessToken, 13));
  }
}
