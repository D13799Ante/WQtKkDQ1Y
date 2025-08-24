// 代码生成时间: 2025-08-24 23:37:16
import { Injectable, BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { writeFile } from 'fs/promises';

@Injectable()
export class CsvBatchProcessorService {

  constructor() {}

  /**
   * Processes a CSV file and saves its contents to a new file.
   * @param csvStream A Readable stream containing the CSV content.
   * @param outputPath The path where the processed file will be saved.
   * @returns A promise that resolves to the path of the new file.
   */
  async processCsvFile(csvStream: Readable, outputPath: string): Promise<string> {
    try {
      // Generate a unique filename for the output file
      const outputFilename = `processed_${uuidv4()}.csv`;
      const outputFilePath = join(outputPath, outputFilename);

      // Parse the CSV stream to a JSON format
      const results = await this.parseCsvStream(csvStream);

      // Write the parsed JSON to a new CSV file
      await this.writeCsvFile(results, outputFilePath);

      return outputFilePath;
    } catch (error) {
      // Handle any errors that occur during processing
      throw new BadRequestException('Failed to process CSV file:', error.message);
    }
  }

  /**
   * Parses a CSV stream into a JSON format.
   * @param csvStream A Readable stream containing the CSV content.
   * @returns A promise that resolves to an array of objects representing the CSV rows.
   */
  private async parseCsvStream(csvStream: Readable): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const parser = new Papa.Parser({
        complete: resolve,
        error: reject,
      });

      csvStream.pipe(parser);
    });
  }

  /**
   * Writes an array of objects to a CSV file.
   * @param data An array of objects to be written to the CSV file.
   * @param filePath The path where the CSV file will be saved.
   * @returns A promise that resolves when the file has been written.
   */
  private async writeCsvFile(data: any[], filePath: string): Promise<void> {
    try {
      // Ensure the directory exists
      await ensureDir(join(filePath, '..'));

      // Convert the JSON data to a CSV string
      const csvString = Papa.unparse(data);

      // Write the CSV string to the file
      await writeFile(filePath, csvString);
    } catch (error) {
      throw new BadRequestException('Failed to write CSV file:', error.message);
    }
  }
}
