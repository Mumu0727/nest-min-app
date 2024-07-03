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
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
  };
  private readonly imageDir = path.join(__dirname, '..', '..', 'imgs');
  private readonly categoryList = [
    {
      name: '主食',
      value: 1,
      id: '20132',
    },
    {
      name: '家常菜',
      value: 2,
      id: '40076',
    },
    {
      name: '饮料',
      value: 3,
      id: '20136',
    },
    {
      name: '甜点',
      value: 4,
      id: '20135',
    },
    {
      name: '汤羹',
      value: 5,
      id: '20130',
    },
  ];

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

  @Cron('00 18 * * *')
  async handleCron() {
    this.logger.debug('Running crawler...');
    console.log('====categoryList===', this.categoryList);
    for (let i = 0; i < this.categoryList.length; i++) {
      const item = this.categoryList[i];
      const detailList = await this.getDetailList(item.id);
      const data = await this.getDetailData(detailList);
      for (const menu of data) {
        menu.category = item.value;
        menu.categoryName = item.name;
        const data = await this.menuRepository.find({
          where: { id: menu.id },
        });
        if (data.length === 0 && menu.name) {
          await this.menuRepository.save({ ...menu });
        }
        // console.log('🚀 ~ CrawlerService ~ handleCron ~ menu:', menu);
      }
      this.logger.debug('Data saved to database');
    }
  }

  private async getDetailList(id) {
    const detailList = [];
    for (let i = 1; i <= 2; i++) {
      const url = `https://www.xiachufang.com/category/${id}/?page=${i}`;
      const response = await axios.get(url, { headers: this.headers });
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

  private async getDetailData(detailList) {
    const data = [];
    // let i = 0;
    for (const detailUrl of detailList) {
      // i++;
      const url = this.root + detailUrl;
      const response = await axios.get(url, { headers: this.headers });
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
      // 检查链接后面是否有参数
      const urlObj = new URL(url);
      if (row['name'] && row['steps'] && !urlObj.search) {
        data.push(row);
        console.log(row['name'], url);
      }

      // 随机延迟
      await this.delay(this.getRandomDelay());
      // if (i > 3) {
      //   break;
      // }
    }
    return data;
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
