import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { AllotmentService } from "../services/allotment.service";
import { ItemRequestDto } from "../dtos/item-register-request.dto";
import type { Response } from 'express';
import { AllotUpdateStatusRequestDto } from "../dtos/allotment-update-status-request.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { UserTypeEnum } from "../enums/user-type.enum";

@ApiTags("allotment")
@Controller("allotment")
export class AllotmentController {
  private readonly logger = new Logger(AllotmentController.name);

  constructor(private readonly allotmentService: AllotmentService) { }


  @Get("list")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async list() {
    try {
      const response = await this.allotmentService.list();

      return new ResponseDto(true, response, null)
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }



  @Get("allotment-by-id/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllotById(@Param("_id") _id: string) {
    try {
      const response = await this.allotmentService.listById(_id);
      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

 
  @Put("add-item/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async addItem(@Param("_id") _id: string, @Body() dto: ItemRequestDto) {
    try {
      const response = await this.allotmentService.updateItem(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }



  @Put("update-status/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStatus(@Param("_id") _id: string, @Body() dto: AllotUpdateStatusRequestDto) {
    try {
      const response = await this.allotmentService.updateStatus(_id, dto.status);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("download-file-by-id/:_id")
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  async download(@Param("_id") _id: string) {
    try {
      const response = await this.allotmentService.downloadAllotmentById(_id);
      return response;
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }
}
