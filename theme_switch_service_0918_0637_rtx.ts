// 代码生成时间: 2025-09-18 06:37:16
import { Injectable } from '@nestjs/common';
import { Theme } from './theme.dto';
import { ConfigService } from '@nestjs/config';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ThemeSwitchService {
  private themes: Theme[] = [];

  constructor(private configService: ConfigService) {
    this.themes = this.configService.get('THEMES') as Theme[];
  }

  /**
   * Switch the user's theme to a new theme.
   *
   * @param userId The ID of the user who is switching themes.
   * @param newTheme The new theme to switch to.
   * @returns A promise that resolves to the updated theme.
   */
  async switchTheme(userId: string, newTheme: Theme): Promise<Theme> {
    if (!isNotEmpty(newTheme.name)) {
      throw new Error('Theme name is required.');
    }
    if (!this.themes.find(theme => theme.name === newTheme.name)) {
      throw new Error('Theme does not exist.');
    }

    // Here you would add logic to update the user's theme in your database or storage.
    // For demonstration purposes, we'll just simulate a successful update.
    return newTheme;
  }

  /**
   * Get the available themes.
   *
   * @returns A promise that resolves to an array of themes.
   */
  async getAvailableThemes(): Promise<Theme[]> {
    return this.themes;
  }
}

/**
 * Theme DTO: Data transfer object for theme data.
 *
 * @description This object represents the theme data that can be sent to and from clients.
 */
export class Theme {
  name: string;
  description: string;
}
