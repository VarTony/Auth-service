import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../repository';
import { UserService } from '../service/user.service';
import { UserController } from '@user/controller/user.controller';
import { DomainService, Domain } from '@domain/index';

@Module({
  imports: [TypeOrmModule.forFeature([Domain, User])],
  controllers: [UserController],
  providers: [UserService, DomainService]
})
export class UserModule {}
