/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import * as shortid from 'shortid';
import { OrderModel } from './order.model';
import { ProductsModel } from 'src/products/products.model';
import { User } from 'src/user/user.model';

@Injectable()
export class OrdersService {
  private orderRepo: Repository<OrderModel>;
  private userRepo: Repository<User>;
  private productRepo: Repository<ProductsModel>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.userRepo = this.entityManager.getRepository(User);
    this.orderRepo = this.entityManager.getRepository(OrderModel);
    this.productRepo = this.entityManager.getRepository(ProductsModel);
  }

  async placeOrder(data: {
    userId: string;
    items: [{ productId: string; quantity: number }];
  }) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: data.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const productIds = data.items.map((pid) => pid.productId);
      const products = await this.productRepo.findBy({ id: In(productIds) });

      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new BadRequestException('Product not found');
        if (product.stock < item.quantity)
          throw new BadRequestException('Out of stock');

        product.stock -= item.quantity;
        await this.productRepo.save(product);
        await this.orderRepo.save({
          id: shortid(),
          user,
          product: product.id as never,
          status: 'PENDING',
          quantity: item.quantity,
        });
      }
      return { message: 'Order place successfully' };
    } catch (error) {
      throw error;
    }
  }
}
