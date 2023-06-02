import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ValidatorInterceptor } from "src/shared/interceptors/validator.interceptor";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";
import { AirdropUpdateRequestDto } from "../dtos/airdrop-update-request.dto";
import { AirdropService } from "../services/agreement.service";
import { AirdropRegisterValidator } from "../validators/airdrop-register.validator";
import { AirdropUpdateValidator } from "../validators/airdrop-update.validator";

@ApiTags('conveios')
@Controller('convenios')
export class AgreementController {

    private readonly _logger = new Logger(AgreementController.name);

    constructor(
        private _airdropService: AirdropService,
    ) { }

    @Get()
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async get() {

        try {

             const response = await this._airdropService.findAll();

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
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()

    async register(
        @Req() request,
        @Body() dto: AgreementRegisterRequestDto,
    ) {

        try {

            const response = await this._airdropService.register( dto);

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

      @Get('/:id')
    @HttpCode(200)
     @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
   
    async findById(
        @Param('id') id: string
       
    ) {

        try {

            

            const response = await this._airdropService.findById(id);

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

    @Delete('/:id')
    @HttpCode(200)
     @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
   
    async deleteById(
        @Param('id') id: string
       
    ) {

        try {

            

            const response = await this._airdropService.deleteById(id);

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

    @Put('update/:id')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
   
    async update(
        @Param('id') id: string,
        @Body() dto: AgreementRegisterRequestDto,
    ) {

        try {

      

            const response = await this._airdropService.update(id, dto);

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