import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('create/order')
  createOrder(
    @Body()
    placeOrder: {
      userId: string;
      items: [{ productId: string; quantity: number }];
    },
  ) {
    return this.orderService.placeOrder(placeOrder);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file....');
    console.log(file);
  }
}
