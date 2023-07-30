import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { Repository } from 'typeorm';
import { logUserData, passData } from '../types';
import { AuthUser } from '@auth/repository/auth.user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthUser) private readonly userRepo: Repository<AuthUser>,
        private readonly jwtService: JwtService
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
            const isCorrectPass = await this._passChecker({ password, salt, passhash });
        
            if(isCorrectPass) {
                const payload = { 
                    exp: (Date.now() + 180000),
                    roles: roleId,
                    iss: 'auth service'
                }
                result = await this.jwtService.signAsync(payload);
            }
            else result = 'Неверный логин или пароль';
        } catch(err) {
            console.warn(err);
            result = 'Аутентификация: Полностью провалилась ';
        }
        return result;
    }


    /*
     * Находит пользователя по id сервиса и базовому id.
     * 
     * @param authData
     */
    private async _getUserByAuthData(logUserData: { basicUserId, serviceId }): Promise<AuthUser|null> {
        let result;
        try {
            const user = await this.userRepo.findOne({ where: logUserData });
            result = user;
        } catch(err) {
            console.warn(err);
            err.reason = 'Внутреняя ошибка при поиске пользователя для аутентификации';
            result = null;
        }
        return result;
    }


    /**
     * Внутрений метод проверки паролей.
     * 
     * @param usersInfo 
     * @returns 
     */
    private async _passChecker(passData: passData): Promise<boolean|null> {
        let result;
        try{
            const passhash = await crypto.createHash('sha512')
             .update(`${ passData.password }.${ passData.salt }`)
             .digest('hex');

             result = passhash === passData.passhash;
        } catch(err) {
            console.warn(err);
            err.reason = 'Аутентификация: внутреняя ошибка при проверке пароля';
            result = null;
        }
        return result;
    }
}
