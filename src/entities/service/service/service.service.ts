import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../repository';
import { ServiceData } from '@service/types';
import { createPasshashAndSalt } from '@service/constant/creater.passhash.const';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private readonly repository: Repository<Service>,
    ) {}


    /**
     * Добавляет новый сервис
     * 
     * @param usersInfo  
     * @returns 
     */
    async addNewService(servicesData: ServiceData): Promise<string> {
        let result;
        const { password, ...preparedData } = servicesData;
        const { passhash, salt } = await createPasshashAndSalt(password);
        const isServiceAlreadyExist = await this._isServiceAlreadyExist(preparedData.name, preparedData.domain);
        try {
            if(isServiceAlreadyExist) {
                return 'Регистрация не удалась, указанный сервис уже существует.';
            }
        const newService = await this.repository.create({ 
            passhash,
            salt,
            isActive: true,
            ...preparedData 
        });
        await this.repository.save(newService);
        result = 'Сервис успешно зарегестрирован';
        } catch(err) {
            console.warn(err); 
            result = err.reason ?? 'Регистрация сервиса не удалась из-за внутреней ошибки.';
        }
        return result;
    }


    /** 
     * Деактивирует сервис по его имени и домену.
     * 
     * @param name 
     * @param domain 
     * @returns 
     */
    async deactivateService(name: string, domain: string) {
        let result;
        try {
            await this.repository.update({ name, domain }, { isActive: false });
            result = `Сервис ${ name }, успешно деактивирован.`;
        } catch(err) {
            console.warn(err);
            result = `Не удалось деактивировать сервис ${ name }`;
        }
        return result;
    }


    /*
     * Проверяет есть ли сервис в базе данных.
     * 
     * @param authData
     */
    private async _isServiceAlreadyExist(name: string, domain: string): Promise<boolean|null> {
        let result;
        try {
            const user = await this.repository.findOne({ where: { name, domain } });
            result = !!user;
        } catch(err) {
            console.warn(err);
            err.reason = 'Внутреняя ошибка при поиске сервиса при регистрации';
            result = null;
        }
        return result;
    }
}