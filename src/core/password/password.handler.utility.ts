import { PassData, PassPack } from './pass.type';
import * as crypto from 'node:crypto';

export class PasswordHandler {
  /**
   * Метод для проверки паролей.
   *
   * @param usersInfo
   * @returns
   */
  static passChecker = async (passData: PassData): Promise<boolean> => {
    const passhash = crypto
      .createHash('sha512')
      .update(`${passData.password}.${passData.salt}`)
      .digest('hex');

    return passhash === passData.passhash;
  };

  /**
   * Метод для создания хеша пароля и 'соли'.
   *
   * @param password
   * @returns Password`s hash and salt
   */
  static createPasshashAndSalt = async (
    password: string,
  ): Promise<PassPack> => {
    const salt = crypto
      .createHash('sha256')
      .update(Date.now().toString() + Math.random().toString())
      .digest('hex');

    const passhash = crypto
      .createHash('sha512')
      .update(`${password}.${salt}`)
      .digest('hex');

    return { passhash, salt };
  };
}
