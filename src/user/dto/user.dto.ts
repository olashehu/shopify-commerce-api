import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  // MinLength,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
