import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { TokenModule, RefreshToken } from '@token/index';
import { DomainService, Domain } from '@domain/index';
import { User, UserService } from '@user/index';
import { Secret, SecretService } from '@secret/index';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Secret, Domain, User]), TokenModule],
  providers: [
    AuthService,
    SecretService,
    UserService,
    DomainService
  ],
})
export class AuthModule {};
