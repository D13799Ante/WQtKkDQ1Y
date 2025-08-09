// 代码生成时间: 2025-08-10 04:31:22
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BackupSyncService {
  /**
   * Backup files from a source directory to a destination directory.
   *
   * @param sourceDir the source directory path
   * @param destDir the destination directory path
   *
   * @returns void
# 优化算法效率
   */
  backupFiles(sourceDir: string, destDir: string): void {
    if (!existsSync(sourceDir)) {
# 增强安全性
      throw new Error(`Source directory ${sourceDir} does not exist`);
# 优化算法效率
    }

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const files = this.listFiles(sourceDir);
    files.forEach(file => {
      const sourceFilePath = join(sourceDir, file);
      const destFilePath = join(destDir, file);
# TODO: 优化性能
      writeFileSync(destFilePath, readFileSync(sourceFilePath));
    });
# 扩展功能模块
  }

  /**
   * Synchronize files between a source and destination directory.
   * This function ensures that the destination directory has the same files as the source directory.
   *
   * @param sourceDir the source directory path
   * @param destDir the destination directory path
   *
   * @returns void
   */
  syncFiles(sourceDir: string, destDir: string): void {
    if (!existsSync(sourceDir)) {
      throw new Error(`Source directory ${sourceDir} does not exist`);
    }
# 增强安全性

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const sourceFiles = this.listFiles(sourceDir);
    const destFiles = this.listFiles(destDir);
# TODO: 优化性能

    // Remove files that are not in the source directory
# 改进用户体验
    destFiles.forEach(file => {
      if (!sourceFiles.includes(file)) {
        const filePath = join(destDir, file);
        try {
# TODO: 优化性能
          // Attempt to remove the file
          writeFileSync(filePath,'') // empty file to remove
          writeFileSync(join(destDir,'.trash','file'), readFileSync(filePath)) // move to trash
        } catch (e) {
          console.error(`Error removing file ${filePath}: ${e.message}`);
        }
      }
    });
# TODO: 优化性能

    // Copy new or updated files from source to destination
    sourceFiles.forEach(file => {
# 优化算法效率
      const sourceFilePath = join(sourceDir, file);
      const destFilePath = join(destDir, file);
      if (!existsSync(destFilePath) || readFileSync(sourceFilePath) !== readFileSync(destFilePath)) {
        writeFileSync(destFilePath, readFileSync(sourceFilePath));
      }
    });
  }

  /**
# 扩展功能模块
   * List all files in a directory.
   *
   * @param dir the directory path
   *
   * @returns an array of file names
   */
  private listFiles(dir: string): string[] {
    return readFileSync(dir, 'utf8')
      .split('
')
      .filter((file): file is string => Boolean(file));
  }
}
