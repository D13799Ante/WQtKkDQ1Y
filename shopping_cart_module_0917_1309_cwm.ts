// 代码生成时间: 2025-09-17 13:09:26
import { Module, Global } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './cart.entity';

// Import any other required modules

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    // Add other modules here
  ],
  providers: [ShoppingCartService],
  controllers: [ShoppingCartController],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}

/* Service providing business logic for cart operations */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { Cart } from './cart.interface';
import { Product } from '../products/product.interface';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  // Add a product to the cart
  async addToCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
    }).then((cart) => {
      if (cart) {
        // Add the product if the cart exists
        cart.products.push({ productId });
        return this.cartRepository.save(cart);
      } else {
        // Create a new cart if it does not exist
        return this.createCart(userId, productId);
      }
    }).catch((error) => {
      throw new Error('Failed to add product to cart');
    });
    return cart;
  }

  // Create a new cart with a product
  private async createCart(userId: number, productId: number): Promise<Cart> {
    const newCart = new CartEntity();
    newCart.user = { id: userId };
    newCart.products = [{ productId }];
    return this.cartRepository.save(newCart);
  }

  // Other cart operations like removeFromCart, clearCart, etc.
}

/* Controller handling HTTP requests for cart operations */
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { Cart } from './cart.interface';

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly cartService: ShoppingCartService) {}

  // Endpoint to add a product to the cart
  @Post('add')
  async addToCart(@Body('userId') userId: number, @Body('productId') productId: number): Promise<Cart> {
    return await this.cartService.addToCart(userId, productId);
  }

  // Other endpoints like getCart, removeFromCart, clearCart, etc.
}

/* Entity representing the cart in the database */
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('simple-array')
  products: number[];

  @OneToOne(() => UserEntity, (user) => user.cart)
  @JoinColumn()
  user: UserEntity;
}

/* Interface representing the cart structure */
export interface Cart {
  id: number;
  userId: number;
  products: Product[];
}

/* Interface representing the product structure */
export interface Product {
  productId: number;
  // Other product fields
}
