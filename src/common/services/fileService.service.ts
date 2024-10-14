/*
 * @Description:
 * @Author: muqingkun
 * @Date: 2024-10-08 18:46:01
 * @LastEditTime: 2024-10-09 10:14:16
 * @LastEditors: muqingkun
 * @Reference:
 */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private imgsFolder = path.join(__dirname, '..', '..', '..', 'imgs'); // imgs 文件夹路径

  async deleteOldFiles(): Promise<void> {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000); // 当前时间20天前

    // 读取 imgs 文件夹中的所有文件
    fs.readdir(this.imgsFolder, (err, files) => {
      if (err) {
        console.error('无法读取文件夹:', err);
        return;
      }

      // 遍历所有文件
      files.forEach((file) => {
        const filePath = path.join(this.imgsFolder, file);

        // 获取文件的状态信息
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`无法获取文件信息: ${filePath}`, err);
            return;
          }

          // 检查文件的创建时间是否超过10天
          const fileCreationTime = new Date(stats.birthtime); // 获取文件的创建时间
          if (fileCreationTime < tenDaysAgo) {
            // 如果文件的创建时间在10天前，删除文件
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`删除文件失败: ${filePath}`, err);
              } else {
                console.log(`已删除文件: ${filePath}`);
              }
            });
          }
        });
      });
    });
  }
}
