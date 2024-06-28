import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { User } from '../user/entities/user.entity';
@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}
  async create(createPhotoDto: CreatePhotoDto) {
    const { userId, url } = createPhotoDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['photos'],
    });

    if (!user) {
      throw new InternalServerErrorException({
        message: '该用户不存在',
      });
    }

    const newPhoto = new Photo();

    newPhoto.url = url;
    newPhoto.user = user;
    return await this.photoRepository.save(newPhoto);
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    // const qb = await this.photoRepository.createQueryBuilder();
    // return await qb.update().set(updatePhotoDto).where({ id }).execute();
    return await this.photoRepository.update(id, updatePhotoDto);
  }

  async findAll() {
    return await this.photoRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    return await this.photoRepository.find({
      where: { id },
      relations: ['user'],
    });
  }
  async remove(id: number) {
    // const qb = await this.photoRepository.createQueryBuilder();
    // return await qb.delete().where({ id }).execute();
    return await this.photoRepository.delete(id);
  }

  async star(id: number) {
    return await this.photoRepository.increment({ id }, 'starNum', 1)
  }
}
