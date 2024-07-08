/* eslint-disable prettier/prettier */
import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LoginGuard } from 'src/login.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(LoginGuard) // 应用JWT认证守卫
  @HttpPost('createPost')
  async createPost(
    @Body('userId') userId: number, @Body() createPostDto: CreatePostDto
  ) {
    const post = await this.postService.createPost(userId, createPostDto);
    return { message: 'Post created successfully', post };
  }

  @Get('getAll')
  async getAllPosts() {
    return this.postService.getAllPosts();
  }
  
  @UseGuards(LoginGuard) // 应用JWT认证守卫
  @Get('get/:id')
  async getPostsByUserId(@Param('id') userId: number) {
    const posts = await this.postService.getPostsByUserId(userId);
    if (!posts) {
      throw new HttpException('暂无数据', HttpStatus.BAD_REQUEST);
    }
    return posts;
  }
}
