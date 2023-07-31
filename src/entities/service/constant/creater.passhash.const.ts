import * as crypto from 'node:crypto';
import { PassPack } from '../types';

    
/**
 * Создает хеш пароля и 'соль'
 * 
 * @param password 
 * @returns Password`s hash and salt
 */
const createPasshashAndSalt = async (password: string): Promise<PassPack> => {
    const salt = await crypto.createHash('sha256')
     .update(Date.now().toString() + Math.random().toString())
     .digest('hex');
    
    const passhash = await crypto.createHash('sha512')
     .update(`${ password }.${ salt }`)
     .digest('hex');

    return { passhash, salt };
}


export { createPasshashAndSalt };