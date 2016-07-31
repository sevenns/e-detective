<?php
/*
Plugin Name: User Login XML
Description: Allow users to create an account and login to your website. Protects pages. XML Based.
Version: 3.1
Author: Mike Henken
Author URI: http://michaelhenken.com/
*/

# get correct id for plugin
$thisfile=basename(__FILE__, ".php");

# register plugin
register_plugin(
	$thisfile, 
	'Front-End User Login', 
	'3.1', 			
	'Mike Henken',	
	'http://michaelhenken.com/', 
	'Плагин регистрации пользователей. Позволяет показывать выбранные страницы только зарегистрированным пользователям. Использует XML или MySQL.', 
	'settings', 
	'user_login_admin' 
);

# hooks

//Adds 'Members Only' Check Box In edit.php
add_action('edit-extras','user_login_edit');

//Saves 'Members Only' checkbox selection when a page is saved
add_action('changedata-save','user_login_save');

//Filter Out The Content (Checks To See If Page Is Protected Or Not)
add_filter('content','perm_check');

//Launch Function 'user_login_check' before the template is loaded on the front-end
add_action('index-pretemplate','user_login_check');

//Add tab in admin navigation bar
add_action('nav-tab','makeNavTab');

//Define Feul Settings File
define('FeulFile', GSDATAOTHERPATH  . 'user-login.xml');

//Define User Login Plugin's plugins Folder (plugins/user-login/)
define('USERLOGINPATH', GSPLUGINPATH . 'user-login/');

//Define User Login Plugin's plugins includes Folder (plugins/user-login/inc/)
define('LOGININCPATH', GSPLUGINPATH . 'user-login/inc/');

//Define The User Data Storage Folder (data/site-users)
define('SITEUSERSPATH', GSDATAPATH . 'site-users/');



function makeNavTab()
{
	$plugin = 'user_login';
	$class = '';
	$txt = '<em>У</em>правление пользователями';
	if (@$_GET['id'] == @$plugin) {
		$class='class="tabSelected"';
	}
	echo '<li><a href="load.php?id='.$plugin.'" '.$class.' >';
	echo $txt;
	echo "</a></li>";
}	

//Include Feul class
require_once(USERLOGINPATH.'class/Feul.php');

/** 
* Check If Page Is Protected Or Not. 
* Then, Either Blocks Access Or Shows Content, Depending On If Logged In Or Not
*
* @param string $content the content for the page.. It comes through the content filter (hook)
*
* @return string content or page protected message
*/  
function perm_check($content)
{
	$Feul = new Feul;
	if($Feul->checkPerm() == true)
	{
		return $content;
	}
	else
	{
		return $Feul->getData('protectedmessage');
	}
}

