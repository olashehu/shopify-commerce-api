import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from 'src/user/user.model';

@Entity()
export class OrderModel {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
