import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../repository';
import { PasswordHandler } from 'src/utility_classes';
import { ResDomainResults } from '@domain/constant';

@Injectable()
export class DomainService {
    constructor(
        @InjectRepository(Domain) private readonly repository: Repository<Domain>
    ) {}

    /**
     * Регистрирует новый домен для дальнейшей работы.
     * 
     * @param domainsData 
     * @returns 
     */
    async addNewDomain(domainsData): Promise<string> {
        let result;
        const { password, host, name, } = domainsData;
        try {
        const isDomainExist = await this.findDomainByName(name);
        if(isDomainExist) return ResDomainResults.bad.domainAlreadyExists;

        const { passhash, salt } = await PasswordHandler.createPasshashAndSalt(password);
        const domain = await this.repository.create({ 
            name,
            passhash,
            salt,
            host,
            isActive: true
        })
        await this.repository.save(domain);
        result = ResDomainResults.good.domainSuccessAdded;
        } catch(err) {
            console.warn(err);
            result = ResDomainResults.bad.errorDuringRegistration;
        }
        return result;
    }

    /** 
     * Деактивирует домен по его имени.
     * 
     * @param name 
     * @returns 
     */
    async deactivateDomain(name: string) {
        let result;
        try {
            await this.repository.update({ name }, { isActive: false, deactivatedAt: new Date() });
            result = ResDomainResults.good.domainSuccessDeactivated(name);
        } catch(err) {
            console.warn(err);
            result = ResDomainResults.bad.errorDuringDeactivation(name);
        }
        return result;
    }


    findDomainById = async (id: number) => await this.repository.findOne({ where: { id }}) 


    /**
     * Находит запись о домене по имени.
     * 
     * @param name 
     * @returns 
     */
    findDomainByName = async (name: string) => await this.repository.findOne({ where: { name }});
}