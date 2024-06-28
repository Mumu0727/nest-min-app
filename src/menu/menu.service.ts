/*
 * @Description: 
 * @Author: muqingkun
 * @Date: 2024-06-28 19:41:59
 * @LastEditTime: 2024-06-28 20:45:25
 * @LastEditors: muqingkun
 * @Reference: 
 */
import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import * as crypto from 'crypto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  @Inject(JwtService)
  private jwtService: JwtService;
  private logger = new Logger();


  async create(CreateMenuDto: CreateMenuDto) {
    return await this.menuRepository.save({
      ...CreateMenuDto
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const qb = await this.menuRepository.createQueryBuilder();
    return await qb.update().set(updateMenuDto).where({ id }).execute();
  }

  async findAll() {
    return await this.menuRepository.find();
  }

  async findOne(id: number) {
    return await this.menuRepository.find({
      where: { id },
    });
  }

  async remove(id: number) {
    const qb = await this.menuRepository.createQueryBuilder();
    return await qb.delete().where({ id }).execute();
  }
}
