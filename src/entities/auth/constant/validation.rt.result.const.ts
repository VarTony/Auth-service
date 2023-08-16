import { HttpStatus } from '@nestjs/common';
import { ResultOfTokenVerification } from '@token/types';

// Обработчик в случае плохого результата проверки токена.
const validationRTBadResult = {
  Not_Found: {
    result: 'Токена с данным id нет в записях',
    status: HttpStatus.NOT_FOUND,
  },
  Fake_Token: {
    result: 'Предоставлен поддельный токен.',
    status: HttpStatus.FORBIDDEN,
  },
  Token_Expired: {
    result: 'Время жизни токена уже истекло.',
    status: HttpStatus.FORBIDDEN,
  },
};

// Обработчик в случае нормального результата проверки токена.
const validationRTOkResult = {
  Ok: async (email: string) =>
    console.log(`User with email: ${email} give new tokens`),
  Atypical_Device_Data: async (email: string) => {
    console.warn(
      `User with email: ${email} was request from new location and user agent.`,
    );
    // Mailer connect;
  },
};

// Проверка результата проверки на нормальность
const isValidationOk = (result: ResultOfTokenVerification) =>
  result === 'Ok' || result === 'Atypical_Device_Data';

export { validationRTBadResult, validationRTOkResult, isValidationOk };
