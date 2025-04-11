/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  OnModuleInit,
  // HttpStatus,
  // HttpException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProductsModel } from 'src/models/products.model';
import axios from 'axios';
import * as shortid from 'shortid';
import { RawProductFromAPI, SelectedProductDTO } from './dto/product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private productsRepo: Repository<ProductsModel>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.productsRepo = this.entityManager.getRepository(ProductsModel);
  }

  async onModuleInit() {
    console.log('Seeding data on startup...');
    await this.seedProducts();
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: shortid(),
          ...newProduct,
        });
      }
    } catch (error: unknown) {
      console.error('Error seeding users:', error);
    }
  }

  async getAllProduct(page: number, limit: number) {
    try {
      const currentPage = page || 1;
      const offset = limit || 10;
      const [products, total, categories] = await Promise.all([
        this.productsRepo.find({
          skip: (currentPage - 1) * limit,
          take: offset,
        }),
        this.productsRepo.count(),
        this.productsRepo
          .createQueryBuilder('prod')
          .select('prod.category', 'category')
          .distinct(true)
          .orderBy('prod.category', 'ASC')
          .getRawMany(),
      ]);

      return {
        data: products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
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
