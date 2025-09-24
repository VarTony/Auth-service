import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Secret } from '../repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { DomainService } from '@domain/service';
import { promisify } from 'util';

@Injectable()
export class SecretService implements OnModuleInit {
  private readonly logger = new Logger(SecretService.name);
  private readonly tempAccessSecretLivetimeInMs: number;
  private readonly domainService: DomainService;

  constructor(
    @InjectRepository(Secret) private readonly repository: Repository<Secret>,
    @Inject(CACHE_MANAGER) private readonly cacheStorage: Cache,
    private readonly config: ConfigService,
  ) {
    this.tempAccessSecretLivetimeInMs = this.config.get(
      'tempAccessSecretLivetimeInMs',
    );
  }

  /**
   * Метод для запуска генерации временного ключа при запуске приложения.
   */
  async onModuleInit() {
    this.logger.log('Secret service bootstrapped');
    try {
      const now = new Date();
      const tempSecret = await this.repository.findOne({
        where: { expireAt: MoreThan(now) },
        order: { id: 'DESC' },
      });

      if (!tempSecret) {
        this.logger.warn('Живого временного ключа нет — создаётcя первый.');
        await this.createTemporaryAccessSecret();
      }
    } catch (err) {
      this.logger.error(err, 'Ошибка при инициации временного ключа!');
    }
  }

  /**
   * Генерирует временую часть
   *
   */
  private async createTemporaryAccessSecret() {
    const secretKey = await this.generateSecret();
    const expireAt = new Date(
      Date.now() + (+process.env.TEMP_ACCESS_SECRET_LIVETIME_IN_MS),
    );

    const secret = await this.repository.create({
      secret: secretKey,
      expireAt,
    });
    await this.repository.save(secret);
    await this.setSercretToCache(secret);

    return secret;
  }


  /**
   * Добавляет новый временный секрет в кеш хранилище
   * 
   * @param secret 
   */
  private async setSercretToCache(secret: Secret) {
    await this.cacheStorage.set(
      'temp-secret:last',
      secret.secret,
      this.tempAccessSecretLivetimeInMs,
    );
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
      const isDomainValid = await this.domainService.isPasswordValid(domainName, password);
      if(!isDomainValid) {
        result = 'Неверное имя домена или пароль';
        status = HttpStatus.FORBIDDEN;

        return { result, status }
      }

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
   * @returns
   */
  getCurrentTemporarySecret = async (): Promise<string> => {
    try {
      const cached = await this.cacheStorage.get<string>('temp-secret:last');
      if (cached) {
        const entity = await this.repository.findOne({
          where: { secret: cached }, // достаёт из базы, чтобы проверить expireAt
        });
        if (entity && entity.expireAt > new Date()) return cached;
      }
      const tempSecret = await this.repository.findOne({
        where: { expireAt: MoreThan(new Date()) },
        order: { id: 'DESC' },
      });

      if (tempSecret) {
        this.logger.warn(
          'Проблема с кпд системы, последний временный ключ отсутствует в кэш хранилище.',
        );
        return tempSecret.secret;
      }

      const newsecret = (await this.createTemporaryAccessSecret()).secret;
      return newsecret;
    } catch (err) {
      let result = 'Произошла ошибка при поиске последнего временного ключа.';
      this.logger.error(err, result);
    }
  };

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
  generateSecret = async (length = 32): Promise<string> => {
    const { generateKey } = await import('node:crypto');
    const generateKeyAsync = promisify(generateKey);

    const secret = await generateKeyAsync('hmac', { length });
    return secret.export().toString('hex');
  };
}
