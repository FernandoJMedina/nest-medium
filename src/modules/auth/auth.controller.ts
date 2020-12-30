import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './models/user.dto';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  register(@Body(ValidationPipe) credentials: RegisterDTO) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body(ValidationPipe) credentials: LoginDTO) {
    return this.authService.login(credentials);
  }
}
