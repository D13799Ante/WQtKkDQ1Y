// 代码生成时间: 2025-08-08 03:02:29
import { Injectable } from '@nestjs/common';
import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
# NOTE: 重要实现细节
import { join, resolve } from 'path';
# 优化算法效率
import { promisify } from 'util';
# FIXME: 处理边界情况
import glob from 'glob-promise';

// Define a custom error for file not found
class FileNotFoundError extends Error {}

@Injectable()
export class BatchFileRenamerService {
  private readonly defaultRenamePattern = 'file-{index}.ext';
# TODO: 优化性能

  constructor() {} // Dependency injection can be added here if needed

  /**
   * Renames files in a specified directory based on a pattern.
   * @param directoryPath the path to the directory containing files to rename.
   * @param pattern the naming pattern for the new file names.
   * @returns a Promise that resolves to an array of renamed file paths.
   */
  async renameFilesInDirectory(directoryPath: string, pattern: string = this.defaultRenamePattern): Promise<string[]> {
    try {
      // Read all files in the directory
      const files = await this.readFilesInDirectory(directoryPath);

      // Rename files and return the new paths
      return await Promise.all(files.map((file, index) => this.renameFile(file, pattern.replace('{index}', (index + 1).toString()))));
    } catch (error) {
      throw new Error('Failed to rename files: ' + error.message);
    }
# 改进用户体验
  }
# 扩展功能模块

  /**
   * Reads all files in the specified directory.
   * @param directoryPath the path to the directory to read files from.
   * @returns a Promise that resolves to an array of file paths.
   */
# FIXME: 处理边界情况
  private async readFilesInDirectory(directoryPath: string): Promise<string[]> {
    try {
      const files = await glob('**/*', { cwd: directoryPath, nodir: true });
# NOTE: 重要实现细节
      return files.map(file => join(directoryPath, file));
    } catch (error) {
      throw new FileNotFoundError('The specified directory does not exist or files cannot be read.');
# NOTE: 重要实现细节
    }
  }

  /**
   * Renames a single file.
# 优化算法效率
   * @param oldPath the current path of the file.
   * @param newPath the new path for the file.
# NOTE: 重要实现细节
   * @returns a Promise that resolves when the file is renamed.
# 改进用户体验
   */
  private async renameFile(oldPath: string, newPath: string): Promise<string> {
    try {
      await this.ensureDirectoryExists(newPath);
      await promisify(rename)(oldPath, newPath);
# 改进用户体验
      return newPath;
    } catch (error) {
      throw new Error('Failed to rename file: ' + error.message);
    }
  }

  /**
   * Ensures the directory for the new file path exists, creating it if necessary.
   * @param newPath the new path for the file.
   * @returns a Promise that resolves when the directory is ready.
   */
# 增强安全性
  private async ensureDirectoryExists(newPath: string): Promise<void> {
    const directory = resolve(newPath, '..');
    await mkdir(directory, { recursive: true });
  }
}
