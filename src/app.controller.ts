import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response): any {
    res.sendFile(path.join(__dirname, '../front/index.html'));
    // return this.appService.getHello();
  }
}
