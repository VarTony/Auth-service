import { HttpStatus } from '@nestjs/common';

const ResResults = {
  good: {
    domainSuccessAdded: (secondPartOfSecret: string) => ({
      result: 'Домен был успешно зарегистрирован.',
      status: HttpStatus.OK,
      secondPartOfSecret
    }),
    domainSuccessUpdated: {
      result: 'Данные домена успешно обновлены.',
      status: HttpStatus.OK,
    },
    domainSuccessDeactivated: (name: string) => ({
      result: `Домен ${name}, успешно деактивирован.`,
      status: HttpStatus.OK,
    }),
  },
  bad: {
    invalidPassword: {
      result: 'Неверное имя аккаунта или пароль',
      status: HttpStatus.UNAUTHORIZED
    },
    domainAlreadyExists: {
      result: 'Домен с таким именем уже существует.',
      status: HttpStatus.CONFLICT,
    },
    domainNotFound: {
      result: 'Домен с таким именем не найден.',
      status: HttpStatus.NOT_FOUND,
    },
    userIsNotExistsById: (nativeUserId: string) => ({
        result: `Пользователь с таким id: ${nativeUserId} уже существует`,
        status: HttpStatus.BAD_REQUEST
    }),
    errorDuringRegistration: {
      result:
        'Произошла ошибка при регистрации домена, попробуйте позже или обратитесь к администратору.',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    errorDuringUpdating: {
      result:
        'Произошла ошибка при обновлении данных домена, попробуйте позже или обратитесь к администратору.',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    errorDuringDeactivation: (name: string) => ({
      result: `Не удалось деактивировать домен ${name}.`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    }),
  },
};

export { ResResults };
