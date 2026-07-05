import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'alireza@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: 'Alireza'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'strongPassword123'
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
