import { HttpStatus } from '@nestjs/common';

const ResDomainResults = {
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
    domainAlreadyExists: {
      result: 'Домен с таким именем уже существует.',
      status: HttpStatus.CONFLICT,
    },
    domainNotFound: {
      result: 'Домен с таким именем не найден.',
      status: HttpStatus.NOT_FOUND,
    },
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

export { ResDomainResults };
