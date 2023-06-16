import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { JwtRefreshAuthGuard } from "src/shared/guards/jwt-refresh-auth.guard";
import { EncryptInterceptor } from "src/shared/interceptors/encrypt.interceptor";
import { ValidatorInterceptor } from "src/shared/interceptors/validator.interceptor";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { AuthenticateRequestDto } from "../dtos/authenticate-request.dto";
import { AuthenticationService } from "../services/authentication.service";
import { UserService } from "../services/user.service";
import { AuthenticateValidator } from "../validators/authenticate.validator";

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {

    constructor(
        readonly configService: ConfigService,
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService,
    ) { }

    @Post('/authenticate')
    @HttpCode(200)
    @UseInterceptors(
        new EncryptInterceptor(),
        new ValidatorInterceptor(new AuthenticateValidator())
    )
    async authenticate(
        @Body() dto: AuthenticateRequestDto
    ) {

        try {

            const result = await this.authenticationService.authenticate(dto);

            return new ResponseDto(
                true,
                result,
                null
            );

        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async logout(
        @Req() request,
    ) {

        try {

            const payload: JwtPayload = request.user;

            await this.authenticationService.logoutUser(payload.userId);

            return new ResponseDto(
                true,
                null,
                null
            );

        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/authenticated')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticated(
        @Req() request,
    ) {

        try {
            const payload: any = request.user;

            const user = this.userService.getById(payload.userId);

            if (!!!user) {
                throw new UnauthorizedException('User not found.');
            }

            return new ResponseDto(
                true,
                null,
                null
            );

        } catch (error) {
            throw new HttpException(
                new ResponseDto(
                    false,
                    null,
                    [error.message]), HttpStatus.BAD_REQUEST);
        }
    }
}
