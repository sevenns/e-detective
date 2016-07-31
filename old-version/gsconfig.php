<?php
/**
 * GSConfig
 *
 * The base configurations for GetSimple	
 *
 * @package GetSimple
 */

/** Prevent direct access */
if (basename($_SERVER['PHP_SELF']) == 'gsconfig.php') { 
	die('You cannot load this page directly.');
}; 

/*****************************************************************************/
/** Ниже перечислены константы, которые можно использовать для настройки GetSimple */ 

# Настройка языка
 $LANG = 'ru_RU';
 
# Скопировать уникальные модификаторы (salt) для замены двух нижних констант можно здесь http://get-simple.info/api/security/
# Позволяет производить дополнительное хеширование пароля администратора уникальным модификатором (salt) в качестве дополнительной меры безопасности системы
# define('GSLOGINSALT', 'your_unique_phrase');

# Отключает автоматическое генерирование уникального модификатора (salt) для применения пользовательской уникальной строки. Используется для cookie-файлов и безопасной загрузки файлов на сервер
# define('GSUSECUSTOMSALT', 'your_new_salt_value_here');

# Ширина миниатюры загруженного изображения по умолчанию
 define('GSIMAGEWIDTH', '200');

# Изменить имя папки административной панели
# define('GSADMIN', 'admin');

# Включите режим отладки
# define('GSDEBUG', TRUE);

# Оповещать поисковые системы при изменении карты сайта? Если хотите отключить оповещение, раскомментируйте строчку
# define('GSDONOTPING', 1);

# Отключить CSRF защиту. Раскомментируйте строчку ниже, если вы продолжаете получать сообщение об ошибке "CSRF error detected..."
# define('GSNOCSRF', TRUE);

# Установите режим коррекции CHMOD
# define('GSCHMOD', 0755);

# Включить канонические перенаправления?
# define('GSCANONICAL', 1);

# Использовать Uploadify для загрузки файлов? При русскоязычном домене раскомментировать строчку ниже.
# define('GSNOUPLOADIFY', 1);

# высота WYSIWYG-редактора (default 500)
# define('GSEDITORHEIGHT', '400');

# Настройки WYSIWYG-редактора, раскомментируйте строчку ниже (advanced, basic or [custom config]) 
# define('GSEDITORTOOL', 'advanced');
 
# ------------ для более полных настроек раскомментируйте строчку ниже ----------
 define('GSEDITORTOOL', "['Bold','Italic','Underline','Strike','Subscript','Superscript','NumberedList','BulletedList','JustifyCenter','JustifyRight','JustifyBlock','HorizontalRule','Table','Link','Unlink','Anchor','Image','Blockquote','CreateDiv','PasteFromWord','Undo','Redo'],'/',['Styles','Format','FontSize','TextColor','BGColor','Youtube','Video','Iframe','SpecialChar','wenzgmap','pbckcode','RemoveFormat','Source']");

# Параметры WYSIWYG-редактора 
# define('GSEDITOROPTIONS', '');

# Язык WYSIWYG-редактора (default en), раскомменитровать строчку ниже, если хотите, чтобы язык отличался от языка, выбранного при установке CMS
# define('GSEDITORLANG', 'en');

# Установить адрес электронной почты для любых отсылаемых сообщений, сгенерированных GetSimple.
# define('GSFROMEMAIL', 'noreply@get-simple.info');

# Автосохранение в edit.php. Значение интервала автосохранения в секундах
# define('GSAUTOSAVE', 900);

# Включение внешнего API, ссылка на страницу с ключом будет показана на странице настроек - "API Конфигурация"
#define('GSEXTAPI', 1); 

# Set PHP locale
# http://php.net/manual/en/function.setlocale.php
 setlocale(LC_ALL, 'ru_RU.UTF8', 'ru.UTF8', 'ru_RU.UTF-8', 'ru.UTF-8', 'ru_RU', 'ru'); 

# Отключение загрузки внешних версий CDN скриптов (jQuery/jQueryUI)
# define("GSNOCDN",true);

# Отключение нумерации строк и подсветки синтаксиса редактора тем
# define("GSNOHIGHLIGHT",true);

# Определить по умолчанию часовой пояс сервера
# define('GSTIMEZONE', 'America/Chicago');

# Подавление PHP ошибок в режиме отладки не будет срабатывать, несмотря на настройки php.ini
 define('SUPPRESSERRORS',true);

# Отключение проверки веб-сервера Apache, по умолчанию false
# define('GSNOAPACHECHECK', true);

# Отключение проверки верси CMS
# define('GSNOVERCHECK', true);

# Включить альтернативные стили админпанели
# GSSTYLE можно разделять запятыми 
# Примечание: стили кэшируются
# GSSTYLEWIDE = ширина в зависимости от разрешения экрана
#
# Стили:
# GSSTYLEWIDE = ширина в зависимости от разрешения экрана
# GSSTYLE_SBFIXED = фиксация сайдменю
# 
# eg. 
# define('GSSTYLE',GSSTYLE_SBFIXED);
# define('GSSTYLE',GSSTYLEWIDE);
# define('GSSTYLE',implode(',',array(GSSTYLEWIDE,GSSTYLE_SBFIXED)));

# Отключить генерацию карты сайта
# define('GSNOSITEMAP',true);

# Отключение смены языков в плагине I18n
# define('I18N_SINGLE_LANGUAGE', true);

# Включение автоматического описания из первого абзаца страницы в мета-тег description, если вам лень заполнять это поле самим
# define('GSAUTOMETAD',true);

# Установка языка по умолчанию при отсутствии перевода каких-либо строк в языковом файле CMS пользователя, 
# по умолчанию выбран 'en_US', раскомментируйте строчку ниже, чтобы отключить
# define('GSMERGELANG',false);

# GS запрещает загрузку базовых страниц во фрейм,
# чтобы предотвратить попытки кликджекинга (clickjacking)
# сайт нельзя проверить на эмуляторах, таких как http://www.responsinator.com/
# если хотите проверить сайт на эмуляторе, раскомментируйте строчку ниже
# define('GSNOFRAME',false); # включить загрузку во фрейм
# есть возможность отключать загрузку во фрейм для фронтенда и/или для бэкенда (GSFRONT, GSBACK or GSBOTH)
# define('GSNOFRAME',GSBOTH); # отключить загрузку во фрейм и для фронтенда и для бэкенда

# GS может форматировать свои XML файлы перед их сохранением и придавать им удобочитаемый вид
# define('GSFORMATXML',true);
?>