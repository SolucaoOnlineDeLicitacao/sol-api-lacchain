import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { SupplierService } from "../services/supplier.service";
import { SupplierRegisterDto } from "../dtos/supplier-register-request.dto";
import { SupplierUpdateStatusDto } from "../dtos/supplier-update-status-request.dto";
import { SupplierGroupIdUpdateDto } from "../dtos/supplier-group-id-update.dto";

@ApiTags('supplier')
@Controller('supplier')
export class SupplierController {

    private readonly logger = new Logger(SupplierController.name);

    constructor(
        private readonly supplierService: SupplierService,
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async register(
  
        @Body() dto: SupplierRegisterDto,
    ) {

        try {


            const response = await this.supplierService.register(dto);

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
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async list() {

        try {

            const response = await this.supplierService.list();

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
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async getById(
        @Param('_id') _id: string,
    ) {

        try {

            const response = await this.supplierService.listById(_id);

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
    async updateById(
        @Param('_id') _id: string,
        @Body() dto: SupplierRegisterDto,
    ) {

        try {

            const response = await this.supplierService.update(_id, dto);

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

    @Put('update-status/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateStatusById(
        @Param('_id') _id: string,
        @Body() dto: SupplierUpdateStatusDto,
    ) {

        try {

            const response = await this.supplierService.updateStatus(_id, dto);

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

    @Put('update-group/:_id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateGroupById(
        @Param('_id') _id: string,
        @Body() dto: SupplierGroupIdUpdateDto,
    ) {

        try {

            const response = await this.supplierService.updateGroup(_id, dto);

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

    // @Put('change-status/:_id')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
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

    @Delete('delete-by-id/:_id')
    @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    async deleteById(
        @Param('_id') _id: string,
    ) {

        try {

            const result = await this.supplierService.deleteById(_id);

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
