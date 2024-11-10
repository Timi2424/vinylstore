import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateVinylDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
