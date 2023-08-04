import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '@token/service';
import { PasswordHandler } from '@utility_classes/index';
import { User, UserService } from '@user/index';
import { Domain } from '@domain/repository';
import { DomainService } from '@domain/service';

@Injectable()
export class AuthService {
    constructor(
        private readonly user: UserService,
        private readonly token: TokenService,
        private readonly domain: DomainService
    ) {}

    /**
     * Основной метод аутентификации.
     * 
     * @param usersInfo  
     * @returns 
     */
    async singIn(domainName: string, nativeUserId: number, password: string): Promise<{ result: string, status: number }> {
        let result: string;
        let status: number;
        try {
            const domain = await this.domain.findDomainByName(domainName);
            if(!domain) {
                result = `Домен с именем ${ domainName } не был найден;`
                status = HttpStatus.NOT_FOUND;
                return { result, status };
            }

            const user = (await this.user.getUserByDomainData(nativeUserId, domain.id)).result;
            const { salt, passhash } = user as User;
            const isCorrectPass = await PasswordHandler.passChecker({ password, salt, passhash });
            
            if(!isCorrectPass) {
                result = 'Неверный пароль.';
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }  
            result = await this.token.createRefreshToken(user as User, { location: 'plug',  digitImprint: 'plug' })
            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась!';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status };
    }
}
