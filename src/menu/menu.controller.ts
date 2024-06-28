/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 17:42:40
 * @LastEditTime: 2024-06-28 20:42:40
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('add')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Post('update')
  update(@Body('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    if (id) {
      return this.menuService.update(+id, updateMenuDto);
    }
    throw new HttpException('更新信息需传ID', HttpStatus.BAD_REQUEST);
  }

  @Post('delete')
  remove(@Body('id') id: string) {
    if (id) {
      return this.menuService.remove(+id);
    }
    throw new HttpException('删除信息需传ID', HttpStatus.BAD_REQUEST);
  }

  @Get('query')
  findAll(@Query('id') id: string) {
    console.log("🚀 ~ MenuController ~ findAll ~ id:", id)
    if (id) {
      return this.menuService.findOne(+id);
    }
    throw new HttpException('查询信息需传ID', HttpStatus.BAD_REQUEST);
  }
}
