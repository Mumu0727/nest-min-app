import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Photo } from '../../photo/entities/photo.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成

  @Column({ length: 20 })
  username: string;
  @Column({ default: '123456' })
  password: string;
  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
  @CreateDateColumn()
  createDate: Date;
  @UpdateDateColumn()
  updateDate: Date;
}