/** 
* Proccess Admin User Login Settings and various contional statements related to this plugin.
*
* @return string content or page protected message
*/  
function user_login_admin()
{
	$Feul = new Feul;
	if(isset($Feul->first) && !isset($_GET['settings']))
	{
		echo '<div class="error"><a href="load.php?id=user_login&settings">Кликните здесь</a>, чтобы выбрать метод хранения и другие параметры.</div>';
	}
?>	
	<link rel="stylesheet" type="text/css" href="../plugins/user-login/css/admin_style.css" />
	<div style="width:100%;margin:0 -15px -15px -10px;padding:0px;">
		<h3  class="floated">Плагин регистрации пользователей</h3>
		<div class="edit-nav clearfix">
			<p>
				<a href="load.php?id=user_login&help">Помощь</a>
				<a href="load.php?id=user_login&settings">Настройки</a>
				<a href="load.php?id=user_login&email=yes">Письма</a>
				<a href="load.php?id=user_login&manage=yes">Управление</a>
			</p>
		</div>
	</div>
	</div>
	<div class="main" style="margin-top:-10px;">
	<?php
	if(isset($_GET['email']))
	{
		if(isset($_POST['send-email']))
		{	
			if(isset($_POST['send_all']))
			{
				if($Feul->Storage == 'XML')
				{
					$dir = SITEUSERSPATH."*.xml";
					// Make Edit Form For Each User XML File Found
					foreach (glob($dir) as $file) 
					{
						$xml = simplexml_load_file($file) or die("Unable to load XML file!");
						$Feul->processEmailUser($xml->EmailAddress, $xml->Username, $_POST['email'], $_POST['subject'], $_POST['post-email-message']);
					}
					echo '<div class="updated">Письма успешно отправлены</div>';
				}

				elseif($Feul->Storage == 'DB')
				{
					try 
					{
						$sql = "SELECT * FROM ".$this->DB_Table_Name;
						foreach ($this->dbh->query($sql) as $row)
						{
							$Feul->processEmailUser($row['EmailAddress'], $row['Username'], $_POST['email'], $_POST['subject'], $_POST['post-email-message']);
						}
						echo '<div class="updated">Письма успешно отправлены</div>';
					}
					catch(PDOException $e)
					{
						echo '<div class="error">Ошибка: '.$e->getMessage().'</div>';
					}
				}
			}
			else
			{
				$emails = $Feul->processEmailUser($_POST['email_to'], null, $_POST['email'], $_POST['subject'], $_POST['post-email-message']);
				if($emails != false)
				{
					echo '<div class="updated">Письма успешно отправлены</div>';
				}
			}
		}
	global $text_area_name;
	$text_area_name = 'post-email-message';
	?>
		<h3>Настройки писем для пользователей</h3>
		<form method="post" action="load.php?id=user_login&email=yes&send-email=yes">
		    <div style="padding:10px;margin-bottom:15px;background-color:#f6f6f6;">
			<p>
				<label for="from-email">Адрес электронной почты  в поле "От"</label>
				<input type="text" name="email" class="text" value="<?php echo $Feul->getData('email'); ?>" />
			</p>
			</div>
			<div style="padding:10px;margin-bottom:15px;background-color:#f6f6f6;">
			<p>
				<label>Выбрать, чтобы отправить письма всем пользователям</label>
				<input type="checkbox" name="send_all" />
			</p>
			<p style="margin-top:-10px; margin-bottom:10px;">
				<label>ИЛИ:</label>
			</p>
			<p>
				<label for="subject">Введите адреса электронной почты получателей здесь. Разделять запятой.</label>
				<input style="width:100%!important;" type="text" name="email_to" class="text" value="" />
			</p>
			</div>
			<div style="padding:10px;margin-bottom:15px;background-color:#f6f6f6;">
			<p>
				<label for="subject">Тема электронного письма</label>
				<input style="width:50%!important;" type="text" name="subject" class="text" value="" />
			</p>
			<label for="email-message">Содержание письма:</label>
			<textarea name="post-email-message"></textarea>
			<?php include(USERLOGINPATH . 'ckeditor.php'); ?>
			<br><br><input type="submit" class="submit" name="send-email" value="Отправить" />
			</div>
		</form>
	<?php
	}
	elseif(isset($_GET['settings']))
	{
		if(isset($_POST['storage']))
		{
			$submit_settings = $Feul->processSettings();
			if($submit_settings == true)
			{
				echo '<div class="updated">Настройки плагина успешно сохранены!</div>';
			}
			else
			{
				echo '<div class="error">Настройки не могут быть сохранены!</div>';
			}
		}
		elseif(isset($_GET['create_db']))
		{	
			$create_db = $Feul->createDB();
			if($create_db != false)
			{
				echo '<div class="updated">Создать базу данных</div>';
			}
		}
		elseif(isset($_GET['create_tb']))
		{
			$check_table = $Feul->checkTable();
			if($check_table == '1')
			{
				echo '<div class="error">Таблица базы данных уже существует.</div>';
			}
			else
			{
				$create_table = $Feul->createDBTable();
				$check_table_again = $Feul->checkTable();
				if($check_table_again == '1')
				{
					echo '<div class="updated">Таблица базы данных создана.</div>';
				}
				elseif($check_table_again != 1)
				{
					echo '<div class="error">Таблица базы данных не может быть создана.</div>';
				}
			}
		}
		?>			
			<form method="post">
			<h2>Параметры хранения</h2>
			<p>
				<label>Выберите метод хранения</label>
				<input type="radio" name="storage" value="XML" <?php if($Feul->Storage == 'XML') { echo ' CHECKED'; } ?> /> Файлы XML
				<br/>
				<input type="radio" name="storage" value="DB" <?php if($Feul->Storage == 'DB') { echo ' CHECKED'; } ?> /> Базы данных
			</p>
			
			<h4>Настройки базы данных</h4>
			<p>
				<label>Хост</label>
				<input type="text" class="text full" name="db_host" value="<?php if($Feul->DB_Host == '') { } else { echo $Feul->DB_Host; } ?>" />
			</p>
			<p>
				<label>Имя пользователя</label>
				<input type="text" class="text full" name="db_user" value="<?php if($Feul->DB_User == '') { } else { echo $Feul->DB_User; } ?>" />
			</p>
			<p>
				<label>Пароль</label>
				<input type="text" class="text full" name="db_pass" value="<?php if($Feul->DB_Pass == '') {  } else { echo $Feul->DB_Pass; } ?>" />
			</p>
			<p>
				<label>Имя базы данных</label>
				Вы можете выбрать любое имя базы данных. <strong>Если авто-создание не удается,</strong> вам придется добавить префикс db_name к имени пользователя mysql <br>(например: username_dbname)
				<input type="text" class="text full" name="db_name" value="<?php if($Feul->DB_Name == '') { echo ''; } else { echo $Feul->DB_Name; } ?>" />
			</p>
			<p>
				<label>Имя таблицы базы данных</label>
				Мы настоятельно рекомендуем оставить это 'users'<br/>
				<input type="text" class="text full" name="db_table_name" value="<?php if($Feul->DB_Table_Name == '') { echo 'users'; } else { echo $Feul->DB_Table_Name; } ?>" />
			</p>
			<p>
				<label>Ошибки PDO (Сообщения об ошибках базы данных)</label>
				<input type="radio" name="errors" value="On" <?php if($Feul->Errors == 'On') { echo ' CHECKED'; } ?> /> Включить
				<br/>
				<input type="radio" name="errors" value="Off" <?php if($Feul->Errors == 'Off') { echo ' CHECKED'; } ?> /> Отключить
			</p>
			<p>
				<input type="submit" name="Feul_settings_form" class="submit" value="Сохранить" />
			</p>
			<p>
				<a href="load.php?id=user_login&settings&create_db">Попытаться создать базу данных</a><br/>
				<a href="load.php?id=user_login&settings&create_tb">Попытаться создать таблицу базы данных</a>
			</p>
			</div>
			<div class="main" style="margin-top:-10px;">
				<h2>Настройки электронной почты</h2>
				<p>
					<label>Редактировать адрес электронной почты "От"</label>Этот адрес указывается в поле "От" в письме, высылаемом пользователю после регистрации:<br/>
					<input type="text" name="post-from-email" class="text full" value="<?php echo $Feul->getData('email'); ?>" />
				</p>
				
			</div>
			<div class="main" style="margin-top:-10px;">
			<h2>CSS и предупреждение для незарегистрированных пользователей</h2>
				<p>
					<label>Редактировать CSS формы входа</label>
					<textarea name="post-login-container" class="full" style="height:300px;">
						<?php echo $Feul->LoginCss; ?>
					</textarea>
				</p>
				<p>
					<label>Редактировать CSS сообщения после входа</label>
					<textarea name="post-welcome-box" class="full" style="height:300px;">
						<?php echo $Feul->WelcomeCss; ?>
					</textarea>
				</p>
				<p>
					<label>Редактировать CSS формы регистрации</label>
					<textarea name="post-register-box" class="full" style="height:300px;">
						<?php echo $Feul->RegisterCss; ?>
					</textarea>
				</p>
				<p>
					<label>Редактировать предупреждение</label>
					<textarea name="post-protected-message">
						<?php global $text_area_name; $text_area_name = 'post-protected-message'; echo $Feul->ProtectedMessage; ?>
					</textarea>
					</p>
				<?php include(USERLOGINPATH . 'ckeditor.php'); ?>
				<p>
					<input type="submit" name="Feul_settings_form" class="submit" value="Сохранить" />
				</p>
			</form>
			<br/>
			<?php
	}
	elseif(isset($_GET['edit_user']))
	{
		if(isset($_POST['Feul_edit_user']))
		{
			if($_POST['old_name'] != $_POST['usernamec'])
			{
				$change_name = $_POST['usernamec'];
			}
			else
			{
				$change_name = null;
			}

			$posted_password = $_POST['nano'];	
			if(isset($_POST['userpassword']))
			{
				$change_pass = $_POST['userpassword'];
			}
			else
			{
				$change_pass = null;
			}
			
			
			if($Feul->Storage == 'XML')
			{
				$Feul->processEditUser($_POST['old_name'], $posted_password, $_POST['useremail'], $change_pass, $change_name);
			}
			elseif($Feul->Storage == 'DB')
			{
				$Feul->processEditDBUser($_POST['userID'], $_POST['usernamec'], $posted_password, $_POST['useremail']);
			}
			if($change_name != null)
			{
				print '<meta http-equiv="refresh" content="0;url=load.php?id=user_login&edit_user='.$change_name.'">';
			}
		}
		editUser($_GET['edit_user']);
	}
	elseif(isset($_GET['help']))
	{
		if(isset($_GET['convert']))
		{
			$convert = $Feul->convertXmlToDB();
			echo '<div class="updated">Пользователи успешно конвертированы</div>';
		}
	?>
		<h2>Информация о плагние:</h2>

		<h4>Функции</h4>

		<p>
			<label>Показать форму входа:</label>
			<?php highlight_string('<?php echo show_login_box(); ?>'); ?>
		</p>

		<p>
			<label>Показать приветствие:</label>
			Если пользователь вошел, по умолчанию отображается "Добро пожаловать =Имя пользователя=" и ссылка для выхода из системы.<br/>
			<?php highlight_string('<?php echo welcome_message_login(); ?>'); ?>
		</p>

		<p>
			<label>Показать форму регистрации:</label>
			<?php highlight_string('<?php user_login_register(); ?>'); ?>
		</p>

		<h4>Отображение контента только авторизованным пользователям</h4>
		<ol>
			<li>Вы можете блокировать доступ к определенной странице, выбрав "Только для зарегистрированных" в "Свойствах" этой страницы.<br/>
				Если страница "Только для зарегистрированных", пока пользователь не войдет в систему он будет видеть "Предупреждение", которое можно отредактировать <a href="load.php?id=user_login&settings">здесь</a>
			</li><br/>
			<li>
				Если вы хотели бы разместить содержание приветствия или какой-либо код в шаблоне вам придется использовать немного PHP. <br/> Ниже приведен пример для показа "Hello World" только авторизированным пользователям.<br/>
<pre>
<?php highlight_string('<?php if(!empty($_SESSION[\'LoggedIn\']))	{ ?>'); ?>
	Helo World
<?php highlight_string('<?php } ?>'); ?>
</pre>
			</li>
		</ol>

		<h4>Помощь и поддержка</h4>
		<p>
			Если вы обнаружили какие-либо баги/ошибки или нужна любая помощь, пожалуйста, посетите форум поддержки <a href="http://get-simple.info/forum/topic/2342/front-end-user-login-plugin-xml-ver-25/">здесь</a>
		</p>
		</div>

		<div class="main" style="margin-top:-10px;">
		<h2>Преобразование файлов XML в базу данных</h2>
		<p>
			После клика на ссылке ниже файлы XML всех пользователей будут конвертированы в базу данных.<br/>
			<strong>Вы должны ввести все данные о базе данных на странице настроек, и база данных и таблицы должны быть созданы до преобразования.</strong><br/>
			<a href="load.php?id=user_login&help&convert">Конвертировать XML в базу данных</a>
		</p>
	<?php
	}
	else
	{
		if(isset($_GET['manage']))
		{
			if(isset($_GET['adduser']))
			{		
				$Add_User = $Feul->processAddUserAdmin($_POST['usernamec'],$_POST['userpassword'],$_POST['useremail']);
				if($Add_User == false) 
				{
					echo '<div class="error">Имя пользователя уже создано.</div>';
				}
				else
				{
					echo '<div class="updated">Пользователь успешно добавлен.</div>';
				}
			}
			elseif (isset($_GET['deleteuser'])) 
			{
				if($Feul->Storage == 'XML')
				{
					$deleteUser = $Feul->deleteUser($_GET['deletename']);
				}			
				elseif($Feul->Storage == 'DB')
				{
					$deleteUser = $Feul->deleteUser($_GET['deleteuser']);
				}
				if($deleteUser == true)
				{
					echo '<div class="updated" style="display: block;">'.$_GET['deletename'].' успешно удален</div>';
				}
				else
				{
					echo '<div class="updated" style="display: block;"><span style="color:red;font-weight:bold;">ОШИБКА!!</span> - Невозможно удалить пользователя.</div>';
				}
			}
		}
		manageUsers();
	}
}

