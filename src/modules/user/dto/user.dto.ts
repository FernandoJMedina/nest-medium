import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  bio: string;
}
