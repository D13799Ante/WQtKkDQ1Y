// 代码生成时间: 2025-08-22 22:27:49
import { Module } from '@nestjs/common';
import { MemoryUsageAnalysisService } from './memory-usage-analysis.service';
import { MemoryUsageAnalysisController } from './memory-usage-analysis.controller';
import { Pidusage } from 'pidusage';

@Module({
  providers: [MemoryUsageAnalysisService],
  controllers: [MemoryUsageAnalysisController]
})
export class MemoryUsageAnalysisModule {}

/**
 * MemoryUsageAnalysisService is responsible for analyzing memory usage.
 */
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {_PID_USAGE} from 'pidusage';

@Injectable()
export class MemoryUsageAnalysisService {
  constructor() {}

  /**
   * Get memory usage of the current process.
   * @returns Promise with memory usage data.
   */
  async getMemoryUsage(): Promise<{ memory: number }> {
    try {
      const pid = process.pid; // Get the current process id.
      const memoryUsage = await Pidusage(pid); // Get memory usage using pidusage.
      return { memory: memoryUsage.memory }; // Return memory usage.
    } catch (error) {
      throw new Error('Failed to get memory usage: ' + error.message); // Error handling.
    }
  }
}

/**
 * MemoryUsageAnalysisController handles HTTP requests for memory usage analysis.
 */
import { Controller, Get } from '@nestjs/common';
import { MemoryUsageAnalysisService } from './memory-usage-analysis.service';

@Controller('memory-usage')
export class MemoryUsageAnalysisController {
  constructor(private readonly memoryUsageAnalysisService: MemoryUsageAnalysisService) {}

  /**
   * GET endpoint to get memory usage.
   * @returns Memory usage data.
   */
  @Get()
  async getMemoryUsage(): Promise<{ memory: number }> {
    return this.memoryUsageAnalysisService.getMemoryUsage(); // Call service to get memory usage.
  }
}