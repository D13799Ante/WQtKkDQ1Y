// 代码生成时间: 2025-08-06 22:58:42
import { Injectable } from '@nestjs/common';

/**
 * SortingService class provides sorting functionality.
 * It includes a method to sort an array of numbers.
 */
@Injectable()
export class SortingService {

  /**
   * Sorts an array of numbers in ascending order.
   *
   * @param numbers The array of numbers to be sorted.
   * @returns The sorted array of numbers.
   *
   * @throws Will throw an error if the input is not an array of numbers.
   */
  async sortNumbers(numbers: number[]): Promise<number[]> {
    if (!Array.isArray(numbers) || !numbers.every(num => typeof num === 'number')) {
      throw new Error('Invalid input: Expected an array of numbers.');
    }

    return numbers.sort((a, b) => a - b);
  }

  /**
   * Sorts an array of objects based on the provided key and order.
   *
   * @param objects The array of objects to be sorted.
   * @param key The key to sort the objects by.
   * @param order The order of sorting (ascending or descending).
   * @returns The sorted array of objects.
   *
   * @throws Will throw an error if the input is not an array of objects or if the key is not a string.
   */
  async sortObjects<T>(objects: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    if (!Array.isArray(objects) || !objects.every(obj => obj instanceof Object && typeof key === 'string')) {
      throw new Error('Invalid input: Expected an array of objects and a key string.');
    }

    return objects.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        throw new Error('Invalid input: Key must be of comparable type (number or string).');
      }
    });
  }
}
