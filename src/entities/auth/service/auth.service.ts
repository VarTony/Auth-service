import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '@token/service';
import { PasswordHandler } from '@utility_classes/index';
import { UserService } from '@user/index';
import { DomainService } from '@domain/service';
import { JwtPair } from '@token/types/jwt.type';
import { tokensParser } from '@token/constant';
import { isValidationOk, validationRTBadResult, validationRTOkResult } from '@auth/constant';
import { DigitImprint } from '@auth/types/service.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly user: UserService,
        private readonly token: TokenService,
        private readonly domain: DomainService
    ) {}

    /**
     * Обрабатывает локгику входа.
     * 
     * 
     * @param usersInfo  
     * @returns 
     */
    async singIn(
        domainName: string,
        login: string,
        password: string,
        digitImprint: { location: string,  userAgent: string } 
        ): Promise<{ result: JwtPair | string, status: number }> 
        {
        let result: JwtPair | string;
        let status: number;
        try {
            const domain = await this.domain.findDomainByName(domainName);
            if(!domain) {
                result = `Домен с именем ${ domainName } не был найден;`
                status = HttpStatus.NOT_FOUND;
                return { result, status };
            }

            const user = await this.user.getUserByDomainData(login, domain.id);
            const { salt, passhash } = user;
            const isCorrectPass = await PasswordHandler.passChecker({ password, salt, passhash });
            
            if(!isCorrectPass) {
                result = 'Неверный логин или пароль.';
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }
            const { id, roleId, nativeUserId  } = user ;
            result = await this.token.createJWTPair({ userId: id, domainName, nativeUserId, roleId }, digitImprint);
            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась - полностью!';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status };
    }


    /**
     * Обновляет JWT пару.
     * 
     * 
     * @param rt 
     * @param digitImprint 
     * @returns 
     */
    async updateJWTPair(rt: string, digitImprint: DigitImprint): Promise<{ result: JwtPair | string, status: number }> {
        let result: JwtPair | string;
        let status: number;
        try {
            const resultOfVerification = await this.token.verificateRT(rt, digitImprint);
            if(!isValidationOk(resultOfVerification)) 
                return validationRTBadResult[resultOfVerification];

            validationRTOkResult[resultOfVerification]()
            const { uid } = (await tokensParser(rt)).map.payload;
            const { roleId, domainId, nativeUserId } = await this.user.findUserById(uid);
            const domain = await this.domain.findDomainById(domainId);

            result = await this.token.createJWTPair({ 
                userId: uid,
                domainName: domain.name,
                roleId,
                nativeUserId
            }, digitImprint);

            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            result = 'Токены ушли гулять';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status };
    }
}
