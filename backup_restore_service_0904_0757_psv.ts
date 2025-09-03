// 代码生成时间: 2025-09-04 07:57:29
 * It uses decorators and dependencies injection to maintain
 * a clean and maintainable code structure.
 */

import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { join } from 'path';
import { existsSync, promises as fs } from 'fs';
import { PassThrough } from 'stream';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BackupRestoreService {
  // The base directory for backups
  private baseDir: string = join(__dirname, '../data/backups/');

  constructor() {
    // Ensure backup directory exists
    if (!existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /*
   * Creates a backup of the specified data and saves it to the backup directory.
   * @param data The data to back up.
   * @returns The path to the backup file.
   */
  async createBackup(data: any): Promise<string> {
    try {
      const backupId = uuidv4();
      const backupPath = join(this.baseDir, `${backupId}.json`);
      await fs.writeFile(backupPath, JSON.stringify(data));
      return backupPath;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  /*
   * Restores data from a backup file.
   * @param backupPath The path to the backup file.
   * @returns The restored data.
   */
  async restoreBackup(backupPath: string): Promise<any> {
    try {
      if (!existsSync(backupPath)) {
        throw new Error('Backup file does not exist.');
      }
      const data = await fs.readFile(backupPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error.message}`);
    }
  }

  /*
   * Streams a backup file for download.
   * @param backupPath The path to the backup file.
   * @returns A stream of the backup file.
   */
  async streamBackup(backupPath: string): Promise<Readable> {
    try {
      if (!existsSync(backupPath)) {
        throw new Error('Backup file does not exist.');
      }
      return fs.createReadStream(backupPath);
    } catch (error) {
      throw new Error(`Failed to stream backup: ${error.message}`);
    }
  }
}
