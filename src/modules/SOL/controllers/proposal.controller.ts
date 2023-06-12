import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { GroupService } from "../services/group.service";
import { GroupRegisterDto } from "../dtos/group-register-request.dto";
import { GroupUpdatenameDto } from "../dtos/group-update-name-request.dto";
import { GroupAddItemsRequestDto } from "../dtos/group-add-items-request.dto";
import { ContractService } from "../services/contract.service";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { ProposalService } from "../services/proposal.service";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";

@ApiTags('proposal')
@Controller('proposal')
export class ProposalController {

    private readonly logger = new Logger(ProposalController.name);

    constructor(
        private readonly proposalService: ProposalService,
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async register(
        @Body() dto: ProposalRegisterDto,
    ) {

        try {

            const response = await this.proposalService.register(dto);

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
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async list() {

        try {

            const response = await this.proposalService.list();

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
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async getById(
        @Param('_id') _id: string,
    ) {

        try {

            const response = await this.proposalService.getById(_id);

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

    @Put('status-update/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async updateStatus(
        @Param('_id') _id: string,
        @Body() dto: ProposalStatusUpdateDto,
    ) {

        try {

            const response = await this.proposalService.updateStatus(_id, dto);

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

    @Put('update/add-item/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async addItemById(
        @Param('_id') _id: string,
        @Body() dto: ProposalAddItemUpdateDto,
    ) {

        try {

            const response = await this.proposalService.addItem(_id, dto);

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


    @Put('update/remove-item/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async removeItemById(
        @Param('_id') _id: string,
        @Body() dto: ProposalAddItemUpdateDto,
    ) {

        try {

            const response = await this.proposalService.removeItem(_id, dto);

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
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // @ApiBearerAuth()
    async deleteById(
        @Param('_id') _id: string,
    ) {

        try {

            const result = await this.proposalService.deleteById(_id);

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
