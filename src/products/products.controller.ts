import {
  Controller,
  Get,
  Param,
  Query,
  //   Body,
  //   UseGuards,
  //   HttpCode,
  //   HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('product')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getProducts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productsService.getAllProduct(page, limit);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }
}
