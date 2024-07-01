import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserService } from './../user/user.service';
import { User } from './../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])], // 导入TypeORM模块并注册Post实体
  providers: [PostService, UserService], // 提供PostService
  controllers: [PostController], // 注册PostController
  exports: [PostService], // 导出PostService
})
export class PostModule {}
