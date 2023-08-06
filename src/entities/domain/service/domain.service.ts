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
    async addNewDomain(domainsData): Promise<{ result: string, status: number }> {
        let answer: { result: string, status: number };
        
        const { password, host, name, secret } = domainsData;
        try {
        const isDomainExist = await this.findDomainByName(name);
        if(isDomainExist) return ResDomainResults.bad.domainAlreadyExists;

        const { passhash, salt } = await PasswordHandler.createPasshashAndSalt(password);
        const domain = await this.repository.create({ 
            name,
            passhash,
            salt,
            secret,
            host,
            isActive: true
        })
        await this.repository.save(domain);
        answer = ResDomainResults.good.domainSuccessAdded;
        } catch(err) {
            console.warn(err);
            answer = ResDomainResults.bad.errorDuringRegistration;
        }
        return answer;
    }

    /** 
     * Деактивирует домен по его имени.
     * 
     * @param name 
     * @returns 
     */
    async deactivateDomain(name: string): Promise<{ result: string, status: number }> {
        let answer: { result: string, status: number };
        try {
            await this.repository.update({ name }, { isActive: false, deactivatedAt: new Date() });
            answer = ResDomainResults.good.domainSuccessDeactivated(name);
        } catch(err) {
            console.warn(err);
            answer = ResDomainResults.bad.errorDuringDeactivation(name);
        }
        return answer;
    }


    /**
     * Находит запись о домене по id.
     * 
     * 
     * @param id 
     * @returns 
     */
    findDomainById = async (id: number) => 
        await this.repository.findOne({ where: { id }, cache: true }) 


    /**
     * Находит запись о домене по имени.
     * 
     * 
     * @param name 
     * @returns 
     */
    findDomainByName = async (name: string) => 
        await this.repository.findOne({ where: { name }, cache: true });
}