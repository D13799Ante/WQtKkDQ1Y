// 代码生成时间: 2025-09-18 19:53:36
import { Module, JwtModule } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { UserRepository } from '../user/user.repository';
import { PassportJwtModule } from '@nestjs/passport-jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

// 定义 AuthModule 来组织认证相关的模块和提供者
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    PassportJwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtAuthGuard,
    JwtStrategy,
    UserRepository,
  ],
  exports: [AuthService, JwtAuthGuard, PassportJwtModule],
})
export class AuthModule {}

/*
 * JwtModule 和 PassportJwtModule 是用于 JWT 认证的模块
 * AuthController 负责处理登录请求
 * AuthService 提供认证服务，比如验证用户凭证和生成 JWT
 * JwtStrategy 是 Passport 的策略，用于验证 JWT
 * JwtAuthGuard 是一个守卫，用于保护路由
 * UserRepository 是用户数据的访问层
 * jwtConstants 是 JWT 的配置常量
 */