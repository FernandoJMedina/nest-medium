import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async update(username: string, data: UpdateUserDTO) {
    await this.userRepo.update({ username }, data);
    return await this.findByUsername(username);
  }

  async followUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers.push(currentUser);
    await user.save();
    return user.toProfile(currentUser);
  }

  async unfollowUser(currentUser: UserEntity, username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['followers'],
    });
    user.followers = user.followers.filter(
      (follower) => follower !== currentUser,
    );
    await user.save();
    return user.toProfile(currentUser);
  }
}
