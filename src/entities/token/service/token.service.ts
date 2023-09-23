import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import {
  toBase64Url,
  fromBase64Url
} from '../constant';
import { RefreshToken } from '../repository';
import { Repository } from 'typeorm';
import { DataFromJWTParser, JWTPair, ResultOfTokenVerification } from '@token/types';
import { DigitImprint } from '@entities/auth/types/service.type';
import { SecretService } from '@secret/service/secret.service';
import { ConfigService } from '@nestjs/config';
import { Timeout } from '@nestjs/schedule';

type CreatingTokensData = {
  userId: number;
  nativeUserId: number;
  domainName: string;
  domainSecret: string;
  roleId?: number;
};

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly serviceName: string;
  private readonly refreshTokenExpiration: number;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: number;
  private readonly primaryATSecret: string;

  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
    private readonly config: ConfigService,
    private readonly secret: SecretService,
  ) {
    this.serviceName = this.config.get('serviceName');
    this.refreshTokenExpiration = this.config.get('refreshTokenExpiration');
    this.refreshTokenSecret = this.config.get('refreshTokenSecret');
    this.accessTokenExpiration = this.config.get('accessTokenExpiration');
    this.primaryATSecret = this.config.get('primaryATSecret');
  }


  /**
   * Создает access токен.
   *
   * @param usersInfo
   * @returns
   */
  async createAccessToken(
    jti: number,
    data: CreatingTokensData,
  ): Promise<string | null> {
    const { userId, nativeUserId, domainName, roleId } = data;
    const header = { alg: 'HS512', type: 'JWT-ACCESS' };
    const payload = {
      uid: userId,
      nuid: nativeUserId,
      roles: roleId ?? 'roleId',
      dmn: domainName,
      iss: this.serviceName,
      jti,
      exp: Date.now() + this.accessTokenExpiration,
    };
    const currentTemporarySecret = await this.secret.getCurrentTemporarySecret();
    const secret = `${data.domainSecret}.${currentTemporarySecret}.${ this.primaryATSecret }`;

    return await this.createJWT(header, payload, secret);
  }


  /**
   * Создает refresh токен.
   *
   *
   * @param userData
   * @returns
   */
  async createRefreshToken(
    data: CreatingTokensData,
    devicesInfo: { location: string; userAgent: string },
  ): Promise<string> {
    const { userId, nativeUserId } = data;
    const { location, userAgent } = devicesInfo;
    // Создает запись токена в базе.
    const rtJWTDbData = await this.repository.create({
      userId,
      token: 'plug',
      isActive: true,
      location,
      userAgent,
    });
    const { id } = await this.repository.save(rtJWTDbData);
    // Формирует токен.
    const header = { alg: 'HS512', type: 'JWT-REFRESH' };
    const payload = {
      jti: id,
      iat: Date.now(),
      exp: Date.now() + this.refreshTokenExpiration,
      iss: this.serviceName,
      uid: nativeUserId,
    };
    const refreshJWT = await this.createJWT(header, payload, this.refreshTokenSecret);

    // Записывает сформированный токен в БД.
    await this.repository.update({ id }, { token: refreshJWT });
    return refreshJWT;
  }


  /**
   * Создает пару JWT токенов.
   *
   *
   * @param data
   * @returns
   */
  async createJWTPair(
    data: CreatingTokensData,
    digitImprint: DigitImprint,
  ): Promise<JWTPair> {
    const refreshToken = await this.createRefreshToken(data, digitImprint);
    const { jti } = (await this.jwtParser(refreshToken)).map?.payload;
    const accessToken = await this.createAccessToken(jti, data);

    return { refreshToken, accessToken };
  }


  /**
   * Деактивирует refresh токен.
   *
   * @param id
   */
  async deactivateRefreshJWT(
    id: number,
  ): Promise<{ result: string; status: number }> {
    let result: string;
    let status: number;
    try {
      const updated = await this.repository.update({ id }, { isActive: false });
      if (!updated) {
        result = 'Не удалось деактивировать, токен не найден.';
        status = HttpStatus.NOT_FOUND;
      }
      result = 'Токен был успешно деактивирован';
      status = HttpStatus.OK;
    } catch (err) {
      result = 'Не удалось провести деактивацию из-за внутреней ошибки.';
      this.logger.error(err, { result });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { result, status };
  }


  /**
   * Верефицирует refresh token.
   *
   *
   * @param rt
   * @param digitImprint
   * @returns
   */
  verificateRT = async (
    rt: string,
    digitImprint: DigitImprint,
  ): Promise<ResultOfTokenVerification> => {
    const { str, map } = await this.jwtParser(rt);
    const { header, payload, signature } = str;
    const { jti } = map.payload;
    const isCorrectSignature =
      signature ===
      (await this.jwtSignatureCreator(header, payload, this.refreshTokenSecret));
    if (!isCorrectSignature) return 'Fake_Token';

    const token = await this.findRTById(jti);
    const { location, userAgent } = digitImprint;
    const isChangedDevice =
      token.location !== location && userAgent !== token.userAgent;
    if (!token) return 'Not_Found';
    if (!token.isActive) return 'Token_Expired';
    if (isChangedDevice) return 'Atypical_Device_Data';

    return 'Ok';
  };

  
  /**
   * Создает обобщенный JWT
   * 
   * 
   * @param header 
   * @param payload 
   * @param secret 
   * @returns 
   */
  async createJWT(
    header: any,
    payload: any,
    secret: string,
  ): Promise<string> {
    const headerInBase64 = toBase64Url(header).join('');
    console.log(headerInBase64)
    const payloadInBase64 = toBase64Url(payload).join('');
    const signature = await this.jwtSignatureCreator(headerInBase64, payloadInBase64, secret);
    const jsonWebToken = [headerInBase64, payloadInBase64, signature].join('.');

    return jsonWebToken;
  };


  /**
   * Формирует JWT подпись
   * 
   * 
   * @param b64Header 
   * @param b64payload 
   * @param secret 
   * @param alg 
   * @returns 
   */
  async jwtSignatureCreator (
    b64Header: string,
    b64payload: string,
    secret: string,
    alg: 'sha256' | 'sha512' = 'sha512',
  ) {
    const signature = crypto.createHmac(alg, `${b64Header}${b64payload}${secret}`);
    return signature.digest('base64url');
  };


 /**
  *  Разбирает токен на составные части.
  *
  * 
  * @param token
  * @returns
  */
  async jwtParser(token: string): Promise<DataFromJWTParser> {
    const [header, payload, signature] = token.split('.');

    return {
      str: { header, payload, signature },
      map: {
        header: JSON.parse(await fromBase64Url(header)),
        payload: JSON.parse(await fromBase64Url(payload)),
      },
    };
  };


  /**
   * Ищет токен по его id.
   *
   *
   * @param id
   * @returns
   */
  findRTById = async (id: number) =>
    await this.repository.findOne({ where: { id } });

  // async refreshTokensCleaner() {}
}
