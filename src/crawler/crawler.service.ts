import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import cheerio from 'cheerio';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Menu } from './../menu/menu.entity';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private readonly root = 'http://www.xiachufang.com';
  private readonly headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36', // 一点点伪装
  };
  private readonly imageDir = path.join(__dirname, '..', '..', 'imgs');
  private readonly categoryList = [
    {
      name: '其他',
      value: '6',
      id: '40073',
    },
    {
      name: '主食',
      value: '1',
      id: '20132',
    },
    {
      name: '家常菜',
      value: '2',
      id: '40076',
    },
    {
      name: '饮料',
      value: '3',
      id: '20136',
    },
    {
      name: '甜点',
      value: '4',
      id: '20135',
    },
    {
      name: '汤羹',
      value: '5',
      id: '20130',
    },
  ];

  private maxRetries = 3;
  // 慢点爬，会被警告~
  private getRandomDelay() {
    return Math.floor(Math.random() * (10000 - 800 + 1)) + 800;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {
    fs.ensureDirSync(this.imageDir);
  }

  @Cron('40 13 * * *') // 每月一号 凌晨3点跑一下
  async handleCron() {
    this.logger.debug('Running crawler...');
    for (let i = 0; i < this.categoryList.length; i++) {
      const item = this.categoryList[i];
      const detailList = await this.getDetailList(item.id);
      await this.getDetailData(detailList, item);
    }
  }

  /**
   * @description: 进行网络请求并处理错误的函数
   * @return {*}
   * @param {*} url
   * @param {*} retries
   */
  private async fetchWithRetry(url: string, retries = this.maxRetries) {
    try {
      const response = await axios.get(url, {
        headers: this.headers,
      });
      return response;
    } catch (error) {
      if (retries > 0) {
        console.log(
          `请求失败，重试 ${this.maxRetries - retries + 1} 次: ${url}`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 秒后重试
        return this.fetchWithRetry(url, retries - 1);
      } else {
        throw error;
      }
    }
  }

  /**
   * @description: 分类内容
   * @return {*}
   * @param {*} id
   */
  private async getDetailList(id: string) {
    const detailList = [];
    for (let i = 1; i <= 2; i++) {
      const url = `https://www.xiachufang.com/category/${id}/?page=${i}`;
      const response = await this.fetchWithRetry(url);
      const $ = cheerio.load(response.data);
      const links = $(
        'div.category-recipe-list ul.list li div.recipe div.info p.name a',
      )
        .map((_, el) => $(el).attr('href'))
        .get();
      detailList.push(...links);
      console.log(url);

      // 随机延迟
      await this.delay(this.getRandomDelay());
    }
    return detailList;
  }

  /**
   * @description: 详情处理
   * @return {*}
   * @param {*} detailList
   * @param {*} categoryItem
   */
  private async getDetailData(
    detailList: any[],
    categoryItem: { name: any; value: any; id?: string },
  ) {
    // let i = 0;
    for (const detailUrl of detailList) {
      // i++;
      const url = this.root + detailUrl;
      // 检查链接后面是否有参数
      const urlObj = new URL(url);
      if (urlObj.search) {
        console.log(`跳过有参数的链接: ${url}`);
        continue; // 跳过有参数的链接
      }
      const response = await this.fetchWithRetry(url);
      const $ = cheerio.load(response.data);

      const row = {};

      // 获取标题
      row['name'] = $('h1.page-title').text().trim();
      // 设置id
      row['id'] = detailUrl.split('/')[2];
      // 获取配方
      row['ins'] = {};
      $('div.ings tr').each((_, el) => {
        const name = $(el).find('td.name').text().trim();
        const unit = $(el).find('td.unit').text().trim();
        row['ins'][name] = unit;
      });

      // 获取烹饪步骤
      row['steps'] = [];
      $('div.steps ol li').each((j, el) => {
        const text = $(el).find('p.text').text().trim();
        row['steps'].push({ text, menuId: row['id'], step: j });
      });

      // 获取图片链接并下载
      const imgUrl = $('div.cover img').attr('src');
      if (imgUrl) {
        const imgFilename = path.join(this.imageDir, `${row['id']}.jpg`);
        try {
          await this.downloadImage(imgUrl, imgFilename);
          row['imgUrl'] = `${row['id']}.jpg`;
        } catch (error) {
          console.error(`Failed to download image: ${imgUrl}`, error);
        }
      }
      // 只存有标题和详细步骤的内容
      if (row['name'] && row['steps'].length > 0) {
        row['category'] = categoryItem.value;
        row['categoryName'] = categoryItem.name;
        // 入库
        const data = await this.menuRepository.find({
          where: { id: row['id'] },
        });
        if (data.length === 0) {
          await this.menuRepository.save({ ...row });
        } else {
          const qb = await this.menuRepository.createQueryBuilder();
          await qb
            .update()
            .set({ ...row })
            .where({ id: row['id'] })
            .execute();
        }
        console.log(row['name'], url);
      }

      // 随机延迟
      await this.delay(this.getRandomDelay());
      // if (i > 3) {
      //   break;
      // }
    }
  }

  private async downloadImage(url: string, filename: string) {
    const response = await axios({
      url,
      responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filename);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}
