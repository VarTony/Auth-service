import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../service';
import { RefreshToken } from '../repository';
import { Secret } from '@secret/repository';
import { SecretService } from '@secret/service/secret.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Secret])],
  providers: [TokenService, SecretService],
})
export class TokenModule {}
