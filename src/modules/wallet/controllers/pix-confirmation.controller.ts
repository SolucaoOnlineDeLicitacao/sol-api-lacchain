import { UserService } from './../services/user.service';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { PixConfirmationRegisterRequestDto } from "../dtos/pix-confirmation-register-request.dto";
import { PixConfirmationDto } from "../dtos/pix-confirmation-response.dto";
import { PixConfirmationStatus } from "../dtos/pix-confirmation-status";
import { PixConfirmationUpdateStatusRequestDto } from "../dtos/pix-confirmation-update-status-request.dto";
import { PixConfirmationService } from "../services/pix-confirmation.service";
import { PixConfirmationQueryDto } from '../dtos/pix-confirmation-query.dto';

@ApiTags('administracao')
@Controller('administracao')
export class PixConfirmationController {

    private readonly _logger = new Logger(PixConfirmationController.name);

    constructor(
        private _pixConfirmationService: PixConfirmationService,
        private _userService: UserService
    ) { }

    @Get()
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async list() {

        try {

            const response = await this._pixConfirmationService.list();

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

    @Get('/userId/:_id/:dateTo/:dateFrom/:status')
    @HttpCode(200)
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'status', required: false })
    async listByUser(
        @Param('_id') _id: string,
        @Query() queryArgs: PixConfirmationQueryDto,
    ) {
        try {

            const user = await this._userService.getById(_id);
            const result = await this._pixConfirmationService.listByUser(user._id, queryArgs.dateFrom, queryArgs.dateTo, queryArgs.status);

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

    @Get('/status/:status')
    @HttpCode(200)
    async listByStatus(
        @Param('status') status: PixConfirmationStatus,
    ) {

        try {

            const response = await this._pixConfirmationService.listByStatus(status);

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

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    // @UseInterceptors(new ValidatorInterceptor(new AirdropRegisterValidator()))
    async register(
        @Req() request,
        @Body() dto: PixConfirmationRegisterRequestDto,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this._pixConfirmationService.register(payload.userId, dto);

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

    @Put('update/id/:id')
    @HttpCode(200)
    async update(
        @Param('id') _id: string,
        @Body() dto: PixConfirmationUpdateStatusRequestDto,
    ) {

        try {

            const response = await this._pixConfirmationService.updateStatus(_id, dto);

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
}