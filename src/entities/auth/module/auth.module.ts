import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { TokenService, RefreshToken } from '@token/index';
import { DomainService, Domain } from '@domain/index';
import { User, UserService } from '@user/index';
import { Secret, SecretService } from '@secret/index';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Secret, Domain, User])],
  providers: [
    AuthService,
    SecretService,
    TokenService,
    UserService,
    DomainService
  ],
})
export class AuthModule {};
