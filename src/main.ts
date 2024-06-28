/*
 * @Description: 
 * @Author: muqingkun
 * @Date: 2024-06-28 17:42:40
 * @LastEditTime: 2024-06-28 20:44:20
 * @LastEditors: muqingkun
 * @Reference: 
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SuccessResponse } from './utils/SuccessResponse';
import { HttpFaild } from "./utils/HttpFaild";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule);
  app.useStaticAssets('front');
  app.enableCors();
  app.useGlobalInterceptors(new SuccessResponse())
  app.useGlobalFilters(new HttpFaild())
  await app.listen(8084);
}
bootstrap();
