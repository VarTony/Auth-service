import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '../repository';

@Injectable()
export class SecretService {
  private readonly logger = new Logger(SecretService.name);

  constructor(
    @InjectRepository(Secret) private readonly repository: Repository<Secret>,
  ) {}

  /**
   * Генерирует временую часть
   *
   */
  async createTemporaryAccessSecret() {
    try {
      const secretKey = await this.generateSecret();
      const secret = await this.repository.create({
        secret: secretKey,
        expireAt: Date.now() + +process.env.SECRET_LIFETIME,
      });
      const { id } = await this.repository.save(secret);
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
   * Отдает последний временый секретный ключ.
   * (Требует оптимизации)
   *
   *
   * @returns
   */
  getCurrentTemporarySecret = async () =>
    await this.repository.findOne({ order: { id: 'DESC' } });

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
   * Функция для генерации секретного ключа.
   *
   * @param length
   * @returns
   */
  generateSecret = async (length = 32): Promise<string> => {
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
