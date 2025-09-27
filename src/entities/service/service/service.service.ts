import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../repository';
import { ServiceData } from '@service/types';
import { DomainService } from '@entities/domain/service/domain.service';
import {
  domainNotFound,
  noAccessToDeactivate,
  serviceIsAlreadyExist,
} from '@service/constant';
import { PasswordHandler } from 'src/utils';

@Injectable()
export class ServicesService {
  private serviceFinder = {
    domain: async (name: string, domainName: string) => {
      const { id } = await this.domain.findDomainByName(domainName);
      return this.repository.findOne({ where: { name, domainId: id } });
    },
    domainId: async (name: string, domainId: number) =>
      this.repository.findOne({ where: { name, domainId } }),
  };

  constructor(
    @InjectRepository(Service) private readonly repository: Repository<Service>,
    private readonly domain: DomainService,
  ) {}

  /**
   * Добавляет новый сервис
   *
   * @param usersInfo
   * @returns
   */
  async addNewService(servicesData: ServiceData): Promise<string> {
    let result;
    const { password, domainName, host, name, ...preparedData } = servicesData;
    try {
      const existDomain = await this.domain.findDomainByName(domainName);
      if (!existDomain) return domainNotFound;
      const isServiceExist = await this.findServiceByNameAndDomainInitial({
        name,
        domainId: existDomain.id,
      });
      if (isServiceExist) return serviceIsAlreadyExist;

      const newService = await this.repository.create({
        domainId: existDomain.id,
        name,
        isActive: true,
        ...preparedData,
      });
      await this.repository.save(newService);

      result = 'Сервис успешно зарегестрирован';
    } catch (err) {
      console.warn(err);
      result =
        err.reason ?? 'Регистрация сервиса не удалась из-за внутреней ошибки.';
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
  async deactivateService(
    name: string,
    domain: string,
    ip: string,
    password: string,
  ) {
    let result;
    try {
      const { id, host, passhash, salt } = await this.domain.findDomainByName(
        domain,
      );
      const isCorrectPass = await PasswordHandler.passChecker({
        passhash,
        password,
        salt,
      });
      if (host !== ip || !isCorrectPass) return noAccessToDeactivate;
      await this.repository.update(
        { name, domainId: id },
        { isActive: false, deactivatedAt: new Date() },
      );
      result = `Сервис ${name}, успешно деактивирован.`;
    } catch (err) {
      console.warn(err);
      result = `Не удалось деактивировать сервис ${name}`;
    }
    return result;
  }

  /*
   * Проверяет есть ли сервис в базе данных.
   *
   * @param authData
   */
  async findServiceByNameAndDomainInitial(data: {
    name: string;
    domainId?: number;
    domain?: string;
  }): Promise<Service | null> {
    let result;
    try {
      const { name, ...domainsInfo } = data;
      const domainsInfoKey = Object.keys(domainsInfo)[0];
      const domainInfoData = domainsInfo[domainsInfoKey];
      const service = await this.serviceFinder[domainsInfoKey](
        name,
        domainInfoData,
      );
      result = service;
    } catch (err) {
      console.warn(err);
      err.reason = 'Внутреняя ошибка при поиске сервиса при регистрации';
      result = null;
    }
    return result;
  }
}
