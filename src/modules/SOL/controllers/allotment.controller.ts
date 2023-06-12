import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { AssociationRegisterRequestDto } from "../dtos/association-register-request.dto";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { UserController } from "./user.controller";
import { AssociationService } from "../services/association.service";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidService } from "../services/bid.service";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { UserTypeEnum } from "../enums/user-type.enum";
import { BidAddProposalDto } from "../dtos/bid-add-proposal.dto";
import { AllotmentService } from "../services/allotment.service";
import { AllotAddProposalDto } from "../dtos/allotment-add-proposal-request.dto";
import { ItemRequestDto } from "../dtos/item-register-request.dto";

@ApiTags('allotment')
@Controller('allotment')
export class AllotmentController {

    private readonly logger = new Logger(AllotmentController.name);

    constructor(
        private readonly allotmentService: AllotmentService,
    ) { }

    @Post('register')
    @HttpCode(201)
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // @ApiBearerAuth()
    // async register(
    //     @Req() request,
    //     @Body() dto: BideRegisterDto,
    // ) {

    //     try {

    //       //  console.log(dto);

    //         const payload: JwtPayload = request.user;

    //         // const response = await this.bidsService.register(payload.userId, dto);
    //         const response = await this.bidsService.register('', dto);
    //         return new ResponseDto(
    //             true,
    //             response,
    //             null,
    //         );


    //     } catch (error) {
    //         this.logger.error(error.message);

    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }


    @Get('list')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async list() {

        try {

            const response = await this.allotmentService.list();

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

    // @Get('get-by-id/:_id')
    // @HttpCode(200)
    // // @UseGuards(JwtAuthGuard)
    // // @ApiBearerAuth()
    // async getById(
    //     @Param('_id') _id: string,
    // ) {

    //     try {

    //         const response = await this.bidsService.getById(_id);

    //         return new ResponseDto(
    //             true,
    //             response,
    //             null,
    //         );


    //     } catch (error) {
    //         this.logger.error(error.message);

    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }

    @Get('allotment-by-id/:_id')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async getAllotById(
        @Param('_id') _id: string,
    ) {

        try {

            const response = await this.allotmentService.listById(_id);

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




    // @Put('update/:_id')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // async updateById(
    //     @Param('_id') _id: string,
    //     @Body() dto: BidUpdateDto,
    // ) {

    //     try {

    //         const response = await this.bidsService.update(_id, dto);

    //         return new ResponseDto(
    //             true,
    //             response,
    //             null,
    //         );


    //     } catch (error) {
    //         this.logger.error(error.message);

    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }

    // @Put('change-status/:_id')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // @ApiBearerAuth()
    // async updateStatus(
    //     @Param('_id') _id: string,
    //     @Body() dto: BidUpdateStatusRequestDto,
    //     @Req() request,
    // ) {

    //     try {

    //         const payload: JwtPayload = request.user;

    //         const response = await this.bidsService.updateStatus(payload.userId, _id, dto);

    //         return new ResponseDto(
    //             true,
    //             response,
    //             null,
    //         );


    //     } catch (error) {
    //         this.logger.error(error.message);

    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }

    // bid 64827a8253480daf287b7915

    @Put('add-proposal/:_id')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // @ApiBearerAuth()
    async addProposal(
        @Param('_id') _id: string,
        @Body() dto: AllotAddProposalDto,
    ) {

        try {

   

            const response = await this.allotmentService.updateProposal(_id, dto);

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

    @Put('add-item/:_id')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // @ApiBearerAuth()
    async addItem(
        @Param('_id') _id: string,
        @Body() dto: ItemRequestDto,
    ) {

        try {

   

            const response = await this.allotmentService.updateItem(_id, dto);

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


    // @Delete('delete-by-id/:_id')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard, FuncoesGuard)
    // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
    // async deleteById(
    //     @Param('_id') _id: string,
    // ) {

    //     try {

    //         const result = await this.bidsService.deleteById(_id);

    //         return new ResponseDto(
    //             true,
    //             result,
    //             null,
    //         );

    //     } catch (error) {
    //         throw new HttpException(
    //             new ResponseDto(false, null, [error.message]),
    //             HttpStatus.BAD_REQUEST,
    //         );
    //     }
    // }


}
