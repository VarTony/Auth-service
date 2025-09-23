import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TokenService } from '@token/service';
import { PasswordHandler } from 'src/core/index';
import { UserService } from '@user/index';
import { DomainService } from '@domain/service';
import { JWTPair } from '@token/types/jwt.type';
// import { tokensParser } from '@token/constant';
import {
  isValidationOk,
  validationRTBadResult,
  validationRTOkResult,
} from '@entities/auth/constant';
import { DigitImprint } from '@entities/auth/types/service.type';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private readonly user: UserService,
    private readonly token: TokenService,
    private readonly domain: DomainService,
  ) {}

  /**
   * Обрабатывает локгику входа пользователя.
   *
   *
   * @param usersInfo
   * @returns
   */
  async singIn(
    domainName: string,
    login: string,
    password: string,
    digitImprint: { location: string; userAgent: string },
  ): Promise<{ result: JWTPair | string; status: number }> {
    let result: JWTPair | string;
    let status: number;
    try {
      const domain = await this.domain.findDomainByName(domainName);
      if (!domain) {
        result = `Домен с именем ${domainName} не был найден;`;
        status = HttpStatus.NOT_FOUND;
        return { result, status };
      }

      const user = await this.user.getUserByDomainData(login, domain.id);
      const { salt, passhash } = user;
      const isCorrectPass = await PasswordHandler.passChecker({
        password,
        salt,
        passhash,
      });

      if (!isCorrectPass) {
        result = 'Неверный логин или пароль.';
        status = HttpStatus.BAD_REQUEST;
        return { result, status };
      }
      const { id, roleId, nativeUserId } = user;
      result = await this.token.createJWTPair(
        {
          userId: id,
          domainName,
          domainSecret: domain.secret,
          nativeUserId,
          roleId,
        },
        digitImprint,
      );
      status = HttpStatus.OK;
    } catch (err) {
      result = 'Аутентификация: Полностью провалилась - полностью!';
      this.logger.error(err, { result });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { result, status };
  }

  /**
   * Обновляет JWT пару.
   *
   *
   * @param rt
   * @param digitImprint
   * @returns
   */
  async updateJWTPair(
    rt: string,
    digitImprint: DigitImprint,
  ): Promise<{ result: JWTPair | string; status: number }> {
    let result: JWTPair | string;
    let status: number;
    try {
      const resultOfVerification = await this.token.verificateRT(
        rt,
        digitImprint,
      );
      if (!isValidationOk(resultOfVerification))
        return validationRTBadResult[resultOfVerification];

      const { uid } = (await this.token.jwtParser(rt)).map.payload;
      validationRTOkResult[resultOfVerification](uid); // Логгирует выдачу нового токена
      const { roleId, domainId, nativeUserId } = await this.user.findUserById(
        uid
      );
      const domain = await this.domain.findDomainById(domainId);

      result = await this.token.createJWTPair(
        {
          userId: uid,
          domainName: domain.name,
          domainSecret: domain.secret,
          roleId,
          nativeUserId,
        },
        digitImprint,
      );

      status = HttpStatus.OK;
    } catch (err) {
      result = 'Токены ушли гулять';
      this.logger.error(err, { result });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return { result, status };
  }
}
