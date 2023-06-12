import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { AgreementRegisterRequestDto } from "../dtos/agreement-register-request.dto";

import { AgreementService } from "../services/agreement.service";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { WorkPlanWorkPlanRequestDto } from "../dtos/work-plan-add-work-plan-request.dto";

@ApiTags("conveios")
@Controller("convenios")
export class AgreementController {
  private readonly _logger = new Logger(AgreementController.name);

  constructor(private _airdropService: AgreementService) {}

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  async get() {
    try {
      const response = await this._airdropService.findAll();

      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Post("register")
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async register(@Req() request, @Body() dto: AgreementRegisterRequestDto) {
    try {
      const response = await this._airdropService.register(dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async findById(@Param("id") id: string) {
    try {
      const response = await this._airdropService.findById(id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Delete("/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async deleteById(@Param("id") id: string) {
    try {
      const response = await this._airdropService.deleteById(id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("update/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async update(@Param("id") id: string, @Body() dto: AgreementRegisterRequestDto) {
    try {
      const response = await this._airdropService.update(id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("add-work-plan/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async addWorkPlan(@Param("id") id: string, @Body() dto: WorkPlanWorkPlanRequestDto) {
    try {
      const response = await this._airdropService.addWorkPlan(id, dto.workPlanId);
      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("remove-work-plan/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async removeWorkPlan(@Param("id") id: string, @Body() dto: WorkPlanWorkPlanRequestDto) {
    try {
      const response = await this._airdropService.removeWorkPlan(id, dto.workPlanId);
      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }
}
