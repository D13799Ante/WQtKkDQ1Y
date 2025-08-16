// 代码生成时间: 2025-08-17 02:08:14
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigManager {
  private readonly envConfig: { [key: string]: any };

  constructor() {
    this.envConfig = this.loadEnvConfig();
  }

  /**
   * Load environment variables from a .env file.
   *
   * @private
   * @returns {object} The loaded environment variables.
   */
  private loadEnvConfig(): { [key: string]: any } {
    const envFilePath = path.resolve(__dirname, '..', '.env');
    dotenv.config({ path: envFilePath });
    return process.env;
  }

  /**
   * Get a configuration value.
   *
   * @param {string} key The configuration key to retrieve.
   * @returns {any} The configuration value or null if not found.
   */
  get(key: string): any {
    if (!this.envConfig.hasOwnProperty(key)) {
      throw new Error(`Config key ${key} not found`);
    }
    return this.envConfig[key];
  }
}

/**
 * config.module.ts
 * This module defines the configuration module for NestJS applications.
 * It includes the ConfigManager provider.
 */
import { Module } from '@nestjs/common';
import { ConfigManager } from './config_manager';

@Module({
  providers: [ConfigManager],
  exports: [ConfigManager],
})
export class ConfigModule {}
