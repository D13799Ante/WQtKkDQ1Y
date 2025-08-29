// 代码生成时间: 2025-08-29 19:44:39
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { CsvController } from './csv.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/'
    }),
  ],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvBatchProcessorModule {}


/**
 * CSV Controller handles HTTP requests related to CSV file processing.
 *
 * @class CsvController
 */
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  /**
   * Process a batch of CSV files.
   *
   * @param {Express.Multer.File} file - The uploaded CSV file.
   */
  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processCsv(@UploadedFile() file: Express.Multer.File): Promise<any> {
    try {
      return await this.csvService.processCsvFile(file);
    } catch (error) {
      // Handle error appropriately
      throw new Error('Failed to process CSV file');
    }
  }
}


/**
 * CSV Service class responsible for performing operations on CSV files.
 *
 * @class CsvService
 */
import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { join } from 'path';

@Injectable()
export class CsvService {
  /**
   * Process a CSV file by reading its contents and performing operations.
   *
   * @param {Express.Multer.File} file - The CSV file to process.
   * @returns {Promise<void>}
   */
  async processCsvFile(file: Express.Multer.File): Promise<any> {
    const readStream = createReadStream(file.path);
    const writeStream = createWriteStream(join(process.cwd(), 'processed', file.originalname));
    const pipelineAsync = promisify(pipeline);
    const parsedData = [];

    await pipelineAsync(
      readStream,
      csv(),
      (data: any) => {
        parsedData.push(data);
      },
    {
      filename: 