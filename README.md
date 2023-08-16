<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fclipart-library.com%2Fclipart%2Fblue-cat-cliparts-9.htm&psig=AOvVaw3c5RypWxn8MCaXjkEMpFDX&ust=1692247883104000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLiwn-Gw4IADFQAAAAAdAAAAABA5" width="200" alt="Nest Logo" /></a>
</p>

<h1 color="#191970"> AUTH-SERVICE </h1>

Общее описание:

Сервис авторизации работает следущим образом: Он общается через AMQ протокол со стороними сервисами, которым нужна услуга внешний авторизации. При первом обращении внешние сервисы должны зарегистрировать себя. Далее они могут передать список своих пользователей, (включая хеш паролей и 'соль' для авторизации), после чего список юзеров будет зарегестрирован и привязан к этому конкретному сервису(домену).
Администратор внешнего сервиса или сам сервис может сделать запрос на деактивацию сервиса, или пользователей(*1). В таком случае пользователи или сервис помечаются как не активные и через заданный в конфиге период очищаются из базы. Так же принимаются запросы на изменение данных о пользователях или сервисе(*1), на
выдачу пары последних переодических* частей ключа используемых в подписях токенов(Об этом в секции о токенах), на получения списка зарегистрированных пользователей.


Токены:

Токены имеют стандартные атрибуты JWT(header, payload, signature). На каждого пользователя формируется 2 токена, - access & refresh, функционируют они стандартно, рефреш используется для обновления пары, access для коротких сессий доступа. Секрет используемый в подписи токенов состоит из 3 частей:
  1 - Заданый на сервисе авторизации первичный секретный ключ;
  2 - Генерируемый через заданный промежуток(*3) времени временный ключ;
  3 - Секрет(*2) который при регистрации задает внешний сервис;

Основная логика работы JWT написана c помощью нативных модулей ноды (Просто потому что нравится разбираться самому).


Работа с пользователями:

Происходит через протокол передачи гипертекста. Обрабатываются всего два типа запроса:
  1. Авторизация через ввод логина и пароля.
  2. Обновление токенов.


Сноски(*):
*1. Требуется пароль заданый сервисом при регистрации.
*2. Может быть изменен при запросе.
*3. Для каждого из двух версий токена период свой(У рефреш он больше).


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
