import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get(':username')
  async findProfile(@Param('username') username: string) {
    const profile = await this.userService.findByUsername(username);
    if (!profile) {
      throw new NotFoundException();
    }

    return { profile };
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard('jwt'))
  async followUser(
    @User() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.followUser(currentUser, username);
    return { profile };
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard('jwt'))
  async unfollowUser(
    @User() currentUser: UserEntity,
    @Param('username') username: string,
  ) {
    const profile = await this.userService.unfollowUser(currentUser, username);
    return { profile };
  }
}
