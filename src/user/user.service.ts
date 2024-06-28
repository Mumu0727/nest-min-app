import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Inject(JwtService)
  private jwtService: JwtService;
  private logger = new Logger();
  async login(user: CreateUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!foundUser || foundUser.password !== md5(user.password)) {
      throw new BadRequestException('账号或密码输入错误！');
    }
    return foundUser;
  }

  async register(user: CreateUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new BadRequestException('该用户名已存在！');
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.photos = [];

    try {
      await this.userRepository.save(newUser);
      const token = await this.jwtService.signAsync({
        user: {
          username: newUser.username,
        },
      });
      return {
        code: '1',
        data: { token },
        message: '注册成功！',
      };
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  async create(CreateUserDto: CreateUserDto) {
    return await this.userRepository.save({
      ...CreateUserDto,
      photos: [],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const qb = await this.userRepository.createQueryBuilder();
    return await qb.update().set(updateUserDto).where({ id }).execute();
  }

  async findAll() {
    // 若不设置relations: ['photos']则查出来的user没有photos属性
    return await this.userRepository.find({ relations: ['photos'] });
  }

  async findOne(id: number) {
    // const sql = `select * from user where id = ${id}`;
    // return await this.userRepository.query(sql);
    return await this.userRepository.find({
      where: { id },
      relations: ['photos'],
    });
  }

  async remove(id: number) {
    const qb = await this.userRepository.createQueryBuilder();
    return await qb.delete().where({ id }).execute();
  }
}
