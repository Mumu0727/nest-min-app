/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-07-01 20:34:34
 * @LastEditTime: 2024-07-01 20:37:04
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
  @Column()
  relatedUserId: number;
}
