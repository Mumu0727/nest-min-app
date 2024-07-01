import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 导入TypeORM模块并注册User实体
  providers: [UserService], // 提供UserService
  controllers: [UserController], // 注册UserController
  exports: [UserService], // 导出UserService以供其他模块使用
})
export class UserModule {}
