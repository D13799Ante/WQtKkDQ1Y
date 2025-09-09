// 代码生成时间: 2025-09-10 06:00:40
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

/*
 * AuthService.ts
 * Provides the business logic for authentication.
 */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { SignInDto } from './dtos/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ username });
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload: JwtPayload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

/*
 * JwtStrategy.ts
 * Handles JWT authentication for NestJS.
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

/*
 * AuthController.ts
 * Controller that provides endpoints for authentication.
 */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signIn(@Request() req, signInDto: SignInDto) {
    return this.authService.login(req.user);
  }
}

/*
 * dtos/signin.dto.ts
 * Data transfer object for the sign-in process.
 */
export class SignInDto {
  username: string;
  password: string;
}

/*
 * jwt-payload.interface.ts
 * Interface for the JWT payload.
 */
export interface JwtPayload {
  username: string;
  sub: number;
}

/*
 * users/users.service.ts
 * Service for user-related operations.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const user = this.usersRepository.create({ username, password });
    return this.usersRepository.save(user);
  }
}

/*
 * users/users.repository.ts
 * Repository for user-related operations.
 */
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {}

/*
 * users/user.entity.ts
 * Entity for the User model.
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}

/*
 * users/dtos/create-user.dto.ts
 * Data transfer object for creating a user.
 */
export class CreateUserDto {
  username: string;
  password: string;
}
