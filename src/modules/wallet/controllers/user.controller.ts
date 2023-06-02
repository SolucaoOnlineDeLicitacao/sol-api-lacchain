import { UserTypeEnum } from './../enums/user-type.enum';
import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ValidatorInterceptor } from "src/shared/interceptors/validator.interceptor";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { UserConfirmationRegisterSendRequestDto } from "../dtos/user-confirmation-register-request.dto";
import { UserRegisterConfirmationCodeRequestDto } from "../dtos/user-register-confirmation-code-request.dto";
import { UserRegisterPasswordRequestDto } from "../dtos/user-register-password-request.dto";
import { UserRegisterRequestDto } from "../dtos/user-register-request.dto";
import { UserRegisterResendEmailRequestDto } from "../dtos/user-register-resend-email-request.dto";
import { UserResetPasswordConfirmationRequestDto } from "../dtos/user-reset-password-confirmation-request.dto";
import { UserResetPasswordRequestDto } from "../dtos/user-reset-password-request.dto";
import { UserResetPasswordResendEmailRequestDto } from "../dtos/user-reset-password-resend-email-request.dto";
import { UserUpdatePasswordRequestDto } from "../dtos/user-update-password-request.dto";
import { UserUpdateProfilePictureRequestDto } from "../dtos/user-update-profile-picture-request.dto";
import { UserUpdateRequestDto } from "../dtos/user-update-request.dto";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { VerificationService } from "../services/verification.service";
import { UserRegisterValidator } from "../validators/user-register.validator";
import { UserResetPasswordConfirmationValidator } from "../validators/user-reset-password-confirmation.validator";
import { UserResetPasswordResendEmailValidator } from "../validators/user-reset-password-resend-email.validator";
import { UserUpdatePasswordValidator } from "../validators/user-update-password.validator";
import { UserUpdateValidator } from "../validators/user-update.validator";
import { UserUpdateByIdRequestDto } from '../dtos/user-update-by-id-request.dto';

@ApiTags('user')
@Controller('user')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly verificationService: VerificationService,
  ) { }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUser(
    @Req() request,
  ) {

    try {

      const payload: JwtPayload = request.user;

      const response = await this.userService.getById(payload.userId);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('get-by-id/:_id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getById(
    @Param('_id') _id: string,
  ) {

    try {

      const response = await this.userService.getById(_id);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('list-by-type/:type')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listByType(
    @Param('type') type: UserTypeEnum,
  ) {

    try {

      const response = await this.userService.listByType(type);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('register')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(new ValidatorInterceptor(new UserRegisterValidator()))
  async register(
    @Body() dto: UserRegisterRequestDto,
  ) {

    try {

      const response = await this.userService.register(dto);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('confirm-registration-code')
  @HttpCode(201)
  async confirmRegistrationCode(
    @Body() dto: UserRegisterConfirmationCodeRequestDto,
  ) {

    try {

      const user = await this.userRepository.getByEmail(dto.email)

      const response = await this.verificationService.verifyCode(user, dto.code);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('register-password')
  @HttpCode(201)
  async registerPassword(
    @Body() dto: UserRegisterPasswordRequestDto,
  ) {

    try {

      const user = await this.userService.getByEmail(dto.email)

      const response = await this.userService.registerPassword(user._id, dto)

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('confirmation-register-send')
  @HttpCode(200)
  async confirmationRegisterSend(
    @Body() dto: UserConfirmationRegisterSendRequestDto,
  ) {

    try {

      if (dto.type === 'email') {
        const user = await this.userService.getByEmail(dto.value);
        let response = await this.verificationService.sendRegister(user);
        return new ResponseDto(
          true,
          response,
          null,
        );
      } else {
        let response = await this.verificationService.sendSms(dto);

        return new ResponseDto(
          true,
          response,
          null,
        );
      }



    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('resend-code-register-email')
  @HttpCode(200)
  async resendCodeRegisterEmail(
    @Body() dto: UserRegisterResendEmailRequestDto,
  ) {

    try {

      const response = await this.verificationService.resendCodeRegisterEmail(dto)

      return new ResponseDto(
        true,
        response,
        null,
      );



    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('resend-code-register-sms')
  @HttpCode(200)
  async resendCodeRegisterSms(
    @Body() dto: UserRegisterResendEmailRequestDto,
  ) {

    try {

      const response = await this.verificationService.resendCodeRegisterSms(dto)

      return new ResponseDto(
        true,
        response,
        null,
      );



    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(new ValidatorInterceptor(new UserUpdateValidator()))
  async update(
    @Req() request,
    @Body() dto: UserUpdateRequestDto,
  ) {

    try {

      const payload: JwtPayload = request.user;

      const response = await this.userService.update(payload.userId, dto);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update-by-id/:_id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(new ValidatorInterceptor(new UserUpdateValidator()))
  async updateById(
    @Param('_id') _id: string,
    @Body() dto: UserUpdateByIdRequestDto,
  ) {

    try {

      const response = await this.userService.updateById(_id, dto);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update-password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(new ValidatorInterceptor(new UserUpdatePasswordValidator()))
  async updatePassword(
    @Req() request,
    @Body() dto: UserUpdatePasswordRequestDto,
  ) {

    try {

      const payload: JwtPayload = request.user;

      const response = await this.userService.updatePassword(payload.userId, dto);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('balance')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getBalance(
    @Req() request,
  ) {

    try {

      const payload: JwtPayload = request.user;

      const response = await this.userService.getBalance(payload.userId);

      return new ResponseDto(
        true,
        response,
        null,
      );


    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body() dto: UserResetPasswordRequestDto
  ) {

    try {

      const user = await this.userService.getByEmail(dto.email);

      const result = await this.verificationService.send(user);

      return new ResponseDto(
        true,
        result,
        null,
      );

    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('first-access')
  @HttpCode(200)
  async firstAccess(
    @Body() dto: UserResetPasswordRequestDto
  ) {

    try {

      const user = await this.userService.getByEmailFirstAccess(dto.email);
      const result = await this.verificationService.sendFirstAcess(user);

      return new ResponseDto(
        true,
        result,
        null,
      );

    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('reset-password-confirmation')
  @HttpCode(200)
  @UseInterceptors(
    new ValidatorInterceptor(new UserResetPasswordConfirmationValidator()),
  )
  async resetPasswordConfirmation(
    @Body() dto: UserResetPasswordConfirmationRequestDto
  ) {

    try {

      const response = await this.userService.updatePasswordWithCode(dto);

      return new ResponseDto(
        true,
        response,
        null
      );

    } catch (error) {

      this.logger.error(JSON.stringify(error));

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('reset-password-resend-email')
  @HttpCode(200)
  @UseInterceptors(
    new ValidatorInterceptor(new UserResetPasswordResendEmailValidator()),
  )
  async resetPasswordResendEmail(
    @Body() dto: UserResetPasswordResendEmailRequestDto,
  ) {

    try {

      const result = await this.verificationService.resendResetPasswordEmail(dto);

      return new ResponseDto(
        true,
        result,
        null,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update-profile-picture')
  @HttpCode(200)
  async updateProfilePicture(
    @Body() dto: UserUpdateProfilePictureRequestDto
  ) {

    try {

      const profilePicture = await this.userService.updateProfilePicture(dto.userId, dto.profilePicture);

      return new ResponseDto(
        true,
        profilePicture,
        null,
      );

    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete-by-id/:_id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteById(
    @Param('_id') _id: string,
  ) {

    try {

      const result = await this.userService.deleteById(_id);

      return new ResponseDto(
        true,
        result,
        null,
      );

    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}