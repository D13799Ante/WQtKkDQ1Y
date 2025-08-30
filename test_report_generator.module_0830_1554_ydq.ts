// 代码生成时间: 2025-08-30 15:54:08
import { Module } from '@nestjs/common';
import { TestReportGeneratorService } from './test-report-generator.service';
import { TestReportGeneratorController } from './test-report-generator.controller';

/**
 * TestReportGeneratorModule is responsible for handling the generation of test reports.
 * It contains the service and controller to interact with the test report functionality.
 */
@Module({
  controllers: [TestReportGeneratorController],
  providers: [TestReportGeneratorService],
})
export class TestReportGeneratorModule {}

// test-report-generator.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

/**
 * TestReportGeneratorService generates a test report based on provided test data.
 * It handles the logic to create and write the report to a file.
 */
@Injectable()
export class TestReportGeneratorService {
  private readonly reportsDirectory = './reports';

  constructor() {}

  /**
   * Generates a test report and writes it to a file.
   * @param testData The data used to generate the test report.
   * @returns The path to the generated report file.
   * @throws Error if an error occurs during report generation.
   */
  async generateReport(testData: any): Promise<string> {
    const reportId = uuidv4();
    const reportPath = path.join(this.reportsDirectory, `${reportId}.txt`);

    try {
      fs.writeFileSync(reportPath, JSON.stringify(testData, null, 2));
      return reportPath;
    } catch (error) {
      throw new Error(`Failed to generate test report: ${error.message}`);
    }
  }
}

// test-report-generator.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TestReportGeneratorService } from './test-report-generator.service';

/**
 * TestReportGeneratorController handles HTTP requests related to test report generation.
 */
@Controller('test-reports')
export class TestReportGeneratorController {
  constructor(private readonly reportService: TestReportGeneratorService) {}

  /**
   * Endpoint to generate a test report.
   * @param testData The data used to generate the test report.
   * @returns The path to the generated report file.
   */
  @Post()
  async generateTestReport(@Body() testData: any): Promise<string> {
    return this.reportService.generateReport(testData);
  }
}
