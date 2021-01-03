import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/shared/decorators/user.decorator';
import { UpdateUserDTO } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findByUsername(@User() { username }: UserEntity) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    return { user };
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    data: UpdateUserDTO,
  ) {
    const user = await this.userService.update(username, data);

    if (!user) {
      throw new NotFoundException();
    }
    return { user };
  }
}
