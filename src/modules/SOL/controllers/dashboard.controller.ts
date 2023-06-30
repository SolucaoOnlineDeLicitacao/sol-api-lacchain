import { Controller, Get, HttpCode, HttpException, HttpStatus, UseGuards, Logger } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FuncoesGuard } from "src/shared/guards/funcoes.guard";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { UserTypeEnum } from "../enums/user-type.enum";
import { Funcoes } from "src/shared/decorators/function.decorator";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { DashboardService } from "../services/dashboard.service";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
    private readonly _logger = new Logger(DashboardController.name);

    constructor(private _dashboardService: DashboardService) { }

    @Get()
    @HttpCode(200)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, FuncoesGuard)
    @Funcoes(UserTypeEnum.administrador)
    async get() {
        try {
            const response = await this._dashboardService.getData();

            return new ResponseDto(true, response, null);
        } catch (error) {
            throw new HttpException(new ResponseDto(false, null, [error.message]), HttpStatus.BAD_REQUEST);
        }
    }
}