function manageUsers()
{
	$Feul = new Feul;
	$users = $Feul->getAllUsers();
	if($Feul->Storage == 'DB')
	{
		$users = (array) $users;
	}
		?>
		<div id="profile" class="hide-div section" style="display:none;margin-top:-30px;">
			<form method="post" action="load.php?id=user_login&manage=yes&adduser=yes">
				<h3>Добавить пользователя</h3>
				<div class="leftsec">
					<p>
						<label for="usernamec" >Имя пользователя:</label>
						<input class="text" id="usernamec" name="usernamec" type="text" value="" />
					</p>
				</div>
				<div class="rightsec">
					<p>
						<label for="useremail" >Email :</label>
						<input class="text" id="useremail" name="useremail" type="text" value="" />
					</p>
				</div>
				<div class="leftsec">
					<p>
						<label for="userpassword" >Пароль:</label>
						<input autocomplete="off" class="text" id="userpassword" name="userpassword" type="text" value="" />
					</p>
				</div>
				<div class="clear"></div>
				<p id="submit_line" >
					<span>
						<input class="submit" type="submit" name="submitted" value="Добавить пользователя" />
					</span> &nbsp;&nbsp;<?php i18n('OR'); ?>&nbsp;&nbsp; 
					<a class="cancel" href="#"><?php i18n('CANCEL'); ?></a>
				</p>
			</form>
		</div>
		<h3 class="floated">Управление пользователями</h3>
		<div class="edit-nav clearfix">
			<p>
				<a href="#" id="add-user">Добавить нового пользователя</a>
			</p>
		</div>
		<?php
		if($users != false) 
		{ 
		?>
			<table class="highlight" style="width:900px">
				<tr>
					<th>Имя</th>
					<th>Email</th>
				<tbody>
			<?php
			// Make Edit Form For Each User XML File Found
			foreach ($users as $row)
			{
				if($Feul->Storage == 'XML')
				{
					$Username = $row->Username;
					$EmailAddress = $row->EmailAddress;
				}
				elseif($Feul->Storage == 'DB')
				{
					$userID =  $row['userID'];
					$Username = $row['Username'];
					$EmailAddress = $row['EmailAddress'];
				}

				//Below is the User Data
				?>	
				<tr>
					<td>
						<a href="load.php?id=user_login&edit_user=<?php if($Feul->Storage == 'XML') { echo $Username; } else { echo $userID; } ?>"><?php echo $Username; ?></a>
					</td>
					<td>
						<?php echo $EmailAddress; ?>
					</td>
				</tr>
			<?php } ?>
				</tbody>
			</table>
		<?php 
		}
		elseif($users == false)
		{
			echo '<p><strong>Пока нет ни одного пользователя</strong></p>';
		}
		?>
	<script type="text/javascript">
		
		/*** Show add-user form ***/
		$("#add-user").click(function () {
			$(".hide-div").show();
			$("#add-user").hide();
		});
		
		/*** Hide user form ***/
		$(".cancel").click(function () {
			$(".hide-div").hide();
			$("#add-user").show();
		});
	</script>
	<?php
}

