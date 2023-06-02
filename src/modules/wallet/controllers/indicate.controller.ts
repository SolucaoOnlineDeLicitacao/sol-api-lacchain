import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { IndicateService } from "../services/indicate.service";
import { UserService } from "../services/user.service";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { IndicateRegisterRequestDto } from "../dtos/indicate-register-request.dto";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { ResponseDto } from "src/shared/dtos/response.dto";

@ApiTags('associacao')
@Controller('associacao')
export class IndicateController {

    private readonly _logger = new Logger(IndicateController.name);

    constructor(
        private indicateService: IndicateService,
        private _userService: UserService
    ) { }

    @Post()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async register(
        @Req() request,
        @Body() dto: IndicateRegisterRequestDto,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this.indicateService.register(payload.userId, dto);

            return new ResponseDto(
                true,
                response,
                null,
            );

        } catch (error) {

            this._logger.error(error.message);

            throw new HttpException(
                new ResponseDto(false, null, [error.message]),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async list(
        @Req() request,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this.indicateService.listByUser(payload.userId);

            return new ResponseDto(
                true,
                response,
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