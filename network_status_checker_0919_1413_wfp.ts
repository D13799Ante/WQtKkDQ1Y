// 代码生成时间: 2025-09-19 14:13:26
import { Injectable, Logger } from '@nestjs/common';
import { isOnline } from 'is-online';
import { firstValueFrom } from 'rxjs';

/**
 * NetworkStatusChecker service class for checking network connection status.
 */
@Injectable()
export class NetworkStatusCheckerService {
  private readonly logger = new Logger(NetworkStatusCheckerService.name);

  constructor() {} 

  /**
   * Check if the network connection is online.
   * @returns Promise<boolean> indicating whether the network is online.
   */
  async checkNetworkStatus(): Promise<boolean> {
    try {
      // Use the 'is-online' library to check network status.
      const isOnlineStatus = await firstValueFrom(isOnline());
      this.logger.log('Network status check result:', isOnlineStatus);
      return isOnlineStatus;
    } catch (error) {
      // Log the error if the network status check fails.
      this.logger.error('Failed to check network status:', error);
      // Re-throw the error for further handling.
      throw error;
    }
  }
}