function editUser($id)
{
	$id = urldecode($id);
	$Feul = new Feul;
	?>
	<h3>Информация о пользователе</h3>
	<form method="post" action="load.php?id=user_login&edit_user=<?php echo $id; ?>">
		<div class="leftsec">
			<p>
				<label for="usernamec" >Имя:</label>
				<input class="text" id="usernamec" name="usernamec" type="text" value="<?php echo $Feul->getUserDataID($id,'Username'); ?>" />
			</p>
		</div>
		<div class="rightsec">
			<p>
				<label for="useremail" >Email :</label>
				<input class="text" id="useremail" name="useremail" type="text" value="<?php echo $Feul->getUserDataID($id,'EmailAddress'); ?>" />
			</p>
		</div>
		<div class="leftsec">
			<p>
				<label for="userpassword" >Сменить пароль:</label>
				<input autocomplete="off" class="text" id="userpassword" name="userpassword" type="text" value="" />
			</p>
		</div>
		<div class="clear"></div>
		<p id="submit_line">
			<span>
				<input class="submit" type="submit" name="Feul_edit_user" value="Сохранить изменения" /> &nbsp;&nbsp;или&nbsp;&nbsp; <a class="cancel" style="color: #D94136;text-decoration:underline;cursor:pointer" ONCLICK="decision('Вы уверены, что хотите удалить <?php echo $Feul->getUserDataID($id,'Username'); ?>?','load.php?id=user_login&manage=yes&deleteuser=<?php echo $id; ?>&deletename=<?php echo $Feul->getUserDataID($id,'Username'); ?>')">Удалить пользователя</a>
				<input type="hidden" name="nano" value="<?php echo $Feul->getUserDataID($id,'Password'); ?>"/>
				<input type="hidden" name="old_name" value="<?php echo $Feul->getUserDataID($id,'Username'); ?>"/>
				<input type="hidden" name="userID" value="<?php echo $id; ?>"/>
			</span>
		</p>
	</form>
	<script type="text/javascript">
		/*** Confirm the user wants to delete a user ***/
		function decision(message, url){
			if(confirm(message)) location.href = url;
		}
	</script>
	<?php
}


