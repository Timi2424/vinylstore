import { Optional } from '@nestjs/common';
import { IsString, IsDecimal } from 'class-validator';

export class UpdateVinylDto {
  @IsString()
  @Optional()
  name: string;

  @IsString()
  @Optional()
  artist: string;

  @IsString()
  @Optional()
  description: string;

  @IsDecimal()
  @Optional()
  price: number;
}
