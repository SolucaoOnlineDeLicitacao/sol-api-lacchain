import { Body, Controller, Delete, Get, HttpCode, HttpException, Req, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { ProposalService } from "../services/proposal.service";
import { ProposalRegisterDto } from "../dtos/proposal-register-request.dto";
import { ProposalAddItemUpdateDto } from "../dtos/proposal-addItem-update.dto";
import { ProposalStatusUpdateDto } from "../dtos/proposal-status-update-request.dto";
import { ProposalSupplierAcceptUpdateDto } from "../dtos/proposal-accept-supplier-updatet.dto";
import { ProposalAssociationAcceptUpdateDto } from "../dtos/proposal-accept-association-updatet.dto";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { ProposalRefusedRequestDto } from "../dtos/proposal-refused-request.dto";
import { ProposalNotificationInterface } from "../interfaces/proposal-notification-dto";
import { ProposalUpdateValues } from "../dtos/proposal-update-values-request.dto";
import { BidService } from "../services/bid.service";

@ApiTags('proposal')
@Controller('proposal')
export class ProposalController {

    private readonly logger = new Logger(ProposalController.name);

    constructor(
        private readonly proposalService: ProposalService,
        private readonly bidService: BidService,
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.fornecedor)
    @ApiBearerAuth()
    async register(
        @Body() dto: ProposalRegisterDto,
        @Req() request,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this.proposalService.register(payload.userId, dto);

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
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
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
    @UseGuards(JwtAuthGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
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

    @Get('list-proposal-in-bid/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.fornecedor, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async listProposalByBid(
        @Param('_id') _id: string,
    ) {

        try {

            const response = await this.proposalService.listByBid(_id);

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

    @Get('get-proposal-accepted-bid/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.fornecedor)
    @ApiBearerAuth()
    async getProposalAcceptedBid(
        @Param('_id') _id: string,
    ) {

        try {

            let response = await this.proposalService.getProposalAcceptByBid(_id);

            if (!response) {
                response = null
            }

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

    @Get('verify-proposal-by-user/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async verifyProposalByUser(
        @Req() request,
        @Param('_id') _id: string,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this.proposalService.getByUserInBid(payload.userId, _id);

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

    @Put('update-accept-supplier/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.fornecedor)
    @ApiBearerAuth()
    async updateAcceptfromSupplier(
        @Param('_id') _id: string,
        @Body() dto: ProposalSupplierAcceptUpdateDto,
    ) {

        try {

            const response = await this.proposalService.updateAcceptfromSupplier(_id, dto);

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

    @Put('update-accept-association/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async updateAcceptfromAssosiation(
        @Param('_id') _id: string,
        @Body() dto: ProposalAssociationAcceptUpdateDto,
    ) {

        try {

            const response = await this.proposalService.updateAcceptAssociation(_id, dto);

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
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
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

    @Put('refuse/:_id')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async refused(
        @Body() dto: ProposalRefusedRequestDto,
        @Param('_id') _id: string,
        @Req() request,
    ) {

        try {

            const payload: JwtPayload = request.user;

            const response = await this.proposalService.refusedProposal(_id, payload.userId, dto);

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

    @Put('accept/:_id')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    @ApiBearerAuth()
    async accept(
        @Body() dto: ProposalNotificationInterface,
        @Param('_id') _id: string,
        @Req() request,
    ) {
        try {
            const payload: JwtPayload = request.user;

            const response = await this.proposalService.acceptProposal(_id, payload.userId, dto);

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

    @Put('update-values/:id')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @ApiBearerAuth()
    async updateValues(@Param('id') _id: string, @Body() dto: ProposalUpdateValues) {
        try {
            const response = await this.proposalService.updateValues(_id, dto);

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

    @Post('send-tie-breaker/:id')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async sendTieBreaker(@Param('id') _id: string) {
        try {
            const response = await this.bidService.sendTieBreaker(_id);

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
