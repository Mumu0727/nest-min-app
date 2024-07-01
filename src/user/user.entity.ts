/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 20:47:13
 * @LastEditTime: 2024-07-01 20:52:26
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '../post/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToOne(() => User, { nullable: true })
  @Column({ nullable: true })
  relatedUserId: number; // 新增关联用户ID字段
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
