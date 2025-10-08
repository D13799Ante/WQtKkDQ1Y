// 代码生成时间: 2025-10-09 01:51:20
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * 文件完整性校验器服务
 * 提供文件完整性校验功能
 */
@Injectable()
export class FileIntegrityCheckerService {

  constructor() {} // 构造函数可以用于依赖注入等操作

  /**
   * 计算文件的SHA256哈希值
   * @param filePath 文件路径
   * @returns Promise<string> 文件的SHA256哈希值
   */
  async calculateSha256(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      try {
        const stream = require('fs').createReadStream(filePath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', (error) => reject(error));
        stream.on('end', () => resolve(hash.digest('hex')));
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 校验文件的完整性
   * @param filePath 文件路径
   * @param expectedHash 预期的文件哈希值
   * @returns Promise<boolean> 文件是否完整
   */
  async verifyFileIntegrity(filePath: string, expectedHash: string): Promise<boolean> {
    try {
      const actualHash = await this.calculateSha256(filePath);
      return actualHash === expectedHash;
    } catch (error) {
      // 错误处理，记录日志等
      console.error('Error verifying file integrity:', error);
      throw error;
    }
  }
}
