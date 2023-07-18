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
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { ContractService } from "../services/contract.service";
import { ContractRegisterDto } from "../dtos/contract-register-request.dto";
import { ContractUpdateDto } from "../dtos/contract-update-request.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { ContractUpdateStatusItemDto } from "../dtos/contract-update-status-item-request.dto";
import { Response } from "express";
const path = require("path");
import * as fs from "fs";

@ApiTags("contract")
@Controller("contract")
export class ContractController {
  private readonly logger = new Logger(ContractController.name);

  constructor(private readonly contractService: ContractService) {}

  @Post("register")
  @HttpCode(201)
  // @UseGuards(JwtAuthGuard, FuncoesGuard)
  // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  // @ApiBearerAuth()
  async register(@Body() dto: ContractRegisterDto) {
    try {
      const response = await this.contractService.register(dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("list")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async list() {
    try {
      const response = await this.contractService.list();

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("get-by-id/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getById(@Param("_id") _id: string) {
    try {
      const response = await this.contractService.getById(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("get-by-bid/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getByBidId(@Param("_id") _id: string) {
    try {
      const response = await this.contractService.listByBidId(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("update/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStatus(@Param("_id") _id: string, @Body() dto: ContractUpdateDto) {
    try {
      const response = await this.contractService.updateStatus(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("update-itens/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStatusItens(@Param("_id") _id: string, @Body() dto: ContractUpdateStatusItemDto) {
    try {
      const response = await this.contractService.updateStatusItens(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("sing-association/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async signAssociation(@Param("_id") _id: string, @Body() dto: ContractUpdateDto) {
    try {
      const response = await this.contractService.signAssociation(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("contract-pdf/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao, UserTypeEnum.fornecedor)
  @ApiBearerAuth()
  async contractPdf(@Param("_id") _id: string) {
    try {
      const response = await this.contractService.contractPdfDownload(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("sing-supplier/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.fornecedor)
  @ApiBearerAuth()
  async signSupplier(@Param("_id") _id: string, @Body() dto: ContractUpdateDto) {
    try {
      const response = await this.contractService.signSupplier(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Delete("delete-by-id/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async deleteById(@Param("_id") _id: string) {
    try {
      const result = await this.contractService.deleteById(_id);

      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("create-document/:_id/:language/:type")
  @HttpCode(200)
  async createDocument(
    @Param("_id") _id: string,
    @Param("language") language: string,
    @Param("type") type: string,
    @Res() res: Response
  ) {
    try {
      await this.contractService.createDocument(_id, language, type as any);
      res.sendFile(path.resolve("src/shared/documents", "output.pdf"), {}, (err) => {
        if (err) {
          throw new HttpException(new ResponseDto(false, null, [err.message]), HttpStatus.BAD_REQUEST);
        }
        fs.unlinkSync(path.resolve("src/shared/documents", "output.pdf"));
      });

    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }
}
