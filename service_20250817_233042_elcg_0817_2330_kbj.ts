// 代码生成时间: 2025-08-17 23:30:42
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// Using 'fs.promises' for async file system operations
const fsPromises = fs.promises;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

@Injectable()
export class FolderStructureOrganizer {
  constructor() {}

  async organizeDirectory(sourceDir: string, targetDir: string): Promise<void> {
    try {
      // Check if the source directory exists
      const sourceDirExists = await this.directoryExists(sourceDir);
      if (!sourceDirExists) {
        throw new Error(`Source directory does not exist: ${sourceDir}`);
      }

      // Check if the target directory exists, if not create it
      const targetDirExists = await this.directoryExists(targetDir);
      if (!targetDirExists) {
        await fsPromises.mkdir(targetDir, { recursive: true });
      }

      // Read the contents of the source directory
      const items = await readdir(sourceDir, { withFileTypes: true });
      for (const item of items) {
        const itemPath = path.join(sourceDir, item.name);
        if (item.isDirectory()) {
          // Organize subdirectories
          await this.organizeDirectory(itemPath, path.join(targetDir, item.name));
        } else if (item.isFile()) {
          // Organize files
          await this.organizeFile(itemPath, targetDir);
        }
      }
    } catch (error) {
      console.error('An error occurred while organizing the directory structure:', error);
      throw error;
    }
  }

  private async directoryExists(directoryPath: string): Promise<boolean> {
    try {
      await stat(directoryPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async organizeFile(filePath: string, targetDir: string): Promise<void> {
    // Implement file organizing logic here
    // For now, just copy the file to the target directory
    try {
      const readStream = fs.createReadStream(filePath);
      const writeStream = fs.createWriteStream(path.join(targetDir, path.basename(filePath)));
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream)
          .on('finish', resolve)
          .on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error organizing file: ${filePath}. Error: ${error.message}`);
    }
  }
}
