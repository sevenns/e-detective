<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			user-logon.php
* @Package:		GetSimple
* @Action:		Theme for E-Detective
*
*****************************************************/

include('header.php'); 
?>

	<div class="hidden-xs">
		<?php include('sidebar.php'); ?>
	</div>
	<div class="visible-xs">
		<?php include('sidebar-top.php'); ?>
		<div class="separator"></div>
	</div>

	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-12 col-sm-11 col-sm-offset-1 content text-center">
				<?php echo show_login_box(); ?>
				<?php echo welcome_message_login(); ?>
			</div>
		</div>
	</div>