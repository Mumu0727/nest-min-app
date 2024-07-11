/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 19:41:59
 * @LastEditTime: 2024-07-11 11:30:54
 * @LastEditors: muqingkun
 * @Reference:
 */
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginationResults } from '../common/interfaces/pagination-results.interface';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private readonly paginationService: PaginationService,
  ) {}

  @Inject(JwtService)
  // private jwtService: JwtService;
  // private logger = new Logger();
  async create(createMenuDto: CreateMenuDto) {
    return await this.menuRepository.save({
      ...createMenuDto,
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
  async findByCategory(
    paginationDto: PaginationDto,
    category: number,
  ): Promise<PaginationResults<Menu>> {
    return this.paginationService.paginate<Menu>(
      this.menuRepository,
      paginationDto,
      (qb) => {
        if (category) {
          qb.where('menu.category = :category', { category });
        }
      },
    );
  }

  async remove(id: number) {
    const qb = await this.menuRepository.createQueryBuilder();
    return await qb.delete().where({ id }).execute();
  }
}
