// 代码生成时间: 2025-08-22 00:38:46
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
# 优化算法效率
export class MessageNotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  /**
# 优化算法效率
   * Send a notification to the specified user.
# 扩展功能模块
   * @param userId The ID of the user to receive the notification.
   * @param message The message content of the notification.
   * @returns The created notification entity.
   */
  async sendNotification(userId: string, message: string): Promise<Notification> {
    if (!userId || !message) {
      throw new BadRequestException('User ID and message are required.');
    }

    const notification = this.notificationRepository.create({ userId, message });
    return this.notificationRepository.save(notification);
  }

  /**
   * Retrieve all notifications for a user.
   * @param userId The ID of the user whose notifications are to be retrieved.
   * @returns An array of notification entities.
   */
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }
# NOTE: 重要实现细节

    return this.notificationRepository.find({ where: { userId } });
  }
}

/* Notification Entity
# 优化算法效率
 * Represents a notification in the system.
# 增强安全性
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}

/* User Entity
 * Represents a user in the system.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Other user properties

  // Relations
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
# 增强安全性
}