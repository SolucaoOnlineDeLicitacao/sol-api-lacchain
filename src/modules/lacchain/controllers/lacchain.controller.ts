import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "src/shared/dtos/response.dto";
import { JwtAuthGuard } from "src/shared/guards/jwt-auth.guard";
import { lacchainService } from "../services/lacchain.service";


@ApiTags('lacchain')
@Controller('lacchain')
export class LacchainController {
  constructor(
    private coinGeckoService: lacchainService
  ) {}
  @Get('get-node-lacchain-data/from/:from/to/:to')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getZicoinMarketData(
    @Param('from') from: number,
    @Param('to') to: number,
  ) {
    try {
      const response = await this.coinGeckoService.getZicoinMarketData(from, to);
      return new ResponseDto(true, response, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}