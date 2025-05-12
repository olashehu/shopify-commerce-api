/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import axios from 'axios';
import * as shortid from 'shortid';
import { RawProductFromAPI, SelectedProductDTO } from './products.dto';
import { ProductsModel } from './products.model';

@Injectable()
export class ProductsService implements OnModuleInit {
  productsRepo: Repository<ProductsModel>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.productsRepo = this.entityManager.getRepository(ProductsModel);
  }

  onModuleInit() {
    console.log('Seeding data on startup...');
    // await this.seedProducts();
  }

  private async seedProducts(): Promise<void> {
    try {
      const response = await axios.get<{ products: RawProductFromAPI[] }>(
        'https://dummyjson.com/products?limit=190',
      );

      const products = response.data.products;

      for (const product of products) {
        if (Object.keys(product).length === 0) {
          continue;
        }

        const newProduct: SelectedProductDTO = {
          name: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.availabilityStatus,
          images: product.images,
        };

        const existingProduct = await this.productsRepo.findOne({
          where: { name: newProduct.name },
        });

        if (existingProduct) {
          console.warn(`Product "${existingProduct.name}" already exists.`);
          continue;
        }
        await this.productsRepo.save({
          id: shortid(),
          ...newProduct,
        });
      }
    } catch (error: unknown) {
      console.error('Error seeding users:', error);
    }
  }

  async getAllProduct(
    page?: number,
    limit?: number,
    category?: string,
    search?: string,
  ) {
    try {
      const query = this.productsRepo.createQueryBuilder('product');

      if (category) {
        query.andWhere('product.category = :category', { category });
      }

      if (search) {
        query.andWhere(
          '(product.name ILIKE :search OR product.description ILIKE :search)',
          { search: `${search}%` },
        );
      }

      const total = await query.getCount();

      if (page && limit) {
        const offset = (page - 1) * limit;
        query.skip(offset).take(limit);
      }

      const products = await query.getMany();

      const categories = await this.productsRepo
        .createQueryBuilder('prod')
        .select('prod.category', 'category')
        .distinct(true)
        .orderBy('prod.category', 'ASC')
        .getRawMany();

      return {
        data: products,
        pagination: {
          total,
          page: page || 1,
          limit: limit || total,
          totalPages: limit ? Math.ceil(total / limit) : 1,
        },
        categories,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async getProduct(id: string) {
    try {
      const product = await this.productsRepo.findOne({
        where: { id },
      });
      if (!product) {
        return { error: `product with id: ${id} is missing`, message: 'fail' };
      }
      return {
        product,
        message: 'success',
      };
    } catch (error) {
      console.log(error);
    }
    return;
  }
}
