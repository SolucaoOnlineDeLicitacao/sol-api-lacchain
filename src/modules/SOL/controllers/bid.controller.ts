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
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { UserController } from "./user.controller";
import { BideRegisterDto } from "../dtos/bid-register-request.dto";
import { BidService } from "../services/bid.service";
import { BidUpdateDto } from "../dtos/bid-update-request.dto";
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
import { BidUpdateStatusRequestDto } from "../dtos/bid-update-status-request.dto";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { UserTypeEnum } from "../enums/user-type.enum";
import { BidAddProposalDto } from "../dtos/bid-add-proposal.dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { BidDateUpdateDto } from "../dtos/bid-date-update.dto";
import { Response } from "express";
const path = require("path");
import * as fs from "fs";

@ApiTags("bid")
@Controller("bid")
export class BidController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly bidsService: BidService) {}

  @Post("register")
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(AnyFilesInterceptor({ limits: { fieldSize: 50 * 1024 * 1024 } }))
  async register(@Req() request, @Body() dto: BideRegisterDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this.bidsService.register(payload.userId, dto, files);

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
      const response = await this.bidsService.list();

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("list-for-supplier")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listForSupplier(@Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this.bidsService.listForSupplier(payload.userId);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("list-for-proposal-supplier")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listForProposalSupplier(@Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this.bidsService.listForProposalSupplier(payload.userId);

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
      const response = await this.bidsService.getById(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("list-allotment-by/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listAllotmentBydBidId(@Param("_id") _id: string) {
    try {
      const response = await this.bidsService.listAllotmentBydBidId(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("list-by-association")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async listBydAssociation(@Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this.bidsService.listByAssociation(payload.userId);

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
  async updateById(@Param("_id") _id: string, @Body() dto: BidUpdateDto) {
    try {
      const response = await this.bidsService.update(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("update-open-date/")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateOpenDate(@Param("_id") _id: string, @Body() dto: BidDateUpdateDto) {
    try {
      const response = await this.bidsService.updateOpenDate(dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("change-status/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async updateStatus(@Param("_id") _id: string, @Body() dto: BidUpdateStatusRequestDto, @Req() request) {
    try {
      const payload: JwtPayload = request.user;

      const response = await this.bidsService.updateStatus(payload.userId, _id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put("add-proposal/:_id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  @ApiBearerAuth()
  async addProposal(@Param("_id") _id: string, @Body() dto: BidAddProposalDto) {
    try {
      const response = await this.bidsService.addProposal(_id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this.logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Delete("delete-by-id/:_id")
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  async deleteById(@Param("_id") _id: string) {
    try {
      const result = await this.bidsService.deleteById(_id);

      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("download/:id/:type")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  // @Funcoes(UserTypeEnum.administrador, UserTypeEnum.associacao)
  async download(@Res() response, @Param("id") id: string, @Param("type") type: string) {
    try {
      const result = await this.bidsService.downloadFile(id, type);

      response.send(result);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("bid-pdf/:id/:type")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @ApiBearerAuth()
  async bidPdf(@Param("id") id: string, @Param("type") type: string) {
    try {
      const result = await this.bidsService.bidPdfDownload(id, type);
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
      await this.bidsService.createDocument(_id, language, type as any);
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
