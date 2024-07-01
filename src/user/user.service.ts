/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 20:47:13
 * @LastEditTime: 2024-07-01 20:21:16
 * @LastEditors: muqingkun
 * @Reference:
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
// 用户服务类，提供用户相关的业务逻辑
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建用户，接受用户名和密码，返回创建的用户对象
  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // 对密码进行哈希加密
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user); // 保存用户到数据库
  }

  // 根据用户名查找用户，返回用户对象
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  // 根据ID查找用户，返回用户对象
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  // 更新用户密码，接受用户ID和新密码
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 对新密码进行哈希加密
    await this.userRepository.update(id, { password: hashedPassword }); // 更新用户密码
  }

  async relateUsers(id: number, userName: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    const relatedUser = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (user && relatedUser) {
      if (user.relatedUserId || relatedUser.relatedUserId) {
        throw new BadRequestException(
          '要专一哦，已关联用户不可以再关联其他用户！',
        );
      }
      user.relatedUserId = relatedUser.id;
      relatedUser.relatedUserId = id;
    } else {
      throw new BadRequestException('用户不存在！');
    }
    await this.userRepository.save(relatedUser);
    await this.userRepository.save(user);
  }
}
