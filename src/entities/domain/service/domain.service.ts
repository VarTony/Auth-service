import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceData } from '@service/types';
import { Domain } from '../repository';
import { PasswordHandler } from 'src/utility_classes';

@Injectable()
export class DomainService {
    constructor(
        @InjectRepository(Domain) private readonly repository: Repository<Domain>
    ) {}


    async addNewDomain(domainsData): Promise<string> {
        let result;
        const { password, host, name, } = domainsData;
        try {
        const isDomainExist = await this.findDomainByName(name);
        if(isDomainExist) return 'Домен с таким именем уже существует';

        const { passhash, salt } = await PasswordHandler.createPasshashAndSalt(password);
        const domain = await this.repository.create({ 
            name,
            passhash,
            salt,
            host,
            isActive: true
        })
        await this.repository.save(domain);
        result = 'Домен был успешно зарегистрирован.'
        } catch(err) {
            console.warn(err);
            result = 'Произошла ошибка при регистрации домена, попробуйте позже или обратитесь к администратору';
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
    async deactivateDomain(name: string) {
        let result;
        try {
            await this.repository.update({ name }, { isActive: false, deactivatedAt: new Date() });
            result = `Домен ${ name }, успешно деактивирован.`;
        } catch(err) {
            console.warn(err);
            result = `Не удалось деактивировать домен ${ name }`;
        }
        return result;
    }


    /**
     * Находит запись о домене по имени.
     * 
     * @param name 
     * @returns 
     */
    async findDomainByName(name: string): Promise<Domain> {
        const domain = await this.repository.findOne({ where: { name }});

        return domain;
    }
}