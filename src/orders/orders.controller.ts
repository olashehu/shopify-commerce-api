import { Controller, Body, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('v1')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('create/order')
  async createOrder(
    @Body()
    placeOrder: {
      userId: string;
      items: [{ productId: string; quantity: number }];
    },
  ) {
    return await this.orderService.placeOrder(placeOrder);
  }
}
