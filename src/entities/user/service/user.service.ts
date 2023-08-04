import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from '../types';
import { User } from '../repository';
import { DomainService } from '@domain/service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly repository: Repository<User>,
        private readonly domain: DomainService
    ) {}

    /**
     * Создает нового пользователя.
     * 
     * @param data 
     * @returns 
     */
    async createNewUser(data: UserData): Promise<{ result: string, status: number }> {
        let result: string;
        let status: number;
        try {
            const { domainName, id, ...userData } = data;
            const domain = await this.domain.findDomainByName(domainName)
            if(!domain) {
                result = 'Не удалось зарегистрировать пользователя, нет такого домена';
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }
            const nativeUserId = id;
            const existUser = this.getUserByDomainData(nativeUserId, domain.id)

            if(existUser) {
                result = `Пользователь с таким id: ${ nativeUserId } уже существует`;
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }

            const userPreparedData = await this.repository.create({
                domainId: domain.id, 
                nativeUserId,
                ...userData 
            });
            
            const  { 
                passhash,
                salt,
                domainId,
                deactivatedAt,
                ...user 
            }  = await this.repository.save(userPreparedData);
            
            result = `Пользователь ${ user } успешно создан.`;
            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            const { passhash, salt, ...user } = data;

            result = `Не удалось зарегистрировать пользователя: ${ user }`;
            status = HttpStatus.NOT_ACCEPTABLE;
        }
        return { result, status };
    }


    /*
     * Находит пользователя по id домена и базовому id.
     * 
     * @param nativeUserId
     * @param domainId
     * 
     * return { result, status }
     */
    async getUserByDomainData(nativeUserId: number, domainId: number )
        : Promise<{ result: User | { error: Error }, status: number }> {
        let result: User | { error: Error };
        let status: number;
        try {
            const user = await this.repository.findOne({ where: { nativeUserId, domainId } });
            
            result = user;
            status = user ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        } catch(err) {
            console.warn(err);
            result = { error: new Error('Внутреняя ошибка при поиске пользователя для аутентификации') };
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status  };
    }


    async findAllUsers() {
        // await this.repository.delete([1, 2])
        return await this.repository.find();
    }
}
