/* eslint-disable prettier/prettier */
/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-07-01 20:34:34
 * @LastEditTime: 2024-07-03 14:12:17
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
import { Menu } from '../menu/menu.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  menuId: number;
      
  @Column()
  userId: number;
  
  @Column()
  relatedUserId: number;

  @Column()
  content: string;

  @Column()
  releaseDate: Date;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  // @ManyToOne(() => Menu, (menu) => menu.posts)
  // @JoinColumn({ name: 'menuId' })
  menu: Menu;
}
