// 代码生成时间: 2025-09-08 17:38:08
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from './password.entity'; // Assuming a Password Entity exists

@Injectable()
export class PasswordEncryptionDecryptionService {
  constructor(
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
  ) {}

  /**
   * Encrypts a plain text password
   * @param plainTextPassword The password to be encrypted
   * @returns Promise<string> The encrypted password
   */
  async encryptPassword(plainTextPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(plainTextPassword, salt);
      return encryptedPassword;
    } catch (error) {
      // Error handling
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  /**
   * Decrypts an encrypted password for comparison purposes
   * @param encryptedPassword The password to be decrypted
   * @param plainTextPassword The plain text password to compare with
   * @returns Promise<boolean> If the passwords match
   */
  async decryptPassword(encryptedPassword: string, plainTextPassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(plainTextPassword, encryptedPassword);
      return isMatch;
    } catch (error) {
      // Error handling
      throw new Error('Decryption failed: ' + error.message);
    }
  }

  /**
   * Saves an encrypted password to the database
   * @param userId The ID of the user to associate the password with
   * @param plainTextPassword The password to be encrypted and saved
   * @returns Promise<Password> The saved password entity
   */
  async saveEncryptedPassword(userId: number, plainTextPassword: string): Promise<Password> {
    try {
      const encryptedPassword = await this.encryptPassword(plainTextPassword);
      const password = this.passwordRepository.create({ userId, encryptedPassword });
      return this.passwordRepository.save(password);
    } catch (error) {
      // Error handling
      throw new Error('Failed to save password: ' + error.message);
    }
  }
}
