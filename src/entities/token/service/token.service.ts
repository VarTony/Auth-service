import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accessTokenSecret, createJWT, fromBase64Url, refreshTokenSecret, serviceName, tokensParser } from '../constant';
import { RefreshToken } from '../repository';
import { RTBlacklist } from '../repository';
import { Repository } from 'typeorm';


@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(RefreshToken) private readonly rtRepository: Repository<RefreshToken>,
        @InjectRepository(RTBlacklist) private readonly blacklistRepository: Repository<RTBlacklist>
    ) {}


    /**
     * Создает access токен.
     * 
     * @param usersInfo  
     * @returns 
     */
    async createAccessToken(userData: any): Promise<string> {
        let result;
        try {
        const header = { alg: 'HS512', type: 'JWT-ACCESS' };
        const payload = { 
            exp: (Date.now() + 180000),
            roles: userData.roleId,
            iss: 'Auth service'
        };
        result = await createJWT(header, payload, accessTokenSecret);

        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась, - Полностью!';
        }
        return result;
    }


    /**
     * Создает refresh токен.
     * 
     * @param userData 
     * @returns 
     */
    async createRefreshToken(userData: any, devicesInfo: any): Promise<string>{
        let result;
        try {
        // Создает запись токена в базе.
        const rtJWTDbData = await this.rtRepository.create({
            userId: userData.id,
            token: 'plug',
            isActive: true,
            location: devicesInfo.location,
            digitImprint: devicesInfo.digitImprint,
        });
        const { id } = await this.rtRepository.save(rtJWTDbData);
        
        // Формирует токен.
        const header = { alg: 'HS512', type: 'JWT-REFRESH' };
        const payload = {
            jti: id,
            iat: Date.now(),
            exp: (Date.now() + refreshTokenSecret),
            roles: userData.roleId,
            iss: serviceName,
            uid: userData.basicUserId,
            email: userData.email
        };
        const refreshJWT = await createJWT(header, payload, accessTokenSecret);
        
        // Записывает сформированный токен в БД.
        await this.rtRepository.update({ id }, { token: refreshJWT });
        result = refreshJWT;
        } catch(err) {
            console.warn(err);
            result = 'Не удалось сгенерировать JWT-Refresh';
        }
        return result;
    }

    /**
     * Деактивирует refresh токен.
     * 
     * @param id 
     */
    async deactivateRefreshJWT(id: number): Promise<string> {
       let result;
        try {
            await this.rtRepository.update({ id }, { isActive: false, deactivatedAt: new Date() })
            result = `Token ${ id } deactivated`;
        } catch(err) {
            console.warn(err);
            result = `Unable to deactivated token ${ id }`
        }
        return result;
    }


    /**
     * Добавляет refresh токен в черный список.
     * 
     * @param token 
     * @returns 
     */
    async addRtToBlacklist(token: string) {
        let result;
        try {
            const { payload, ...headerAndSignature } = await tokensParser(token);
            const tokenId = JSON.parse(await fromBase64Url(payload))?.jti;
            await this.deactivateRefreshJWT(tokenId);
            await this.blacklistRepository.create({ tokenId });
            
            result = 'Токен был деактивирован и добавлен в черный список.';
        } catch(err) {
            console.warn(err);
            result = 'Ошибка при добавлении токена в черный список.';
        }
        return result;
    }

    private async _blacklistCleaner() {
    }


    async refreshTokensCleaner() {
    }
}
