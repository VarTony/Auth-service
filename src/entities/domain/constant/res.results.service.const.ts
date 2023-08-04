const ResDomainResults = {
    good: {
        domainSuccessAdded: 'Домен был успешно зарегистрирован.',
        domainSuccessDeactivated: name => `Домен ${ name }, успешно деактивирован.`
    },
    bad: {
        domainAlreadyExists: 'Домен с таким именем уже существует.',
        errorDuringRegistration: 'Произошла ошибка при регистрации домена, попробуйте позже или обратитесь к администратору.',
        errorDuringDeactivation: name => `Не удалось деактивировать домен ${ name }`
    }
};


export { ResDomainResults }