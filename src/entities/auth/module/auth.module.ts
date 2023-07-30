import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '..';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '@auth/repository/auth.user.repository';

@Module({
    imports: [ TypeOrmModule.forFeature([ AuthUser ]) ],
    providers: [ JwtService, AuthService ]
})
export class AuthModule {}