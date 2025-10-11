// 代码生成时间: 2025-10-11 22:07:57
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TestEntity } from './test.entity'; // 假设的实体

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService],
})
export class TestCaseManagementModule {}

/*
 * TestController - 测试用例控制器
 */
import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { TestEntity } from './test.entity'; // 假设的实体

@Controller('test-cases')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async findAll(@Query() query): Promise<TestEntity[]> {
    return this.testService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TestEntity> {
    const test = await this.testService.findOne(id);
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  @Post()
  async create(@Body() testEntity: TestEntity): Promise<TestEntity> {
    return this.testService.create(testEntity);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() testEntity: TestEntity): Promise<TestEntity> {
    const updatedTest = await this.testService.update(id, testEntity);
    if (!updatedTest) throw new NotFoundException('Test not found');
    return updatedTest;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.testService.remove(id);
    if (result.affected === 0) throw new NotFoundException('Test not found');
  }
}

/*
 * TestService - 测试用例服务
 */
import { Injectable } from '@nestjs/common';
import { TestEntity } from './test.entity'; // 假设的实体
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private testRepository: Repository<TestEntity>,
  ) {}

  async create(testEntity: TestEntity): Promise<TestEntity> {
    return this.testRepository.save(testEntity);
  }

  async findAll(query: any): Promise<TestEntity[]> {
    // 可以根据 query 参数实现更复杂的查询逻辑
    return this.testRepository.find();
  }

  async findOne(id: string): Promise<TestEntity> {
    return this.testRepository.findOneBy({ id });
  }

  async update(id: string, testEntity: TestEntity): Promise<TestEntity> {
    await this.testRepository.update(id, testEntity);
    return this.testRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<any> {
    return this.testRepository.delete(id);
  }
}
