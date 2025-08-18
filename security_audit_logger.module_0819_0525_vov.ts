// 代码生成时间: 2025-08-19 05:25:39
import { Module } from '@nestjs/common';
import { AuditLoggerService } from './audit_logger.service';
import { AuditLoggerController } from './audit_logger.controller';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

// 配置Winston日志
const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        ),
      ),
    }),
  ],
};

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AuditLoggerController],
  providers: [AuditLoggerService],
})
export class SecurityAuditLoggerModule {}

// 审计日志服务
import { Injectable } from '@nestjs/common';
import { createLogger } from 'winston';

@Injectable()
export class AuditLoggerService {
  private logger = createLogger({
    // 这里可以配置日志级别、格式等
    level: 'info',
    format: winston.format.json(),
  });

  constructor() {
    // 这里可以添加其他配置，如日志文件存储等
  }

  log(event: string, context: string, message: string): void {
    try {
      this.logger.info(`${event} - ${context}: ${message}`);
    } catch (error) {
      // 错误处理
      console.error('Failed to log audit event', error);
    }
  }
}

// 审计日志控制器
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuditLoggerService } from './audit_logger.service';

@Controller('audit')
export class AuditLoggerController {
  constructor(private readonly auditLoggerService: AuditLoggerService) {}

  @Post('log')
  async logAuditEvent(@Body() body: { event: string; context: string; message: string }) {
    try {
      await this.auditLoggerService.log(body.event, body.context, body.message);
    } catch (error) {
      throw new HttpException('Failed to log audit event', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
