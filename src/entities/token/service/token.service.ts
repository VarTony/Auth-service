import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { accessTokenSecret, jwtSignatureCreator, toBase64 } from '@token/constants';
import { toBase64Url } from '@token/constants/base64.creator.constant';
import { RefreshToken } from '@token/repository/refresh.token.repository';
import { RTBlacklist } from '@token/repository/rt.blacklist.repository';
import * as crypto from 'node:crypto';
import { Repository } from 'typeorm';


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(RefreshToken) private readonly rtRepo: Repository<RefreshToken>,
        @InjectRepository(RTBlacklist) private readonly blacklistRepo: Repository<RTBlacklist>
    ) {}


    /**
     * Основной метод аутентификации.
     * 
     * @param usersInfo  
     * @returns 
     */
    async createAccessToken(userData: any): Promise<any | string> {
        let result;
        try {
        const header = { alg: 'HS512', type: 'JWT-ACCESS' };
        const payload = { 
            exp: (Date.now() + 180000),
            roles: userData.roleId,
            iss: 'Auth service'
        };
        const headerInBase64 = toBase64Url(header);
        const payloadInBase64 = toBase64Url(payload);
        const signature = jwtSignatureCreator(headerInBase64, payloadInBase64, accessTokenSecret);
        const jsonWebToken = [ headerInBase64, payloadInBase64, signature ].join('.');
        result = jsonWebToken;
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась, - Полностью!';
        }
        return result;
    }


    async blacklistCleaner() {
    }


    refreshTokensCleaner() {
    }


    async createRefreshToken() {
        // this.jwtService.
    }


    async addRtToBlacklist() {
    }
}
