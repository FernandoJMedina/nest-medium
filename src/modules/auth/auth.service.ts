import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './models/user.dto';

@Injectable()
export class AuthService {
  private mockUser = {
    email: 'jake@jake.com',
    token: 'jwt.token.here',
    username: 'jake',
    bio: 'Im dev',
    image: null,
  };

  register(credentials: RegisterDTO) {
    return this.mockUser;
  }

  login(credentials: LoginDTO) {
    if (credentials.email === this.mockUser.email) {
      return this.mockUser;
    }

    throw new InternalServerErrorException();
  }
}
