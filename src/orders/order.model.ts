import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from 'src/user/user.model';
import { ProductsModel } from 'src/products/products.model';

@Entity()
export class OrderModel {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ProductsModel)
  product: ProductsModel;

  @Column()
  status: string;

  @Column({ nullable: false })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
