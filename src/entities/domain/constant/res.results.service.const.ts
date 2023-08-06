import { HttpStatus } from "@nestjs/common";

const ResDomainResults = {
    good: {
        domainSuccessAdded: { 
            result: 'Домен был успешно зарегистрирован.',
            status: HttpStatus.OK
        },
        domainSuccessDeactivated: (name: string) => ({ 
            result: `Домен ${ name }, успешно деактивирован.`,
            status: HttpStatus.OK
        })
    },
    bad: {
        domainAlreadyExists: { 
            result: 'Домен с таким именем уже существует.',
            status: HttpStatus.CONFLICT
        },
        errorDuringRegistration: {
            result: 'Произошла ошибка при регистрации домена, попробуйте позже или обратитесь к администратору.',
            status: HttpStatus.INTERNAL_SERVER_ERROR
        },
        errorDuringDeactivation: (name: string) => ({
             result: `Не удалось деактивировать домен ${ name }`,
             status: HttpStatus.INTERNAL_SERVER_ERROR
        })
    }
};


export { ResDomainResults }