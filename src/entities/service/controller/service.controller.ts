import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServicesService } from '../service';
import { Response } from 'express';

@Controller('service')
export class ServiceController {
  constructor(private readonly service: ServicesService) {}

  /**
   * Регистрация нового сервиса
   *
   * @param body
   * @param res
   */
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('singIn')
  async singInService(@Body() body: any, @Res() res: Response): Promise<void> {
    const { port, ...mainData } = body;
    if (port) mainData['port'] = port;
    const result = await this.service.addNewService(mainData);

    res.send({ result });
  }
}
