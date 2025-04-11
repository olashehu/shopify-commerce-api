// import { IsMobilePhone } from 'class-validator';
import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SELLER = 'seller',
}

@Entity()
export class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
