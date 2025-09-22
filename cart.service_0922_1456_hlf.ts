// 代码生成时间: 2025-09-22 14:56:35
import { Injectable } from '@nestjs/common';
import { CartItem } from './cart-item.entity';
import { Product } from './product.entity';

@Injectable()
export class CartService {
  private readonly carts: Record<string, CartItem[]> = {};

  constructor(private readonly productService: ProductService) {}

  /**
   * Adds a product to the shopping cart.
   * @param userId The ID of the user who owns the cart.
   * @param productId The ID of the product to add.
   * @param quantity The quantity of the product to add.
   * @returns The updated cart items.
   */
  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem[]> {
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    let cartItems = this.carts[userId];
    if (!cartItems) {
      cartItems = [];
      this.carts[userId] = cartItems;
    }

    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
    }

    return cartItems;
  }

  /**
   * Removes a product from the shopping cart.
   * @param userId The ID of the user who owns the cart.
   * @param productId The ID of the product to remove.
   * @returns The updated cart items.
   */
  async removeFromCart(userId: string, productId: string): Promise<CartItem[]> {
    let cartItems = this.carts[userId];
    if (!cartItems) {
      throw new Error('Cart not found');
    }

    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    if (existingItemIndex > -1) {
      cartItems.splice(existingItemIndex, 1);
    } else {
      throw new Error('Product not found in cart');
    }

    return cartItems;
  }

  /**
   * Retrieves the cart for a given user.
   * @param userId The ID of the user who owns the cart.
   * @returns The cart items.
   */
  async getCart(userId: string): Promise<CartItem[]> {
    const cartItems = this.carts[userId];
    if (!cartItems) {
      throw new Error('Cart not found');
    }

    return cartItems;
  }
}

/**
 * CartItem - Represents an item in the shopping cart.
 */
export interface CartItem {
  productId: string;
  quantity: number;
}

/**
 * Product - Represents a product in the system.
 */
export interface Product {
  id: string;
  name: string;
  price: number;
}

/**
 * ProductService - Service for managing products.
 * This would be implemented to interact with a database or external service.
 */
export class ProductService {
  private products: Product[] = [];

  constructor() {
    // Initialize with some products
    this.products.push({ id: '1', name: 'Product 1', price: 100 });
    this.products.push({ id: '2', name: 'Product 2', price: 200 });
  }

  async findById(id: string): Promise<Product> {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}
