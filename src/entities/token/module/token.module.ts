import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../service';
import { RTBlacklist, RefreshToken } from '../repository';

@Module({
    imports: [ TypeOrmModule.forFeature([ RefreshToken, RTBlacklist ]) ],
    providers: [ TokenService ]
})
export class TokenModule {}