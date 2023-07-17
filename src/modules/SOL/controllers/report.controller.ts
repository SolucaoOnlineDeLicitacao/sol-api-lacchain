import { Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Res, UseGuards, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { ReportService } from "../services/report.service";
import { Response } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';
import { JwtPayload } from "src/shared/interfaces/jwt-payload.interface";
@ApiTags("report")
@Controller("report")
export class ReportController {
  private readonly _logger = new Logger(ReportController.name);

  constructor(private _reportService: ReportService) { }

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador)
  async get() {
    try {
      const response = await this._reportService.getDataContract();

      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get('report-generated')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador)
  async getReportGenerated() {
    try {
      const response = await this._reportService.getReportGenerated();

      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get('download-data/:type')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador)
  async generateExcel(
    @Res() res: Response,
    @Param('type') type: string,
    @Req() request,
  ): Promise<void> {
    try {

      const payload: JwtPayload = request.user;

      const filePath = await this._reportService.getSpreadsheet(type, payload.userId);
      const absolutePath = path.resolve(filePath);

      res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
      res.sendFile(absolutePath, {}, (err) => {
        if (err) {
          throw err;
        }

        fs.unlinkSync(filePath); // Remover o arquivo após o envio
      });
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('download-report/:_id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(UserTypeEnum.administrador)
  async donwloadArchive(
    @Param('_id') _id: string
  ) {
    try {
      const response = await this._reportService.downloadReportGeneratedById(_id);

      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

}