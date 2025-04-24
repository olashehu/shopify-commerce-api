import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// import { UserController } from './user/user.controller';
import { ProductsModule } from './products/products.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
// import { FileUploadModule } from './file-upload/file-upload.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { UploadModule } from './upload/upload.module';
// import { CloudinaryModule } from './cloundinary/cloudinary.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      logging: true,
      entities: [path.join(__dirname, '**', '*.model.{js,ts}')],
      synchronize: true,
    }),
    // CloudinaryModule,
    UploadModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    // FileUploadModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
