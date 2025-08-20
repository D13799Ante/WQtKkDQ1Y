// 代码生成时间: 2025-08-21 07:13:54
import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * HashValueService provides functionality to calculate hash values.
 */
@Injectable()
export class HashValueService {
    /**
     * Calculate a SHA-256 hash of a given string.
     * @param input The string to be hashed.
     * @returns The SHA-256 hash of the input string.
     * @throws BadRequestException if the input is invalid.
     */
    async calculateHash(input: string): Promise<string> {
        if (!input) {
            throw new BadRequestException('Input cannot be empty');
        }

        return new Promise((resolve, reject) => {
            // Create a new SHA-256 hash instance
            const hash = crypto.createHash('sha256');
            // Update the hash with the input
            hash.update(input);
            // Calculate the digest and resolve the promise
            hash.digest((err, buffer) => {
                if (err) {
                    return reject(err);
                }
                resolve(buffer.toString('hex'));
            });
        });
    }
}