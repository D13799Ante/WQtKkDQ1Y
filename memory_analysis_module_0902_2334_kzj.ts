// 代码生成时间: 2025-09-02 23:34:28
import { Module } from '@nestjs/common';
import { MemoryAnalysisService } from './memory-analysis.service';
import { MemoryAnalysisController } from './memory-analysis.controller';

@Module({
  providers: [MemoryAnalysisService],
  controllers: [MemoryAnalysisController],
})
export class MemoryAnalysisModule {}

/*
 * memory-analysis.service.ts
 * This service provides memory usage analysis functionality.
 */
import { Injectable } from '@nestjs/common';
import * as os from 'os';
import { promisify } from 'util';
import { exec } from 'child_process';

@Injectable()
export class MemoryAnalysisService {
  private readonly freeMemory: number;
  private readonly totalMemory: number;
  private readonly usedMemory: number;

  constructor() {
    this.totalMemory = os.totalmem();
    this.freeMemory = os.freemem();
    this.usedMemory = this.totalMemory - this.freeMemory;
  }

  // Get memory usage data
  async getMemoryUsage(): Promise<{ free: number; total: number; used: number }> {
    try {
      const usedPercentage = await this.getUsedMemoryPercentage();
      return {
        free: this.freeMemory,
        total: this.totalMemory,
        used: this.usedMemory,
        usedPercentage,
      };
    } catch (error) {
      throw new Error(`Failed to get memory usage: ${error.message}`);
    }
  }

  // Calculate used memory percentage
  private async getUsedMemoryPercentage(): Promise<number> {
    return new Promise((resolve, reject) => {
      exec('free -m', (error, stdout) => {
        if (error) {
          return reject(error);
        }
        const lines = stdout.split('
');
        const memoryInfo = lines[1].split(/\s+/);
        const usedMem = parseInt(memoryInfo[2], 10);
        const totalMem = parseInt(memoryInfo[1], 10);
        const usedPercentage = (usedMem / totalMem) * 100;
        resolve(usedPercentage);
      });
    });
  }
}

/*
 * memory-analysis.controller.ts
 * This controller handles HTTP requests related to memory usage analysis.
 */
import { Controller, Get } from '@nestjs/common';
import { MemoryAnalysisService } from './memory-analysis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('memory')
@Controller('memory')
export class MemoryAnalysisController {
  constructor(private readonly memoryAnalysisService: MemoryAnalysisService) {}

  @Get('usage')
  async getMemoryUsage(): Promise<{ free: number; total: number; used: number; usedPercentage: number }> {
    return this.memoryAnalysisService.getMemoryUsage();
  }
}
