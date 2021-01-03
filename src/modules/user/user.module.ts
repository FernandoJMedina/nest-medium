import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}
