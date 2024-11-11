import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the user', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Birthdate of the user', required: false })
  @IsOptional()
  @IsDateString()
  birthdate?: string | Date;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
