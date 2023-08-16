import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { TokenService } from '@token/service';
import { RefreshToken } from '@token/repository';
import { DomainService } from '@domain/service';
import { Domain } from '@domain/repository';
import { User } from '@user/repository';
import { UserService } from '@user/index';
import { SecretService } from '@secret/service/secret.service';
import { Secret } from '@secret/repository';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Domain, User, Secret])],
  providers: [
    AuthService,
    TokenService,
    UserService,
    DomainService,
    SecretService,
  ],
})
export class AuthModule {}
