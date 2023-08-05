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
            const { domainName, login, id, ...userData } = data;
            const domain = await this.domain.findDomainByName(domainName)
            if(!domain) {
                result = 'Не удалось зарегистрировать пользователя, нет такого домена';
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }
            const nativeUserId = id;
            const existUser = this.getUserByDomainData(login, domain.id)

            if(existUser) {
                result = `Пользователь с таким id: ${ nativeUserId } уже существует`;
                status = HttpStatus.BAD_REQUEST;
                return { result, status };
            }

            const userPreparedData = await this.repository.create({
                login,
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
    getUserByDomainData = async(login: string, domainId: number ) => await this.repository.findOne({ where: { login, domainId } });


    /**
     *  Находит пользователя по id.
     * 
     * 
     * @param id 
     * @returns 
     */
    findUserById = async (id: number) => await this.repository.findOne({ where: {id} });


    /**
     * Используется в тестировании.
     * 
     * 
     * @returns 
     */
    async findAllUsers() {
        // await this.repository.delete([1, 2])
        return await this.repository.find();
    }
}
