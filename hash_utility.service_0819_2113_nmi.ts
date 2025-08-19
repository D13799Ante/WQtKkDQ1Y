// 代码生成时间: 2025-08-19 21:13:04
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashUtilityService {

  /**
   * Calculate the hash value of a given input string.
   *
   * @param value The input string to be hashed.
   * @param algorithm The hash algorithm to use, such as 'sha256'.
   * @returns The calculated hash value.
   * @throws Will throw an error if the input is not a string.
   */
  public calculateHash(value: string, algorithm: string = 'sha256'): string {
    if (typeof value !== 'string') {
      throw new Error('Input must be a string.');
    }

    // Use the crypto library to calculate the hash
    return crypto.createHash(algorithm).update(value).digest('hex');
  }

  /**
   * Verify if the given input matches the hash value.
   *
   * @param value The original input string.
   * @param hash The hash value to compare with.
   * @param algorithm The hash algorithm used to generate the hash.
   * @returns True if the input matches the hash, false otherwise.
   * @throws Will throw an error if the input is not a string or if the hash is not a string.
   */
  public verifyHash(value: string, hash: string, algorithm: string = 'sha256'): boolean {
    if (typeof value !== 'string') {
      throw new Error('Input must be a string.');
    }
    if (typeof hash !== 'string') {
      throw new Error('Hash must be a string.');
    }

    // Calculate the hash of the input and compare it with the provided hash
    const calculatedHash = this.calculateHash(value, algorithm);
    return calculatedHash === hash;
  }
}
