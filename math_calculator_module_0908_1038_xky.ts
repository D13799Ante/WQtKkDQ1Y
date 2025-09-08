// 代码生成时间: 2025-09-08 10:38:33
import { Module } from '@nestjs/common';
import { MathCalculatorService } from './math-calculator.service';

@Module({
  providers: [MathCalculatorService],
  exports: [MathCalculatorService],
})
export class MathCalculatorModule {}