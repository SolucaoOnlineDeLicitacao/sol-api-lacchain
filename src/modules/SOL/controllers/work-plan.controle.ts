import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { WorkPlanService } from "../services/work-plan.service";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { WorkPlanRegisterRequestDto } from "../dtos/work-plan-register-request.dto";


@ApiTags("workplan")
@Controller("workplan")
export class WorkPlanController {
  private readonly _logger = new Logger(WorkPlanController.name);

  constructor(private _workPlanService: WorkPlanService) {}

  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async list() {
    try {
      const response = await this._workPlanService.findAll();

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Get("/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findById(@Param("id") id: string) {
    try {
      const response = await this._workPlanService.findById(id);

      return new ResponseDto(true, response, null);
    }catch (error) {
      this._logger.error(error.message);
      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Post('register')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async register( @Body() dto: WorkPlanRegisterRequestDto) {
    try {
      const response = await this._workPlanService.register(dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

  @Put('update/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() dto: WorkPlanRegisterRequestDto) {
    try {
      const response = await this._workPlanService.update(id, dto);

      return new ResponseDto(true, response, null);
    } catch (error) {
      this._logger.error(error.message);

      throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
    }
  }

}