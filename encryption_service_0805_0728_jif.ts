// 代码生成时间: 2025-08-05 07:28:45
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Exception } from '@nestjs/common/exceptions';

@Injectable()
export class EncryptionService {
  
  // Encrypt a password using bcrypt
  async encryptPassword(password: string): Promise<string> {
    try {
      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      
      return hashed;
    } catch (error) {
      // Handle any errors that occur during encryption
      throw new Exception(`Encryption failed: ${error.message}`);
    }
  }

  // Decrypt a password using bcrypt (Note: bcrypt does not store the plaintext password)
  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      // Compare the plain text password with the hashed password
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
      // Handle any errors that occur during comparison
      throw new Exception(`Comparison failed: ${error.message}`);
    }
  }
}
