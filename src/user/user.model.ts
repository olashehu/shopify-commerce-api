import { OrderModel } from 'src/orders/order.model';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  password: string;

  @OneToMany(() => OrderModel, (order) => order.user)
  user: OrderModel[];

  @CreateDateColumn()
  createdAt: Date;
}
