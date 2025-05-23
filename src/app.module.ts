import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { UploadModule } from './upload/upload.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      entities: [path.join(__dirname, '**', '*.model.{js,ts}')],
      synchronize: true,
    }),
    UploadModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
