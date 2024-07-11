/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-06-28 17:42:40
 * @LastEditTime: 2024-07-11 11:21:34
 * @LastEditors: muqingkun
 * @Reference:
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { PostModule } from './post/post.module';
import { CrawlerService } from './crawler/crawler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from './menu/menu.entity';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'MuMu5217426',
      database: 'min-app',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true, // 自动同步模式（开发用）
      charset: 'utf8mb4', // 设置字符集为 utf8mb4
      timezone: '+08:00', // 设置时区为北京时间
    }),
    TypeOrmModule.forFeature([Menu]),
    JwtModule.register({
      global: true,
      secret: 'syb-secret',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    UserModule,
    MenuModule,
    PostModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, CrawlerService],
})
export class AppModule {}
