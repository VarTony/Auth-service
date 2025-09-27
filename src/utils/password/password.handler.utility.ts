import { PassData, PassPack } from './pass.type';
import * as crypto from 'node:crypto';

type hashAlgorithm =
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'md5'
  | 'ripemd160'
  | 'sha3-224'
  | 'sha3-256'
  | 'sha3-384'
  | 'sha3-512';

export class PasswordHandler {
  /**
   * Метод для проверки паролей.
   *
   * @param usersInfo
   * @returns
   */
  static passChecker = (passData: PassData): boolean => {
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
  static createPasshashAndSalt = (
    password: string,
  ): PassPack => {
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

  static createHash = (value: unknown, hashName: hashAlgorithm = 'sha512') => {
     return crypto
      .createHash(hashName)
      .update(`${value}`)
      .digest('hex');
  };
}
