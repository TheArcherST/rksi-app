import { Tag } from 'primereact/tag';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import './privacy_policy.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="content">
      <h1>Политика конфиденциальности</h1>
      <p>
        Дата последнего обновления: <Tag value="8 апреля 2024 года" severity="success" />
      </p>
      <p>
        Настоящая <Tag value="Политика конфиденциальности" severity="info" /> определяет порядок сбора, использования и раскрытия персональных данных, предоставляемых пользователями сайта <Tag value="https://tomioka.ru" severity="info" /> (далее - «Сайт»).
      </p>
      <p>
        Мы привержены соблюдению конфиденциальности и защите персональных данных наших пользователей. Предоставленные вами персональные данные используются исключительно для предоставления и улучшения функционала Сайта. Продолжая использовать Сайт, вы соглашаетесь с сбором и использованием информации в соответствии с настоящей Политикой конфиденциальности.
      </p>
      <h3>Сбор и использование информации</h3>
      <p>
        При использовании нашего Сайта мы можем попросить вас предоставить нам персональные данные, которые могут быть использованы для контакта или идентификации вашей личности. К таким данным могут относиться, но не ограничиваться ими, ваше полное имя и адрес электронной почты («Персональные данные»). Эти данные используются для следующих целей:
      </p>
      <ul>
        <li>Ваше полное имя используется для более удобной идентификации пользователей и персонализации.</li>
        <li>Ваш адрес электронной почты используется в качестве логина для доступа к Сайту.</li>
        <li>Ваш идентификатор Telegram для получения уведомлений от нашего бота в Telegram.</li>
      </ul>
      <h3>Данные журнала</h3>
      <p>
        Подобно многим другим операторам сайтов, мы собираем информацию, которую ваш браузер автоматически передает при каждом визите на наш Сайт («Данные журнала»). Эти Данные журнала могут включать в себя такую информацию, как IP-адрес вашего компьютера, тип и версию браузера, страницы нашего Сайта, которые вы посещаете, дату и время визита, время, проведенное на этих страницах, и другие статистические данные.
      </p>
      <p>
        Кроме того, мы можем использовать сервисы третьих лиц, такие как Google Analytics, для сбора, мониторинга и анализа этих данных.
      </p>
      <h3>Cookie</h3>
      <p>
        Cookie - это файлы с небольшим объемом данных, которые могут включать в себя уникальный анонимный идентификатор. Cookie передаются сайтом в ваш браузер и хранятся на жестком диске вашего компьютера.
      </p>
      <p>
        Мы используем «cookie» для хранения токена для целей аутентификации. Вы можете настроить свой браузер так, чтобы он отклонял все cookie или уведомлял о передаче cookie. Однако, если вы не принимаете cookie, некоторые функции нашего Сайта могут быть недоступны.
      </p>
      <h3>Безопасность</h3>
      <p>
        Безопасность ваших персональных данных имеет для нас важное значение. Мы применяем коммерчески обоснованные методы защиты ваших персональных данных, однако никакой метод передачи данных по Интернету или метод электронного хранения не может гарантировать абсолютную безопасность.
      </p>
      <h3>Изменения в Политике конфиденциальности</h3>
      <p>
        Настоящая Политика конфиденциальности вступает в силу с <Tag value="8 апреля 2024 года" severity="success" /> и будет действовать до тех пор, пока не будут внесены изменения в ее положения в будущем, которые вступят в силу немедленно после размещения на этой странице.
      </p>
      <p>
        Мы зарезервировали для себя право обновлять или изменять нашу Политику конфиденциальности в любое время, и вы должны периодически проверять эту Политику конфиденциальности на предмет изменений. Продолжая использовать Сайт после внесения изменений в Политику конфиденциальности, вы подтверждаете, что ознакомлены с изменениями и соглашаетесь соблюдать и быть обязанными условиями обновленной Политики конфиденциальности.
      </p>
      <p>
        В случае внесения существенных изменений в нашу Политику конфиденциальности, мы уведомим вас либо через адрес электронной почты, который вы предоставили нам, либо путем размещения соответствующего уведомления на нашем Сайте.
      </p>
      <h3>Контактная информация</h3>
      <p>
        Если у вас возникли вопросы по нашей Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу <Tag value="support@schedule-college.ru" severity="info" />.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
