/*
 * @Description: 
 * @Author: muqingkun
 * @Date: 2024-06-28 19:41:59
 * @LastEditTime: 2024-06-28 19:46:38
 * @LastEditors: muqingkun
 * @Reference: 
 */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成
  @Column({ length: 45 })
  name: string;
  @Column({ default: null })
  categoryName: string;
  @Column({ default: null })
  category: number;
  @Column({ default: null })
  imgUrl: string;
  @Column({ default: null })
  practices: string;
  @Column({ default: null })
  remark: string;
  @CreateDateColumn()
  createDate: Date;
  @UpdateDateColumn()
  updateDate: Date;
}
