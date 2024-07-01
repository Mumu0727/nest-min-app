/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 20:37:19
 * @LastEditTime: 2024-07-01 20:30:15
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
// 接口异常拦截器
export class HttpFaild implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("🚀 ~ HttpFaild ~ exception:", exception)
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus();
    console.log(status, 'status');

    response.status(status).json({
      success: false,
      time: new Date(),
      msg: exception.message,
      code: status,
      path: request.url,
    });
  }
}
