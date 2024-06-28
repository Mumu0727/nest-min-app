/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 17:42:40
 * @LastEditTime: 2024-06-28 17:50:35
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Controller,
  Post,
  Body,
  Res,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  async login(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          username: foundUser.username,
        },
      });
      return {
        code: '1',
        data: { token },
        message: '登录成功！',
      };
    } else {
      return {
        code: '0',
        message: '登录失败！',
      };
    }
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.userService.register(user);
  }

  @Post('add')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('update')
  update(@Body('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (id) {
      return this.userService.update(+id, updateUserDto);
    }
    throw new InternalServerErrorException({
      message: '更新用户信息需传用户ID',
    });
  }

  @Post('delete')
  remove(@Body('id') id: string) {
    if (id) {
      return this.userService.remove(+id);
    }
    throw new InternalServerErrorException({
      message: '删除用户信息需传用户ID',
    });
  }

  @Post('query')
  findAll(@Body('id') id: string) {
    if (id) {
      return this.userService.findOne(+id);
    }
    return this.userService.findAll();
  }
}
