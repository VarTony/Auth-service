import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from '../types';
import { AuthUser } from '../repository';
import { TokenService } from '@token/service';
import { ServicesService } from '@service/service';
import { PasswordHandler } from '@utility_classes/index';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthUser) private readonly repository: Repository<AuthUser>,
        private readonly token: TokenService,
        private readonly service: ServicesService
    ) {}


    /**
     * Основной метод аутентификации.
     * 
     * @param usersInfo  
     * @returns 
     */
    async singIn(logUserData: any, password: string): Promise<any | string> {
        let result;
        try {
            const user = await this._getUserByAuthData(logUserData);
            const { salt, roleId, passhash } = user;
            const isCorrectPass = await PasswordHandler.passChecker({ password, salt, passhash });
        
            if(isCorrectPass) {
                const payload = { 
                    exp: (Date.now() + 180000),
                    roles: roleId,
                    iss: 'auth service'
                }
                // result = await this.jwtService.signAsync(payload);
            }
            else result = 'Неверный логин или пароль';
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась ';
        }
        return result;
    }



    async createNewUser(data: UserData) {
        let result;

        try {
            const service = await this.service.findServiceByNameAndDomainInitial({ name: data.service, domain: data.domain })
            if(!service) return 'Не удалось зарегистрировать пользователя, нет такого домена или сервиса';
            const userData = await this.repository.create(data);
            const user = await this.repository.save(userData);
            const jwtRt = await this.token.createRefreshToken(user, { location: 'location', digitImprint: 'digitImprint' });
            // ...


        } catch(err) {


        }
    }


    /*
     * Находит пользователя по id сервиса и базовому id.
     * 
     * @param authData
     */
    private async _getUserByAuthData(logUserData: { basicUserId, serviceId }): Promise<AuthUser|null> {
        let result;
        try {
            const user = await this.repository.findOne({ where: logUserData });
            result = user;
        } catch(err) {
            console.warn(err);
            err.reason = 'Внутреняя ошибка при поиске пользователя для аутентификации';
            result = null;
        }
        return result;
    }
}
