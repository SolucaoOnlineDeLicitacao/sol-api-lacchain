import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { UserController } from "./user.controller";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { UserTypeEnum } from "../enums/user-type.enum";
import { BidDateUpdateDto } from "../dtos/bid-date-update.dto";
import { PlataformService } from "../services/plataform.service";

@ApiTags('plataform')
@Controller('plataform')
export class PlataformController {

    private readonly logger = new Logger(UserController.name);

    constructor(
        private readonly plataformService: PlataformService
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador)
    @ApiBearerAuth()
    async register(
        @Body() dto: BidDateUpdateDto,
 
    ) {

        try {

        

            const response = await this.plataformService.register( dto);

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


    @Get('list')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async list() {

        try {

            const response = await this.plataformService.findOne();

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

    

    @Put('update/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador)
    @ApiBearerAuth()
    async updateById(
        @Param('_id') _id: string,
        @Body() dto: BidDateUpdateDto,
    ) {

        try {

            const response = await this.plataformService.update(_id, dto);

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

   
}
