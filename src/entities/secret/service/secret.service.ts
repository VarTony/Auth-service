import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '../repository';
import { Interval } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretService implements OnModuleInit {
  private readonly logger = new Logger(SecretService.name);
  private readonly tempAccessSecretLivetimeInMs: number;

  constructor(
    @InjectRepository(Secret) private readonly repository: Repository<Secret>,
    @Inject(CACHE_MANAGER) private readonly cacheStorage: Cache,
    private readonly config: ConfigService
  ) {
    this.tempAccessSecretLivetimeInMs = this.config.get('tempAccessSecretLivetimeInMs');
  }


  /**
   * Метод для запуска генерации временного ключа при запуске приложения.
   */
  async onModuleInit() {
    this.logger.log('Secret service bootstrapped')
    // try {
    //   const tempSecret = await this.repository.findOne
    //     ({ 
    //       where: { expireAt: MoreThan(Date.now()) },
    //       order: { id: 'DESC' } 
    //     });
    //   if(!tempSecret) await this.createTemporaryAccessSecret(); 
    // } catch(err) {
    //   this.logger.error(err, 'Произошла ошибка при инициации временного ключа!');
    // }
  }


  /**
   * Генерирует временую часть
   *
   */
  // @Interval(this.tempAccessSecretLivetimeInMs)
  async createTemporaryAccessSecret() {
    try {
      const secretKey = await this._generateSecret();
      const secret = await this.repository.create({
        secret: secretKey,
        expireAt: Date.now() + +process.env.SECRET_LIFETIME,
      });
      await this.repository.save(secret);
      await this.cacheStorage.set(
        'temp-secret:last',
        secret.secret,
        this.tempAccessSecretLivetimeInMs
      );
    } catch (err) {
      this.logger.error(err);
    }
  }


  /**
   * По верифицируемому запросу дает начальную часть секретного ключа.
   *
   * @param domainName
   * @param password
   * @returns
   */
  async getPrimarySecret(domainName: string, password: string) {
    let result: string;
    let status: number;
    try {
      // check domain
      result = process.env.ACCESS_TOKEN_SECRET;
      status = HttpStatus.OK;
    } catch (err) {
      result =
        'Что-то пошло не так! Повторите попытку позже или обратитесь к администратору';
        this.logger.error(err, { result });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { result, status };
  }


  /**
   * Отдает крайний временый секретный ключ.
   * (Требует оптимизации)
   *
   *
   * @returns
   */
  getCurrentTemporarySecret = async () => {
    let result: string;
    try {
    let tempSecret = await this.cacheStorage.get('temp-secret:last');
    
    if(!tempSecret) {
      tempSecret = await this.repository.findOne({ order: { id: 'DESC' } });
      this.logger.warn('Проблема с кпд системы, последний временный ключ отсутствует в кэш хранилище.')
    }
  } catch (err) {
    result = 'Произошла ошибка при поиске последнего временного ключа.';
    this.logger.error(err, result);
  }

    return { result };
  }


  /**
   * Отдает два последних временных секретных ключа.
   *
   *
   * @returns
   */
  async getTwoLastTemporarySecrets(): Promise<{
    result: Secret[] | string;
    status: number;
  }> {
    let result: Secret[] | string;
    let status: number;
    try {
      const secrets = await this.repository.find({
        order: { id: 'DESC' },
        take: 2,
      });
      result = secrets;
      status = HttpStatus.OK;
    } catch (err) {
      result =
        'Что-то пошло не так! Повторите попытку позже или обратитесь к администратору';
      this.logger.error(err, { result });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { result, status };
  }

  /**
   * Внутрений метод для генерации секретного ключа.
   *
   * @param length
   * @returns
   */
  private _generateSecret = async (length = 32): Promise<string> => {
    let secret: string;
    const { generateKey } = await import('node:crypto');

    generateKey('hmac', { length }, (err, key) => {
      if (err) {
        this.logger.error(err);
        throw err;
      }
      secret = key.export().toString('hex');
    });
    return secret;
  };
}

function MoreThan(arg0: number): Date | import("typeorm").FindOperator<Date> {
  throw new Error('Function not implemented.');
}

