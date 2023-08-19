import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (config: ConfigService) => ({
                store: redisStore({
                    URL: config.get('redisUri')
                })
            }),
            inject: [ ConfigService ]
         })
    ],
    
})
export class RedisConnection {}