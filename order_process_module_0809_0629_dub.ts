// 代码生成时间: 2025-08-09 06:29:31
import { Module, forwardRef, HttpException, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductService } from '../product/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrderController],
  providers: [OrderService, ProductService],
  exports: [OrderService]
})
export class OrderProcessModule {
  // Module definition for order processing
  // It includes the necessary imports, controllers, providers, and exports.
  // The module is designed to be easily understandable and maintainable.
}