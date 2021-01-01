import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/shared/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO, RegisterDTO } from '../../shared/users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(credentials: RegisterDTO) {
    try {
      const user = this.userRepo.create(credentials);
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      await user.save();
      return { user: { ...user.toJSON(), token } };
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
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return { user: { ...user.toJSON(), token } };
    }
    throw new UnauthorizedException();
  }
}
