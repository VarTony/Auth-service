import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accessTokenExpiration, accessTokenSecret, createJWT, deactivateDispatcher, fromBase64Url, jwtSignatureCreator, refreshTokenExpiration, refreshTokenSecret, serviceName, tokensParser } from '../constant';
import { RefreshToken } from '../repository';
import { Repository } from 'typeorm';
import { User } from '@user/repository';
import { JwtPair } from '@token/types/jwt.type';
import { ResultOfTokenVerification } from '@token/types';
import { DigitImprint } from '@auth/types/service.type';

type CreatingTokensData = { 
    userId: number,
    nativeUserId: number,
    domainName: string,
    roleId?: number 
}

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(RefreshToken) private readonly repository: Repository<RefreshToken>
    ) {}

    /**
     * Создает access токен.
     * 
     * @param usersInfo  
     * @returns 
     */
    async createAccessToken(jti, data: CreatingTokensData): Promise<string | null> {
        const { userId, nativeUserId, domainName, roleId } = data;
        const header = { alg: 'HS512', type: 'JWT-ACCESS' };
        const payload = { 
            uid: userId,
            nuid: nativeUserId,
            roles: roleId ?? 'roleId',
            dmn: domainName,
            iss: serviceName,
            jti,
            exp: (Date.now() + accessTokenExpiration)
        };
        return await createJWT(header, payload, accessTokenSecret);
    }


    /**
     * Создает refresh токен.
     * 
     * 
     * @param userData 
     * @returns 
     */
    async createRefreshToken(
         data: CreatingTokensData,
         devicesInfo: { location: string, userAgent: string }
        ): Promise<string>{
        const { userId, nativeUserId } = data;
        const { location, userAgent } = devicesInfo;
        // Создает запись токена в базе.
        const rtJWTDbData = await this.repository.create({
            userId,
            token: 'plug',
            isActive: true,
            location,
            userAgent
        });
        const { id } = await this.repository.save(rtJWTDbData);
        
        // Формирует токен.
        const header = { alg: 'HS512', type: 'JWT-REFRESH' };
        const payload = {
            jti: id,
            iat: Date.now(),
            exp: (Date.now() + refreshTokenExpiration),
            iss: serviceName,
            uid: nativeUserId, 
        };
        const refreshJWT = await createJWT(header, payload, refreshTokenSecret);
        
        // Записывает сформированный токен в БД.
        await this.repository.update({ id }, { token: refreshJWT });
        return refreshJWT;
    }


    /**
     * Создает пару JWT токенов.
     * 
     * 
     * @param data 
     * @returns 
     */
    async createJWTPair(data: CreatingTokensData, digitImprint: DigitImprint): 
        Promise<JwtPair> {
        const refreshToken = await this.createRefreshToken(data, digitImprint);
        const { jti } = (await tokensParser(refreshToken)).map?.payload;
        const accessToken = await this.createAccessToken(jti, data);

        return { refreshToken, accessToken };
    }


    /**
     * Деактивирует refresh токен.
     * 
     * @param id 
     */
    async deactivateRefreshJWT(id: number): Promise<{ result: string, status: number }> {
       let result: string;
       let status: number;
        try {
            const updated = await this.repository.update({ id }, { isActive: false });
            if(!updated) {
                result = 'Не удалось деактивировать, токен не найден.';
                status = HttpStatus.NOT_FOUND;
            }
            result = 'Токен был успешно деактивирован';
            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            result = 'Не удалось провести деактивацию из-за внутреней ошибки.';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status };
    }


    /**
     * Верефицирует refresh token.
     * 
     * 
     * @param rt 
     * @param digitImprint 
     * @returns 
     */
    verificateRT = async (rt: string, digitImprint: DigitImprint): Promise< ResultOfTokenVerification > => {
        const { str, map } = (await tokensParser(rt));
        const { header, payload, signature } = str;
        const { jti } = map.payload;
        const isCorrectSignature = signature === (await jwtSignatureCreator(header, payload, refreshTokenSecret));
        if(!isCorrectSignature) return 'Fake_Token';

        const token = await this.findRTById(jti);
        const { location, userAgent } = digitImprint;
        const isChangedDevice = token.location !==  location && userAgent !== token.userAgent;
        if(!token) return 'Not_Found';
        if(!token.isActive) return 'Token_Expired';
        if(isChangedDevice) return 'Atypical_Device_Data';

        return 'Ok';
    }


    /**
     * Ищет токен по его id.
     * 
     * 
     * @param id 
     * @returns 
     */
    findRTById = async (id: number) => await this.repository.findOne({ where: { id }});


    async refreshTokensCleaner() {
    }
}
