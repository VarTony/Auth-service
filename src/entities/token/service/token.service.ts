import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { Repository } from 'typeorm';
// import { logUserData, passData } from '../types';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService
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
        const payload = { 
            exp: (Date.now() + 180000),
            roles: userData.roleId,
            iss: 'auth service'
        }
        result = await this.jwtService.signAsync(payload);
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась ';
        }
        return result;
    }


    async createRefreshToken() {

    }


    async addRtToBlacklist() {

    }
}
