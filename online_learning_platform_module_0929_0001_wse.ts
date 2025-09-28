// 代码生成时间: 2025-09-29 00:01:22
import { Module } from '@nestjs/common';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { CoursesRepository } from './repositories/courses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

// This is the main module for the online learning platform.
@Module({
  // Import necessary modules
  imports: [TypeOrmModule.forFeature([Course])],
  // Controllers are used to handle requests
  controllers: [CoursesController],
  // Services are used to handle business logic
  providers: [CoursesService, CoursesRepository],
  // Export providers to make them available to other modules
  exports: [CoursesService],
})
export class OnlineLearningPlatformModule {}

/*
 * Below are the imports and declarations for the controllers, services, repositories, and entities
 * that are part of the online learning platform module. Each file should be created
 * separately in their respective directories.
 */

// courses.controller.ts
import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { CoursesService } from './services/courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(@Query('title') title?: string): Promise<any> {
    return this.coursesService.findAll(title);
  }
}

// courses.service.ts
import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './repositories/courses.repository';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async findAll(title?: string): Promise<Course[]> {
    return this.coursesRepository.findAll(title);
  }
}

// courses.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAll(title?: string): Promise<Course[]> {
    return this.courseRepository.find({ where: { title } });
  }
}

// course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // Additional properties can be added here
}
