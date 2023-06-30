import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EndPointsService } from "../services/endpoints.service";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { EndPointsRegisterRequestDto } from "../dtos/endpoints-register-request.dto";
import { EndPointsTypeEnum } from "../enums/endpoints-type.enum";


@ApiTags("endpoints")
@Controller("endpoints")
export class EndPointsController {
  private readonly _logger = new Logger(EndPointsController.name);

  constructor(private _endPointsService: EndPointsService) { }

  @Get('list')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async list() {
    try {
      const response = await this._endPointsService.listEndpoints();

      return response;
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('get-by-id/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getById(@Param('id') id: string) {
    try{
      const response = await this._endPointsService.getEndpointById(id);

      return response;
    }
    catch(error){
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('create')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() body: EndPointsRegisterRequestDto) {
    try{
      const response = await this._endPointsService.createEndpoint(body);

      return response;
    }
    catch(error){
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('force-job/:type')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async jobTest(@Param('type') type: string) {
    try{
      const response = await this._endPointsService.dynamicJob(EndPointsTypeEnum[type]);
      return response;
    }
    catch(error){
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Put('update/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() body: EndPointsRegisterRequestDto) {
    try{
      const response = await this._endPointsService.updateEndpoint(id, body);

      return response;
    }
    catch(error){
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    try{
      const response = await this._endPointsService.deleteEndpointById(id);

      return response;
    }
    catch(error){
      this._logger.error(error.message);

      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST
      );
    }
  }


}