/* eslint-disable prettier/prettier */
import {
  Controller,
  Post as HttpPost,
  Get,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { LoginGuard } from 'src/login.guard';

@Controller('posts')
@UseGuards(LoginGuard) // 应用JWT认证守卫
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost('createPost')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req
  ) {
    const { userId } = req.user;
    const post = await this.postService.createPost(userId, createPostDto);
    return { message: 'Post created successfully', post };
  }
  
  // @UseGuards(LoginGuard) // 应用JWT认证守卫
  // @Get('getAll')
  // async getAllPosts() {
  //   return this.postService.getAllPosts();
  // }
  
  @Get('get')
  async getPostsByUserId(@Request() req,) {
    const {userId} = req.user;
    const posts = await this.postService.getPostsByUserId(userId);
    if (!posts) {
      throw new HttpException('暂无数据', HttpStatus.BAD_REQUEST);
    }
    return posts;
  }
}
