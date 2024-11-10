import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the user', required: false })
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Birthdate of the user', required: false })
  @IsDateString()
  birthdate?: string | Date;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  @IsString()
  avatar?: string;
}
