// 代码生成时间: 2025-09-08 04:24:53
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn, Column } from 'typeorm';

// 数据模型 Entity
@Entity()
export class DataModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}

// DataModel 服务接口
export interface DataModelService {
  create(data: DataModel): Promise<DataModel>;
  findOne(id: number): Promise<DataModel>;
  findAll(): Promise<DataModel[]>;
  delete(id: number): Promise<void>;
  update(id: number, data: Partial<DataModel>): Promise<DataModel>;
}

// DataModel 控制器
import { Controller, Post, Get, Delete, Put, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataModelService } from './dataModel.service';

@Controller('data-model')
export class DataModelController {
  constructor(private readonly dataModelService: DataModelService) {}

  @Post()
  async create(@Body() data: DataModel): Promise<DataModel> {
    try {
      return await this.dataModelService.create(data);
    } catch (error) {
      throw new BadRequestException('Failed to create data model.');
    }
  }

  @Get()
  async findAll(): Promise<DataModel[]> {
    return this.dataModelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DataModel> {
    const dataModel = await this.dataModelService.findOne(+id);
    if (!dataModel) {
      throw new NotFoundException('Data model not found.');
    }
    return dataModel;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<DataModel>): Promise<DataModel> {
    const updatedDataModel = await this.dataModelService.update(+id, data);
    if (!updatedDataModel) {
      throw new NotFoundException('Data model not found.');
    }
    return updatedDataModel;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.dataModelService.delete(+id);
  }
}

// DataModel 服务实现
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataModel } from './dataModel.entity';
import { DataModelService } from './dataModel.service';

@Injectable()
export class DataModelServiceImpl implements DataModelService {
  constructor(
    @InjectRepository(DataModel)
    private readonly dataModelRepository: Repository<DataModel>,
  ) {}

  async create(data: DataModel): Promise<DataModel> {
    return await this.dataModelRepository.save(data);
  }

  async findOne(id: number): Promise<DataModel> {
    return await this.dataModelRepository.findOne(id);
  }

  async findAll(): Promise<DataModel[]> {
    return await this.dataModelRepository.find();
  }

  async delete(id: number): Promise<void> {
    await this.dataModelRepository.delete(id);
  }

  async update(id: number, data: Partial<DataModel>): Promise<DataModel> {
    await this.dataModelRepository.update(id, data);
    return this.findOne(id);
  }
}

// DataModel 模块
@Module({
  imports: [TypeOrmModule.forFeature([DataModel])],
  controllers: [DataModelController],
  providers: [DataModelService],
})
export class DataModelModule {}
