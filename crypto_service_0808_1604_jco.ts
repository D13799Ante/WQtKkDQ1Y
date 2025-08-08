// 代码生成时间: 2025-08-08 16:04:27
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  /**
   * Encrypts a password.
   *
   * @param password The plain text password to encrypt.
   * @returns A Promise containing the hashed password.
   */
  async encryptPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(12);
      const encryptedPassword = await bcrypt.hash(password, salt);
      return encryptedPassword;
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  /**
   * Decrypts a password.
   * This method is actually for verifying the password against the hash, not decryption.
   *
   * @param password The plain text password to verify.
   * @param encryptedPassword The hashed password to compare against.
   * @returns A boolean indicating whether the password is correct.
   */
  async decryptPassword(password: string, encryptedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, encryptedPassword);
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }
}
