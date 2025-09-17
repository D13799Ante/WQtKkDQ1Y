// 代码生成时间: 2025-09-17 20:39:52
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashValueService {

  /**
   * Calculate the hash value of a given string.
   * @param {string} input The string to be hashed.
   * @returns {Promise<string>} The calculated hash value.
   * @throws {Error} If the input is not a string.
   */
  async calculateHash(input: string): Promise<string> {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string.');
    }

    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) reject(err);
        const salt = buf.toString('hex');

        crypto.pbkdf2(
          input,
          salt,
          100000,
          64,
          'sha512',
          (err, key) => {
            if (err) reject(err);
            resolve(key.toString('hex'));
          }
        );
      });
    });
  }

  /**
   * Verify if the given input matches the provided hash.
   * @param {string} input The input to be verified.
   * @param {string} hash The hash to compare against.
   * @returns {Promise<boolean>} True if input matches the hash, false otherwise.
   * @throws {Error} If the input or hash is not a string.
   */
  async verifyHash(input: string, hash: string): Promise<boolean> {
    if (typeof input !== 'string' || typeof hash !== 'string') {
      throw new Error('Input and hash must be strings.');
    }

    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) reject(err);
        const salt = buf.toString('hex');

        crypto.pbkdf2(
          input,
          salt,
          100000,
          64,
          'sha512',
          (err, key) => {
            if (err) reject(err);
            resolve(key.toString('hex') === hash);
          }
        );
      });
    });
  }
}
