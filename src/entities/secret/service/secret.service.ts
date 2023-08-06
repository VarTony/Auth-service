import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '../repository';

@Injectable()
export class SecretService {
    constructor(
        @InjectRepository(Secret) private readonly repository: Repository<Secret>
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
                expireAt: Date.now() + (+process.env.SECRET_LIFETIME)
            });
            const { id } = await this.repository.save(secret);
        } catch(err) {
            console.warn(err);
        }
    }


    /**
     * По верефицируемому запросу дает первичный часть секретного ключа.
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
        } catch(err) {
            console.warn(err);
            result = 'Что-то пошло не так! Повторите попытку позже или обратитесь к администратору';
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return { result, status };
    };


    getCurentTemporarySecret = async () => 
        await this.repository.findOne({ order: { id: 'DESC' } });

    async getTwoLastTemporarySecrets(): Promise<{ result: Secret[] | string, status: number }> {
        let result: Secret[] | string;
        let status: number;
        try {
            const secrets = await this.repository.find({ order: { id: 'DESC' }, take: 2 });
            result = secrets;
            status = HttpStatus.OK;
        } catch(err) {
            console.warn(err);
            result = 'Что-то пошло не так! Повторите попытку позже или обратитесь к администратору';
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
    generateSecret = async (length: number = 32): Promise<string> => {
        let secret: string;
        const { generateKey } = await import('node:crypto');

        generateKey('hmac', { length }, (err, key) => {
            if(err) {
                console.warn(err);
                throw err;
            }
            secret = key.export().toString('hex');
        })
        return secret;
    }
}
