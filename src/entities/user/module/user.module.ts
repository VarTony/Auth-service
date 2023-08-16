import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../repository';
import { UserService } from '../service/user.service';
import { DomainService } from '@domain/service';
import { Domain } from '@domain/repository/domain.repositoty';
import { UserController } from '@user/controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Domain, User])],
  controllers: [UserController],
  providers: [UserService, DomainService],
})
export class UserModule {}
