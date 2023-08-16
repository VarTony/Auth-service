<h1 color="#191970"> AUTH-SERVICE </h1>

Общее описание:

Сервис авторизации общается через AMQ протокол со сторонними сервисами, которым нужна услуга внешней авторизации. 
При первом обращении внешние сервисы должны зарегистрировать себя. Далее они могут передать список своих пользователей (включая хэш паролей и 'соль' для авторизации), после чего список юзеров будет зарегистрирован и привязан к этому конкретному сервису (домену). Администратор внешнего сервиса или сам сервис может сделать запрос на деактивацию сервиса, или пользователей (*1). В таком случае пользователи или сервис помечаются как неактивные и, через заданный в конфиге период, очищаются из базы. Так же принимаются запросы:

  1. На изменение данных о пользователях или сервисе (1);
  2. На выдачу пары последних временных частей ключа, которые используются в подписях токенов (подробнее описано в секции о токенах);
  3. На получения списка зарегистрированных пользователей;


Токены:

Токены имеют стандартные атрибуты JWT - header, payload, signature. На каждого пользователя формируется 2 токена - access & refresh. Функционируют они стандартно: refresh используется для обновления пары, в то время как access для коротких сессий доступа. Секрет, используемый в подписи токенов, состоит из 3 частей:

  1. Заданный на сервисе авторизации первичный секретный ключ;
  2. Генерируемый через заданный промежуток(3) времени переодический ключ;
  3.  Секрет (*2), который при регистрации задает внешний сервис;

Основная логика работы JWT написана c помощью нативных модулей Node.js.


Работа с пользователями:

Происходит через протокол передачи гипертекста. Обрабатываются всего два типа запроса:

  1. Авторизация через ввод логина и пароля.
  2. Обновление токенов.


Сноски (*):

  1. Требуется пароль заданный сервисом при регистрации.
  2. Может быть изменен при запросе.
  3. Для каждой из двух версий токена период свой (у refresh он больше).

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - Anton  Ternovskiy

## License

Nest is [MIT licensed](LICENSE).
