import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { GroupService } from "../services/group.service";
import { GroupRegisterDto } from "../dtos/group-register-request.dto";
import { GroupUpdatenameDto } from "../dtos/group-update-name-request.dto";
import { GroupAddItemsRequestDto } from "../dtos/group-add-items-request.dto";

@ApiTags('group')
@Controller('group')
export class GroupController {

    private readonly logger = new Logger(GroupController.name);

    constructor(
        private readonly groupService: GroupService,
    ) { }

    @Post('register')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async register(
        @Body() dto: GroupRegisterDto,
    ) {

        try {

            const response = await this.groupService.register(dto);

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

            const response = await this.groupService.list();

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

            const response = await this.groupService.getById(_id);

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
    async updateNameById(
        @Param('_id') _id: string,
        @Body() dto: GroupUpdatenameDto,
    ) {

        try {

            const response = await this.groupService.updateName(_id, dto);

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async addItemById(
        @Param('_id') _id: string,
        @Body() dto: GroupAddItemsRequestDto,
    ) {

        try {

            const response = await this.groupService.addItem(_id, dto);

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async removeItemById(
        @Param('_id') _id: string,
        @Body() dto: GroupAddItemsRequestDto,
    ) {

        try {

            const response = await this.groupService.removeItem(_id, dto);

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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async deleteById(
        @Param('_id') _id: string,
    ) {

        try {

            const result = await this.groupService.deleteById(_id);

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
