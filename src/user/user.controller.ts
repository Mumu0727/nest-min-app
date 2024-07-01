/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 20:47:13
 * @LastEditTime: 2024-07-01 20:06:40
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

@Controller('user')
// 用户控制器类，处理用户相关的HTTP请求
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册用户，接受用户名和密码，返回创建的用户对象
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.userService.createUser(body.username, body.password);
  }

  // 用户登录，接受用户名和密码，返回登录结果
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.findByUsername(body.username);
    if (user && (await bcrypt.compare(body.password, user.password))) {
      return { message: 'Login successful' };
    } else {
      return { message: 'Invalid credentials' };
    }
  }

  // 更新用户密码，接受用户ID和新密码，返回更新结果
  @Put('password/:id')
  async updatePassword(
    @Param('id') id: number,
    @Body() body: { newPassword: string },
  ) {
    return this.userService.updatePassword(id, body.newPassword);
  }

  // 关联两个用户，接受用户ID和关联用户ID，返回关联结果
  @Put('relate/:id')
  async relateUsers(
    @Param('id') id: number,
    @Body() body: { userName: string },
  ) {
    try {
      await this.userService.relateUsers(id, body.userName);
      return { message: 'Users related successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    return this.userService.relateUsers(id, body.userName);
  }
}
