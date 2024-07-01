/* eslint-disable prettier/prettier */
import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { LoginGuard } from 'src/login.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @UseGuards(LoginGuard) // 应用JWT认证守卫
  @HttpPost('createPost')
  async createPost(
    @Body('userId') userId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post = await this.postService.createPost(userId, title, content);
    return { message: 'Post created successfully', post };
  }

  @Get('getAll')
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('get/:id')
  async getPostsByUserId(@Param('id') userId: number) {
    const posts = await this.postService.getPostsByUserId(userId);
    if (!posts || posts.length === 0) {
      throw new NotFoundException('暂无数据');
    }
    return posts;
  }
}
