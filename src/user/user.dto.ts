import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  IsEnum,
  MinLength,
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

  @IsPhoneNumber('NG')
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: string;

  @IsNotEmpty()
  @IsString({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
