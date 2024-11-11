import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Auth0 unique ID for the user' })
  @IsNotEmpty()
  @IsString()
  auth0Id: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

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

  @ApiProperty({ description: 'URL of the user’s avatar', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Role of the user', enum: ['user', 'admin'], default: 'user', required: false })
  @IsOptional()
  @IsString()
  role?: 'user' | 'admin';
}
