import { Injectable } from '@nestjs/common';

@Injectable()
export class SecretService {
    constructor() {}

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
