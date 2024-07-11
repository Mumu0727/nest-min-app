/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 17:42:40
 * @LastEditTime: 2024-07-11 11:35:17
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
import { PaginationDto } from '../common/dto/pagination.dto';
import { Pagination } from '../common/decorators/pagination.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Inject(JwtService)
  // private jwtService: JwtService;
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
      // return this.menuService.remove(+id);
      throw new HttpException('小可爱~不要删除菜谱哦', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('query')
  async findAll(
    @Pagination() paginationDto: PaginationDto,
    @Query('id') id: string,
    @Query('category') category: number,
  ) {
    if (id) {
      const data = await this.menuService.findOne(+id);
      if (data.length > 0) {
        return Promise.resolve(data[0]);
      } else {
        throw new HttpException('数据不存在', HttpStatus.BAD_REQUEST);
      }
    }
    if (category) {
      return this.menuService.findByCategory(paginationDto, +category);
    }
    return this.menuService.findAll();
  }
}
