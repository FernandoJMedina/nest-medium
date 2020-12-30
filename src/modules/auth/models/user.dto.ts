import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
