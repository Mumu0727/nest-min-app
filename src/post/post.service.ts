/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
// import { UserService } from './../user/user.service';
import { User } from './../user/user.entity';


@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private userService: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(userId: number, title: string, content: string): Promise<Post> {
    const user = await this.userService.findOne({ where: { id: userId }});
    console.log("🚀 ~ PostService ~ createPost ~ user:", user)
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    if (!user.relatedUserId) {
      throw new NotFoundException('需要先关联用户哦！');
    }

    const post = new Post();
    post.title = title;
    post.content = content;
    // post.user = user;
    post.userId = userId;
    post.relatedUserId = user.relatedUserId;

    return this.postRepository.save(post);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const qb = await this.postRepository.createQueryBuilder();
    return qb.where('post.userId = :userId', { userId }).orWhere(`post.relatedUserId = '${userId}'`).getMany();
  }
}
