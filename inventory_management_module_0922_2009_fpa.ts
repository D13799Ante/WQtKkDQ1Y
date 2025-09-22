// 代码生成时间: 2025-09-22 20:09:17
import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './inventory-item.entity';
import { InventoryItemService } from './inventory-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem])],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryItemService],
})
export class InventoryModule {}

/**
 * InventoryItem Entity
 * Represents an item in the inventory
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;
}

/**
 * Inventory Service
 * Provides business logic for inventory operations
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryItemService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async create(createInventoryItemDto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryItemRepository.create(createInventoryItemDto);
    return this.inventoryItemRepository.save(item);
  }

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find();
  }

  async findOne(id: number): Promise<InventoryItem> {
    return this.inventoryItemRepository.findOneBy({ id });
  }

  async update(id: number, updateInventoryItemDto: CreateInventoryItemDto): Promise<InventoryItem> {
    await this.inventoryItemRepository.update(id, updateInventoryItemDto);
    return this.inventoryItemRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.inventoryItemRepository.delete(id);
  }
}

/**
 * Inventory Controller
 * Exposes endpoints for inventory management
 */
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Post()
  create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryItemService.create(createInventoryItemDto);
  }

  @Get()
  findAll() {
    return this.inventoryItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryItemService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInventoryItemDto: CreateInventoryItemDto) {
    return this.inventoryItemService.update(+id, updateInventoryItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryItemService.remove(+id);
  }
}

/**
 * DTO for creating a new inventory item
 */
import { IsString, IsNumber } from 'class-validator';

export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;
}

/**
 * Exception Filters for inventory module
 * Handles errors and exceptions
 */
import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { InventoryItemNotFoundException } from './exceptions/inventory-item-not-found.exception';

@Catch(InventoryItemNotFoundException)
export class InventoryItemNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: InventoryItemNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequestUrl(),
      error: exception.message,
    });
  }
}

/**
 * Custom exception for inventory item not found
 */
export class InventoryItemNotFoundException extends Error {
  constructor(public id: number) {
    super(`Inventory item with ID ${id} not found`);
  }
}