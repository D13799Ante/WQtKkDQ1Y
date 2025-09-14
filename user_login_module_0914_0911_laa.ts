// 代码生成时间: 2025-09-14 09:11:18
 * an interface for user data, and a controller to handle incoming requests.
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Assuming UsersModule exists and contains UserRepository
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class UserLoginModule {}

/**
 * AuthService - A service for handling login logic.
 *
 * It uses a strategy pattern to support different authentication methods.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../users/user.service'; // Assuming UserService exists in UsersModule
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validate user method, used to validate credentials.
   *
   * @param email the user's email address.
   * @param password the user's password.
   * @returns UserPayload or throws an error if validation fails.
   */
  async validate(email: string, password: string): Promise<UserPayload> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

/**
 * AuthController - A controller for handling login requests.
 *
 */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint.
   *
   * @param req the HTTP request object.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

/**
 * LocalStrategy - A local strategy for handling local (username/password) authentication.
 *
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validate(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

/**
 * UserPayload - An interface for user payload data.
 *
 */
export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

/**
 * interfaces/user-payload.interface.ts - Defines the user payload structure.
 */
export interface UserPayload {
  username: string;
  email: string;
  password: string;
}

/**
 * auth.service.ts - Contains the AuthService class responsible for authentication logic.
 */
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository'; // Assuming UserRepository exists

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Here you would add your logic to validate the user,
    // possibly checking the credentials against a database.
    const user = await this.userRepository.validateUser(email, password);
    if (user) {
      // Return only the necessary information (e.g., without the password).
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

/**
 * auth.controller.ts - Contains the AuthController class for handling login requests.
 */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}

/**
 * local.strategy.ts - Contains the LocalStrategy class for local authentication.
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}