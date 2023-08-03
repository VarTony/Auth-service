import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { AuthUser } from '@auth/repository/auth.user.repository';
import { TokenService } from '@token/service';
import { ServicesService } from '@service/service';
import { RTBlacklist, RefreshToken } from '@token/repository';
import { Service } from '@service/repository';
import { DomainService } from '@domain/service';
import { Domain } from '@domain/repository';

@Module({
    imports: [ TypeOrmModule.forFeature([ AuthUser, RTBlacklist, RefreshToken, Service, Domain ]) ],
    providers: [ AuthService, TokenService, ServicesService, DomainService ]
})
export class AuthModule {}