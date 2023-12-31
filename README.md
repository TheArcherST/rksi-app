# Веб-приложение РКСИ

Данный репозиторий содержит исходный код фронтенда веб-приложения РКСИ для работы с расписанием. Issues и pull requests приветствуются!

Сайт доступен по адресу https://tomioka.ru.

Telegram-бот, идущий в паре с приложением, имеет закрытый исходный код. Официальный аккаунт бота: https://t.me/rksi_app_bot. С помощью
данного сайта вы можете авторизоваться в боте, и совергшать в неём действия от своего имени (аутентификация в боте, как и на сайте,
происходит посредством JWT токена).

Вы можете свободно использовать откртый API приложения в разумных пределах. Интерактивная документация API доступна по адресу 
https://tomioka.ru:6078/docs.


## Развёртывание

Структура приложения создана с помощью [Create React App](https://github.com/facebook/create-react-app), и запускается стандартным образом.

Кроме того, поддерживается развёртывание через Docker, Docker Compose.

Как развернуть сайт для разработки с помощью Docker:

1. Установите Docker на свой компьютер
2. Скопируйте файл example.env в файл .env
4. Зайдите в терминале в директорию этого репозитория.
5. Введите команду `docker compose -f docker-compose.dev.yml up -d`

После изменения исходного кода,выполните следующую команду 
`docker compose -f docker-compose.dev.yml up -d`

Сайт будет доступен по адресу, указанному в файле `.env`. По умолчанию это http://127.0.0.1:3001

