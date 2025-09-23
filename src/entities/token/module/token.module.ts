import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../service';
import { RefreshToken, TokenRepository } from '../repository';
import { SecretService, Secret } from '@secret/index';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Secret])],
  providers: [TokenService, TokenRepository, SecretService, ConfigService],
  exports: [TokenService]
})
export class TokenModule {}
