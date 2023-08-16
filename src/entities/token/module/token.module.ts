import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../service';
import { RefreshToken } from '../repository';
import { SecretService, Secret } from '@secret/index';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken, Secret])],
  providers: [TokenService, SecretService]
})
export class TokenModule {}