/*******
Function To: 
Displays Login Box On Front-End Of Website
*******/
function show_login_box()
{
	$Feul = new Feul;
	//If The User Is Not Logged In - Display Login Box - If They Are Logged In, Display Nothing
	if(!isset($_SESSION['LoggedIn']))
	{	
		echo $Feul->getData('logincontainer');
		$is_loggedIn = $Feul->checkLogin();
		//HTML Code For Login Container
		?>
		<div id="login_box" style="">
			<h2 class="login_h2">Вход</h2>
			<?php
				if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['login-form']) && $is_loggedIn == false)
				{
					echo '<div class="error">Sorry, your account could not be found. Please try again.</div>';
				}
			?>
			<form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>" name="loginform" id="loginform">
				<p>
					<label for="username">Имя пользователя: </label>
					<input type="text" name="username" class="user_login_username" />
				</p>
				<p>
					<label for="username">Пароль: </label>
					<input type="password" name="password" class="user_login_password" />
				</p>
				<p>
					<input type="submit" class="user_login_submit" value="Войти"/>
				</p>
				<input type="hidden" name="login-form" value="login" />
			</form>
			<div style="clear:both"></div>
		</div>
		<?php
	}
}

/*******
Function To: 
Show Welcome Message If User Is Logged In - If Not Logged In, Display nothing
*******/
function welcome_message_login()
{
	global $SITEURL;
	$Feul = new Feul;
	if(isset($_SESSION['LoggedIn']))
	{
		$name  = $_SESSION['Username'];
		//Display Welcome Message
		$welcome_box = '<div class="user_login_welcome_box_container"><span class=\"user-login-welcome-label\">Добро пожаловать: </span>'.$name.'</div>';

		//Display Logout Link
		$logout_link = '<a href="'.$SITEURL.'?logout=yes" class="user-login-logout-link">Выйти</a>';
		echo $Feul->getData('welcomebox').$welcome_box.$logout_link ;
	}
}

