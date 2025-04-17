import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsDecimal,
  ValidateNested,
  IsDateString,
  IsEmail,
  IsNumberString,
} from 'class-validator';

export class DimensionsDTO {
  @IsDecimal()
  width: number;

  @IsDecimal()
  height: number;

  @IsDecimal()
  depth: number;
}

class ReviewsDTO {
  @IsNumber()
  rating: number;

  @IsString()
  comment: string;

  @IsDateString()
  date: string;

  @IsString()
  reviewerName: string;

  @IsEmail()
  reviewerEmail: string;
}

class MetaDTO {
  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsNumberString()
  barcode: string;

  @IsString()
  qrCode: string;
}

export class RawProductFromAPI {
  @IsOptional()
  @IsString()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsDecimal()
  price: number;

  @IsDecimal()
  discountPercentage: number;

  @IsDecimal()
  rating: number;

  @IsNumber()
  stock: number;

  @IsArray()
  tags: string[];

  @IsString()
  brand: string;

  @IsString()
  sku: string;

  @IsNumber()
  weight: number;

  @ValidateNested()
  @Type(() => DimensionsDTO)
  dimension: DimensionsDTO;

  @IsString()
  warrantyInformation: string;

  @IsString()
  shippingInformation: string;

  @IsString()
  availabilityStatus: string;

  reviews: ReviewsDTO[];

  @IsString()
  returnPolicy: string;

  @IsNumber()
  minimumOrderQuantity: number;

  meta: MetaDTO;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  thumbnail: string;
}

export class SelectedProductDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsDecimal()
  price: number;

  @IsNumber()
  stock: number;

  @IsString()
  status: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsDateString()
  createdAt?: string;
}
