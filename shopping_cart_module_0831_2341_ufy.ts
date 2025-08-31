// 代码生成时间: 2025-08-31 23:41:30
import { Module, Global, Injectable } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { CartItemSchema } from './schemas/cart-item.schema';

// 使用 MongooseModule.forFeature 引入 Cart 和 CartItem 模型
const CartFeature = MongooseModule.forFeature([{
  name: 'Cart',
  schema: CartSchema,
}, {
  name: 'CartItem',
  schema: CartItemSchema,
}]);

// ShoppingCartModule 模块定义
@Global() // 应用全局模块
@Module({
  imports: [CartFeature],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // 导出 CartService 以便其他模块可以使用
})
export class ShoppingCartModule {}

// CartService 服务定义
@Injectable()
export class CartService {
  private carts: any[] = []; // 存储购物车数据

  // 添加商品到购物车
  addItem(cartId: string, item: any): any {
    const cart = this.carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const index = cart.items.findIndex((i) => i.productId === item.productId);
    if (index > -1) {
      cart.items[index].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    return cart;
  }

  // 从购物车中移除商品
  removeItem(cartId: string, productId: string): any {
    const cart = this.carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.items = cart.items.filter((item) => item.productId !== productId);
    return cart;
  }

  // 获取购物车内容
  getCart(cartId: string): any {
    const cart = this.carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  // 更新商品数量
  updateQuantity(cartId: string, productId: string, quantity: number): any {
    const cart = this.carts.find((c) => c.id === cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) {
      throw new Error('Item not found in cart');
    }
    item.quantity = quantity;
    return cart;
  }
}

// CartController 控制器定义
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 添加商品到购物车
  @Post('add/:cartId')
  addItem(@Param('cartId') cartId: string, @Body() item: any): any {
    return this.cartService.addItem(cartId, item);
  }

  // 从购物车中移除商品
  @Post('remove/:cartId/:productId')
  removeItem(@Param('cartId') cartId: string, @Param('productId') productId: string): any {
    return this.cartService.removeItem(cartId, productId);
  }

  // 获取购物车内容
  @Get(':cartId')
  getCart(@Param('cartId') cartId: string): any {
    return this.cartService.getCart(cartId);
  }

  // 更新商品数量
  @Post('update/:cartId/:productId')
  updateQuantity(@Param('cartId') cartId: string, @Param('productId') productId: string, @Body() { quantity }: { quantity: number }): any {
    return this.cartService.updateQuantity(cartId, productId, quantity);
  }
}