/*******
Function To: 
Check If User Is Logged In - Also Starts Session And Connects To Database
*******/
function user_login_check()
{
	$Feul = new Feul;
	$Feul->checkLogin();
	/* 
	If Logout Link Is Clicked:
	Log Client Out (End Session) 
	*/
	if(isset($_GET['logout']) && empty($_POST['login-form']))
	{
		if(!empty($_SESSION['LoggedIn']) && !empty($_SESSION['Username']))
		{
			$_SESSION = array(); 
			session_destroy();
		}
	}	
}


/*******
Function To: 
Register Form And Processing Code - Display's And Processes Register Form
*******/
function user_login_register()
{
	global $SITEURL;
	$Feul = new Feul;
	$error = '';
	//If User Is Not Logged In
	if(!isset($_SESSION['LoggedIn']))
	{
		if(isset($_POST['register-form']))
		{
			//If Register Form Was Submitted
			if($_POST['username'] != '' && $_POST['password'] != '' && $_POST['email'] != '')
			{		
				$addUser = $Feul->processAddUserAdmin($_POST['username'], $_POST['password'], $_POST['email']);
				if($addUser == true)
				{
					echo '<div class="success">Ваша учетная запись была успешно создана.</div>';
					$Feul->checkLogin(true, $_POST['email'], $_POST['password']);
					//Send Email
					$to  = $_POST['email'];
					$Username = $_POST['username'];
					$chosen_password = $_POST['password'];

					// subject
					$subject = 'Ваш новый аккаунт ('.$Username.') настроен!';

					// message
					$message = '
					<html>
					<head>
					<title>Ваш новый аккаунт настроен!</title>
					</head>
					<body>
					<h2><strong>Регистрационная информация:</strong></h2><br/><br/>
					<strong>Имя пользователя: </strong>'.$Username.'<br/>
					<strong>Пароль: </strong>'.$chosen_password.'<br/>
					<br/>
					<a href="'.$SITEURL.'">Кликните здесь для перехода на сайт</a>
					</body>
					</html>
					';

					// To send HTML mail, the Content-type header must be set
					$headers  = 'MIME-Version: 1.0' . "\r\n";
					$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

					// Additional headers
					//$headers .= 'To: Mary <mary@example.com>, Kelly <kelly@example.com>' . "\r\n";
					$headers .= 'От: Новый аккаунт <'.$Feul->getData('email').'>' . "\r\n";
					//$headers .= 'Cc: birthdayarchive@example.com' . "\r\n";
					//$headers .= 'Bcc: birthdaycheck@example.com' . "\r\n";

					// Mail it
					$success = mail($to, $subject, $message, $headers);
					if(!$success)
					{
						$error = '<div class="error">Невозможно отправить приветственное письмо.</div>';
					}
				}
				else
				{
					$error = '<div class="error">Пользователь уже существует.</div>';
				}
			}
			else
			{
				$error = '<div class="error">Пожалуйста, заполните все необходимые поля.</div>';
			}
		}
		echo $Feul->getData('registerbox');
		?>
			<?php echo $error; ?>
			<h2 class="register_h2">Регистрация</h2>
			<form method="post" action="<?php echo $_SERVER['REQUEST_URI']; ?>" name="registerform" id="registerform">
				<p>
					<label for="username" class="required" >Имя пользователя:</label>
					<input type="text" class="required" name="username" id="name" />
				</p>
				<p>
					<label for="email" class="required" >Email:</label>
					<input type="text" class="required" name="email" />
				</p>
				<p>
					<label for="password" class="required" >Пароль:</label>
					<input type="password" class="required" name="password" id="password" />
				</p>
				<p>
					<input type="submit" name="register" id="register" value="Регистрация" />
					<input type="hidden" name="register-form" value="yes" />
				</p>
			</form>
		<?php
	}	
}

//Displays members Only Checkbox In edit.php
function user_login_edit()
{
	$Feul = new Feul;
	$member_checkbox = '';
	if($Feul->showMembersPermBox() == true)
	{
		$member_checkbox = "checked";	
	}
	?>
		<div style="margin-top:20px;">
			<p>
				<label style="display:inline!important; margin-right:10px;" for="member-only">Только для зарегистрированных:</label>
				<input style="width:auto;" type="checkbox" value="yes" name="member-only" <?php echo $member_checkbox; ?> />
			</p>
		</div> 
	<?php
}

//Saves Value Of Checkbox in function - user_login_edit()
function user_login_save()
{
	global $xml;
	if(isset($_POST['member-only']))
	{ 
		$node = $xml->addChild(strtolower('memberonly'))->addCData(stripslashes($_POST['member-only']));	
	}
}