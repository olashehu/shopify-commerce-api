import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsEnum,
  // MinLength,
} from 'class-validator';
import { UserRole } from './user.model';

export class UserDTO {
  @IsOptional()
  @IsString()
  id: number;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
