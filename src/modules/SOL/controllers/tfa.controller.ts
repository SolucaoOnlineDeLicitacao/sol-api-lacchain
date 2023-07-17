import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/dtos/response.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ValidatorInterceptor } from 'src/shared/interceptors/validator.interceptor';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { AuthenticateResponseDto } from '../dtos/authenticate-responsedto';
import { TfaDeleteRequestDto } from '../dtos/tfa-delete-request.dto';
import { TfaRegisterRequestDto } from '../dtos/tfa-register-request.dto';
import { TfaVerifyAuthRequestDto } from '../dtos/tfa-verify-auth-request.dto';
import { TfaVerifyRequestDto } from '../dtos/tfa-verify-request.dto';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationService } from '../services/authentication.service';
import { TfaService } from '../services/tfa.service';
import { TfaRegisterValidator } from '../validators/tfa-register.validator';
import { TfaVerifyAuthValidator } from '../validators/tfa-verify-auth.validator';
import { TfaVerifyValidator } from '../validators/tfa-verify.validator';

@ApiTags('2fa')
@Controller('2fa')
export class TfaController {
  constructor(
    private readonly _tfaService: TfaService,
    private readonly _userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) { }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async get(@Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this._tfaService.getByUserId(payload.userId);

      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Post('register')
  @HttpCode(201)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new ValidatorInterceptor(new TfaRegisterValidator()))
  async registrar(@Req() request, @Body() dto: TfaRegisterRequestDto) {
    try {
      const payload: JwtPayload = request.user;
      dto.userId = payload.userId;

      const result = await this._tfaService.register(dto);

      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('delete')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Req() request, @Body() dto: TfaDeleteRequestDto) {
    try {
      const payload: JwtPayload = request.user;

      dto.userId = payload.userId;

      const isValid = this._tfaService.verify(dto);

      if (!isValid) throw new BadRequestException('Código inválido!');

      const result = await this._tfaService.delete(dto);

      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new ValidatorInterceptor(new TfaVerifyValidator()))
  async verify(@Body() dto: TfaVerifyRequestDto) {
    try {
      const response = this._tfaService.verify(dto);

      return new ResponseDto(
        true,
        {
          isValid: response,
        },
        null,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify/auth')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(new ValidatorInterceptor(new TfaVerifyAuthValidator()))
  async verifyRegistered(@Req() request, @Body() dto: TfaVerifyAuthRequestDto) {
    try {
      const payload: JwtPayload = request.user;

      const user = await this._userRepository.getById(payload.userId);

      const isValid = await this._tfaService.verifyAuth(user._id, dto);

      const accessToken = await this.authenticationService.createAccessToken(
        payload.userId,
        payload.email,
        payload.type,
        true,
        true,
      );

      const refreshToken = await this.authenticationService.createRefreshToken(
        payload.userId,
        payload.email,
        payload.type,
        true,
        true,
      );

      if (isValid) {
        return new ResponseDto(
          true,
          new AuthenticateResponseDto(
            user.email,
            user.name,
            user.id,
            accessToken.accessToken,
            refreshToken.accessToken,
            user.type,
            user.roles
          ),
          null,
        );
      } else {
        throw new BadRequestException('Invalid code');
      }
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
