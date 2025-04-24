import { OrderModel } from 'src/orders/order.model';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class ProductsModel {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  category: string;

  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  status: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @OneToMany(() => OrderModel, (order) => order.product)
  orders: OrderModel[];

  @CreateDateColumn()
  createdAt: Date;
}
