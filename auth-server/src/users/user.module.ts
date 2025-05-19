import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/users.controller';
import { MongooseUserRepository } from './infra/mongoose-user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.schema';

export const userRepository = {
  provide: 'USER_REPOSITORY',
  useClass: MongooseUserRepository,
}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    userRepository,
  ],
  exports: [userRepository, MongooseModule],
})
export class UserModule {} 