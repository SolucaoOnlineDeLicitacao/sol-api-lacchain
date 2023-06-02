import {
  BadRequestException, Controller, Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, UseGuards
} from '@nestjs/common';
import { Put, Req } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ResponseDto } from '../../../shared/dtos/response.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { TutorialLocationEnum } from '../enums/tutorial-location.enum';
import { TutorialService } from '../services/tutorial.service';

@ApiTags('translate')
@Controller('translate')
export class TutorialController {
  constructor(private readonly _tutorialService: TutorialService) { }

  @Get('select/:translate')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'screenLocation',
    allowEmptyValue: false,
    enum: TutorialLocationEnum,
    required: true
  })
  async getByScreenLocation(
    @Param('screenLocation') screenLocation: TutorialLocationEnum,
    @Req() request: any,
  ) {
    try {

      if (!Object.keys(TutorialLocationEnum).includes(screenLocation)) {
        throw new BadRequestException('Screen location not reconized.');
      }
      let result = await this._tutorialService.getByScreenLocationWithUserId(screenLocation);

      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('add-translate/translate-id/:id')
  @HttpCode(201)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async addCompletion(
    @Req() request: any,
    @Param('id') id: string
  ) {
    try {
      const payload: JwtPayload = request.user;
      const result = await this._tutorialService.addCompletion(id, payload.userId);
      return new ResponseDto(true, result, null);
    } catch (error) {
      throw new HttpException(
        new ResponseDto(false, null, [error.message]),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}
