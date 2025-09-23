import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from '../repository';
import { PasswordHandler } from 'src/core';
import { ResDomainResults } from '@domain/constant';

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);

  constructor(
    @InjectRepository(Domain) private readonly repository: Repository<Domain>,
  ) {}

  /**
   * Регистрирует новый домен для дальнейшей работы.
   *
   * @param domainsData
   * @returns
   */
  async addNewDomain(domainsData): Promise<{ result: string; status: number }> {
    let answer: { result: string; status: number };

    const { password, host, name, secret } = domainsData;
    try {
      const isDomainExist = await this.findDomainByName(name);
      if (isDomainExist) return ResDomainResults.bad.domainAlreadyExists;

      const { passhash, salt } = await PasswordHandler.createPasshashAndSalt(
        password,
      );
      const domain = await this.repository.create({
        name,
        passhash,
        salt,
        secret,
        host,
        isActive: true,
      });
      await this.repository.save(domain);
      answer = ResDomainResults.good.domainSuccessAdded;
    } catch (err) {
      this.logger.error(err);
      answer = ResDomainResults.bad.errorDuringRegistration;
    }
    return answer;
  }


  /**
   * Обновляет данные существующего домена.
   *
   * @param name - имя домена (уникальный ключ)
   * @param updateData - поля для обновления (host, password, secret)
   * @returns
   */
  async updateDomain(
    name: string,
    updateData: Partial<{ host: string; password: string; secret: string }>
  ): Promise<{ result: string; status: number }> {
    let answer: { result: string; status: number };

    try {
      const domain = await this.findDomainByName(name);
      if (!domain) return ResDomainResults.bad.domainNotFound;

      // При смене пароля → пересоздаёт passhash и salt
      if (updateData.password) {
        const { passhash, salt } = await PasswordHandler.createPasshashAndSalt(
          updateData.password,
        );
        domain.passhash = passhash;
        domain.salt = salt;
        delete updateData.password;
      }

      // Обновление остальных полей
      if (updateData.host) domain.host = updateData.host;
      if (updateData.secret) domain.secret = updateData.secret;

      await this.repository.save(domain);
      answer = ResDomainResults.good.domainSuccessUpdated;
    } catch (err) {
      this.logger.error(err);
      answer = ResDomainResults.bad.errorDuringUpdating;
    }

    return answer;
  }


  /**
   * Деактивирует домен по его имени.
   *
   * @param name
   * @returns
   */
  async deactivateDomain(
    name: string,
  ): Promise<{ result: string; status: number }> {
    let answer: { result: string; status: number };
    try {
      await this.repository.update(
        { name },
        { isActive: false, deactivatedAt: new Date() },
      );
      answer = ResDomainResults.good.domainSuccessDeactivated(name);
    } catch (err) {
      this.logger.error(err);
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
    await this.repository.findOne({ where: { id }, cache: true });

  
  /**
   * Находит запись о домене по имени.
   *
   *
   * @param name
   * @returns
   */
  findDomainByName = async (name: string) =>
    await this.repository.findOne({ where: { name }, cache: true });


  /**
   * Проверяет домен на существование и пришедший пароль
   * 
   * 
   * @param name 
   * @param password 
   * @returns 
   */
  async isPasswordValid(name: string, password: string):Promise<boolean> {
    const domain = await this.findDomainByName(name);
    if (!domain) return false;
    
    return PasswordHandler.passChecker({
      password,
      passhash: domain.passhash,
      salt: domain.salt
    });
  }
}
