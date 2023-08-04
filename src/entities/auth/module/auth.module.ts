import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { TokenService } from '@token/service';
import { RTBlacklist, RefreshToken } from '@token/repository';
import { DomainService } from '@domain/service';
import { Domain } from '@domain/repository';
import { User } from '@user/repository';
import { UserService } from '@user/index';

@Module({
    imports: [ TypeOrmModule.forFeature([ RTBlacklist, RefreshToken, Domain, User ]) ],
    providers: [ AuthService, TokenService, UserService, DomainService ]
})
export class AuthModule {}