import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO, RegisterDTO } from './models/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username or email has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(credentials: LoginDTO) {
    const { email, password } = credentials;
    let user: UserEntity;
    try {
      user = await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (user && (await user.comparePassword(password))) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
