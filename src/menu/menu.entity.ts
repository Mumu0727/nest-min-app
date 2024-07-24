/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 19:41:59
 * @LastEditTime: 2024-07-03 14:11:07
 * @LastEditors: muqingkun
 * @Reference:
 */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成
  @Column({ length: 45 })
  name: string;
  @Column({ default: null })
  categoryName: string;
  @Column({ default: null })
  category: string;
  @Column({ default: null })
  imgUrl: string;
  @Column({ default: null })
  practices: string;
  @Column({ default: null })
  remark: string;
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @Column('simple-json', { nullable: true })
  steps: { text: string; img: string }[];
  @Column({ nullable: true })
  image: string;
  @Column('simple-json', { nullable: true })
  ins: Record<string, string>;
  @CreateDateColumn()
  createDate: Date;
  @UpdateDateColumn()
  updateDate: Date;
}
