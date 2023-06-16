import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { ModelContractRegisterDto } from "../dtos/model-contract-register-request.dto";
import { ModelContractService } from "../services/model-contract.service";
import { ModelContractUpdateDto } from "../dtos/model-contract-update-request.dto";
import { ModelContractStatusEnum } from "../enums/model-contract-status.enum";
import { BidService } from "../services/bid.service";

@ApiTags('model-contract')
@Controller('model-contract')
export class ModelContractController {

    private readonly logger = new Logger(ModelContractController.name);

    constructor(
        private readonly modelContractService: ModelContractService,
        private readonly bidsService: BidService,
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async register(
        @Body() dto: ModelContractRegisterDto,
    ) {

        try {
          
            dto.status = ModelContractStatusEnum.ativo;
            const response = await this.modelContractService.register(dto);

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

            const response = await this.modelContractService.list();

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

            const response = await this.modelContractService.getById(_id);

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateStatus(
        @Param('_id') _id: string,
        @Body() dto: ModelContractUpdateDto,
    ) {

        try {
         
            dto.status = ModelContractStatusEnum.ativo;
           
            const response = await this.modelContractService.update(_id, dto);

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


    @Delete('delete-by-id/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async deleteById(
        @Param('_id') _id: string,
    ) {

        try {

            const result = await this.modelContractService.deleteById(_id);

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
