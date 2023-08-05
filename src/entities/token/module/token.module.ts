import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../service';
import { RefreshToken } from '../repository';

@Module({
    imports: [ TypeOrmModule.forFeature([ RefreshToken ]) ],
    providers: [ TokenService ]
})
export class TokenModule {}