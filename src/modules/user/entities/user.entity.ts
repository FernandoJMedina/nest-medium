import { classToPlain, Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany((type) => UserEntity, (user) => user.followee)
  @JoinTable()
  followers: UserEntity[];

  @ManyToMany((type) => UserEntity, (user) => user.followers)
  followee: UserEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }

  toProfile(user: UserEntity) {
    const following = this.followers.includes(user);
    const profile = this.toJSON();
    delete profile['followers'];
    return { ...profile, following };
  }
}
