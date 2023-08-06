import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '@secret/repository';

@Module({
    imports: [ TypeOrmModule.forFeature([ Secret ]) ],
    providers: [  ]
})
export class SecretModule {}
