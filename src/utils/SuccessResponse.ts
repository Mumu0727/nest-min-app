/*
 * @Description: 
 * @Author: muqingkun
 * @Date: 2024-06-28 20:35:03
 * @LastEditTime: 2024-06-28 20:35:15
 * @LastEditors: muqingkun
 * @Reference: 
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Data<T> {
  data: T;
}

@Injectable()
export class SuccessResponse<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data, // data即为 Service层或者Controller层的返回值
          code: 1,
          message: '请求成功',
          success: true,
        };
      }),
    );
  }
}

