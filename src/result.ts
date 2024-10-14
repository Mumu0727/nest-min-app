/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 20:21:43
 * @LastEditTime: 2024-07-25 13:12:16
 * @LastEditors: muqingkun
 * @Reference:
 */
import { HttpStatus } from '@nestjs/common';

export class ResultData {
  constructor(
    public code = HttpStatus.OK,
    public msg?: string,
    public data?: any,
  ) {
    this.code = code;
    this.msg = msg || '操作成功';
    this.data = data || null;
  }

  static success(data?: any, msg?: string) {
    return new ResultData(HttpStatus.OK, msg, data);
  }

  static fail(code = HttpStatus.BAD_REQUEST, msg?: string, data?: any) {
    return new ResultData(code, msg, data);
  }
}
