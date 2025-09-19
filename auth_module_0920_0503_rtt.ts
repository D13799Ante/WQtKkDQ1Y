// 代码生成时间: 2025-09-20 05:03:32
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
# NOTE: 重要实现细节
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule,
# 添加错误处理
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {}

/*
 * AuthService.ts - Service for handling authentication logic
 */
import { Injectable } from '@nestjs/common';
# 增强安全性
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { jwtConstants } from './constants';
# 增强安全性
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
# 优化算法效率
    const user = await this.usersService.findOne(username);
# FIXME: 处理边界情况
    if (user && await bcrypt.compare(pass, user.password)) {
      return user;
    }
    return null;
  }
# FIXME: 处理边界情况

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
# NOTE: 重要实现细节

/*
 * AuthController.ts - Controller for handling authentication routes
 */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

/*
 * JwtAuthGuard.ts - Guard for handling JWT authentication
 */
import { Injectable } from '@nestjs/common';
# 增强安全性
import { AuthGuard } from '@nestjs/passport';
# NOTE: 重要实现细节

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
# TODO: 优化性能

/*
 * JwtStrategy.ts - Strategy for handling JWT payload
 */
# 改进用户体验
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
# 增强安全性
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
# TODO: 优化性能
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<any> {
    const user = await this.authService.validateUser(payload.username, payload.password);
    if (!user) {
# 添加错误处理
      throw new UnauthorizedException();
    }
    return user;
  }
}

/*
 * constants.ts - Constants for JWT
 */
# NOTE: 重要实现细节
export const jwtConstants = {
  secret: 'secretKey',
};
# 优化算法效率

/*
 * user.entity.ts - Entity for user
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
# 优化算法效率

@Entity()
# 扩展功能模块
export class User {
  @PrimaryGeneratedColumn()
# NOTE: 重要实现细节
  userId: number;

  @Column()
  username: string;

  @Column()
# TODO: 优化性能
  password: string;
}

/*
# 增强安全性
 * users.service.ts - Service for handling user-related operations
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async findOne(username: string): Promise<User | undefined> {
# 优化算法效率
    return this.usersRepository.findOne({ username });
  }
# 增强安全性
}
