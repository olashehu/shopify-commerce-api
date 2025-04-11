import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ProductsModule } from './products/products.module';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    ProductsModule,
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
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
