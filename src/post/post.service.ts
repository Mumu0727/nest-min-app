/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
// import { UserService } from './../user/user.service';
import { User } from './../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { format } from 'date-fns-tz';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userService: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userService.findOne({ where: { id: userId }});
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (!user.relatedUserId) {
      throw new HttpException('需要先关联用户哦~', HttpStatus.BAD_REQUEST);
    }
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('(post.userId = :userId OR post.relatedUserId = :userId)', { userId })
      .andWhere('post.releaseDate = :releaseDate', { releaseDate: createPostDto.releaseDate })
      .andWhere('post.menuId = :menuId', {menuId: createPostDto.menuId })
      .getMany();
    if (!posts || posts.length > 0) {
      throw new HttpException(`已经加入心愿单了，不要重复添加哈~`, HttpStatus.BAD_REQUEST);
    }
    return this.postRepository.save({...createPostDto, relatedUserId: user.relatedUserId});
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const qb = await this.postRepository.createQueryBuilder('post');
    const postData = await qb.innerJoinAndSelect('post.menu', 'menu')
    .where('post.userId = :userId', { userId })
    .orWhere(`post.relatedUserId = ${userId}`)
    .getMany();
    const groupedData = postData.reduce((acc, post) => {
      const releaseDate = format(post.releaseDate, 'yyyy-MM-dd', { timeZone: 'Asia/Shanghai' })
      if (!acc[releaseDate]) {
        acc[releaseDate] = {
          releaseDate,
          id: post.id,
          menuId: post.menuId,
          userId: post.userId,
          relatedUserId : post.relatedUserId ,
          menus: [],
        };
      }
      acc[releaseDate].menus.push(post.menu);
      return acc;
    }, {});
    return Object.values(groupedData);
  }
}
