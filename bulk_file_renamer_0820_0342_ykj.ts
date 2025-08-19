// 代码生成时间: 2025-08-20 03:42:28
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { isEmpty } from 'lodash';

// Promisify fs.rename function for better error handling
const rename = promisify(fs.rename);

@Injectable()
export class BulkFileRenamerService {

  constructor() {}

  /**
# TODO: 优化性能
   * Renames multiple files in a directory based on a naming pattern.
   *
   * @param directoryPath The path to the directory containing the files.
   * @param namingPattern The naming pattern to use for renaming files.
   * @param startIndex The starting index for the naming pattern.
# 优化算法效率
   * @returns A promise that resolves when all files are renamed.
   */
  async renameFiles(
    directoryPath: string,
    namingPattern: string,
    startIndex: number
# FIXME: 处理边界情况
  ): Promise<void> {
# TODO: 优化性能
    // Check if the directory path is empty
    if (isEmpty(directoryPath)) {
      throw new Error('Directory path cannot be empty.');
# 添加错误处理
    }

    // Check if the naming pattern is empty
    if (isEmpty(namingPattern)) {
      throw new Error('Naming pattern cannot be empty.');
    }

    // Read the directory contents
    const files = await promisify(fs.readdir)(directoryPath);
    for (const file of files) {
      // Check if the file is a regular file (not a directory)
      const filePath = path.join(directoryPath, file);
      const fileStat = await promisify(fs.stat)(filePath);
# 增强安全性
      if (!fileStat.isFile()) {
        continue;
      }

      // Generate the new file name based on the naming pattern and current index
      const index = startIndex++;
# 添加错误处理
      const newFileName = `${namingPattern.replace('$index', index.toString())}${path.extname(file)}`;
      const newFilePath = path.join(directoryPath, newFileName);

      // Rename the file
# 添加错误处理
      try {
# TODO: 优化性能
        await rename(filePath, newFilePath);
        console.log(`Renamed file from ${filePath} to ${newFilePath}`);
      } catch (error) {
        // Handle the error by logging it and possibly rethrowing
        console.error(`Error renaming file from ${filePath} to ${newFilePath}: ${error.message}`);
        throw error;
      }
    }
  }
}
