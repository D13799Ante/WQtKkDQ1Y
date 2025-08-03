// 代码生成时间: 2025-08-04 03:21:44
import { Module } from '@nestjs/common';
import { RandomNumberGeneratorService } from './random_number_generator.service';

/**
 * RandomNumberGeneratorModule is responsible for the module initialization
 * which includes providing the RandomNumberGeneratorService.
 * This module can be imported in the application to generate random numbers.
 */
@Module({
  providers: [RandomNumberGeneratorService],
  exports: [RandomNumberGeneratorService],
})
export class RandomNumberGeneratorModule {}

/**
 * RandomNumberGeneratorService provides functionality to generate random numbers.
 * It can be used to generate random numbers within a specified range.
 */
import { Injectable } from '@nestjs/common';
import { Random } from 'random-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RandomNumberGeneratorService {
  private readonly rng = new Random(uuidv4());

  /**
   * Generates a random number within the specified range.
   * @param min The minimum value of the range (inclusive).
   * @param max The maximum value of the range (inclusive).
   * @returns A random number between min and max.
   * @throws Will throw an error if min is greater than max.
   */
  generateRandomNumber(min: number, max: number): number {
    if (min > max) {
      throw new Error('The minimum value cannot be greater than the maximum value.');
    }
    return this.rng.integer(min, max);
  }
}
