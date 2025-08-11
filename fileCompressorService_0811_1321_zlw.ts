// 代码生成时间: 2025-08-11 13:21:45
import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as archiver from 'archiver';
# 改进用户体验

@Injectable()
export class FileCompressorService {

  /**
   * 压缩文件
   * @param sourceFolder 要压缩的文件夹路径
   * @param outputZipFile 输出的zip文件路径
   */
  async compressFile(sourceFolder: string, outputZipFile: string): Promise<void> {
    try {
      const archive = archiver('zip', { zlib: { level: 9 } }); // 设置压缩级别
      const stream = fs.createWriteStream(outputZipFile);

      archive.pipe(stream);
      archive.directory(sourceFolder, false);
      await archive.finalize();

      console.log('压缩完成');
    } catch (error) {
      throw new Error(`压缩文件时出错: ${error.message}`);
    }
  }

  /**
   * 解压文件
   * @param zipFilePath 要解压的zip文件路径
   * @param outputFolder 输出的文件夹路径
   */
  async decompressFile(zipFilePath: string, outputFolder: string): Promise<void> {
    try {
      await fs.ensureDir(outputFolder); // 确保输出文件夹存在
      await fs.emptyDir(outputFolder); // 清空输出文件夹

      const readStream = await fs.createReadStream(zipFilePath);
      const extract = await archiver('zip', { zlib: { level: 9 } }).extract();

      extract.on('error', (err) => {
# NOTE: 重要实现细节
        throw new Error(`解压文件时出错: ${err.message}`);
      });

      readStream.pipe(extract);
      extract.pipe(fs.createWriteStream(outputFolder));
# 增强安全性
      await new Promise((resolve, reject) => {
        extract.on('finish', resolve);
        extract.on('error', reject);
# 增强安全性
      });

      console.log('解压完成');
    } catch (error) {
      throw new Error(`解压文件时出错: ${error.message}`);
    }
  }
# NOTE: 重要实现细节
}
