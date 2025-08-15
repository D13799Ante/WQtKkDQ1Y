// 代码生成时间: 2025-08-16 00:23:44
import { Module, Global } from '@nestjs/common';
import { CsvBatchProcessorService } from './csvBatchProcessor.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

// CsvBatchProcessorModule is responsible for handling CSV files and processing them in batches.
@Global() // Making it a global module to avoid multiple instances
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuid() + '-' + Date.now();
          const fileExtension = extname(file.originalname);
          cb(null, uniqueSuffix + fileExtension);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv') {
          cb(null, true);
        } else {
          cb(new Error('Not a CSV file'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 10 }, // 10MB file size limit
    }),
  ],
  providers: [CsvBatchProcessorService],
  exports: [CsvBatchProcessorService],
})
export class CsvBatchProcessorModule {}
\

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as csv from 'csv-parse';
import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class CsvBatchProcessorService {
  constructor(@InjectModel('YourModelName') private readonly model: Model<any>) {}

  // Process CSV data asynchronously
  async processCsvFile(filePath: string): Promise<void> {
    const readStream = fs.createReadStream(filePath);
    const parseStream = csv.parse({ columns: true });
    const transformStream = csv.transform((record) => {
      // Your transformation logic here, for example:
      return {
        field1: record['Column1'],
        field2: record['Column2'],
      };
    });
    const writeStream = this.model.createBatch();

    readStream
      .pipe(parseStream)
      .pipe(transformStream)
      .pipe(writeStream)
      .on('finish', async () => {
        await promisify(fs.unlink)(filePath);
        console.log('CSV file processed and deleted');
      })
      .on('error', (error) => {
        console.error('An error occurred while processing the CSV file:', error);
      });
  }
}
\

import { Model } from 'mongoose';
import { Typegoose, prop } from '@typegoose/typegoose';

// Define your Mongoose schema based on your CSV file structure
export class YourModelName extends Typegoose {
  @prop({ required: true })
  field1: string;

  @prop({ required: true })
  field2: string;
}
