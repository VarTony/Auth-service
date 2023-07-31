import { passData } from "@auth/types";
import * as crypto from 'node:crypto';

/**
 * Функция для проверки паролей.
 * 
 * @param usersInfo 
 * @returns 
 */
const passChecker = async(passData: passData): Promise<boolean> => {
    const passhash = await crypto.createHash('sha512')
     .update(`${ passData.password }.${ passData.salt }`)
     .digest('hex');

    return passhash === passData.passhash;
}

export { passChecker };