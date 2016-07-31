<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			sidebar-top.php
* @Package:		GetSimple
* @Action:		Theme for E-Detective
*
*****************************************************/
?>

	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-1 sidebar-top text-right">
				<div class="menu-icon-xs text-center"><span class="glyphicon glyphicon-align-justify"></span></div>
				<div class="go-up-xs text-center"><span class="glyphicon glyphicon-chevron-up"></span></div>
			</div>
		</div>
	</div>

	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-12">
				<div class="nav-panel-xs">
					<div class="text-center sidebar-logo">
						<a href="/"><img src="<?php get_theme_url(); ?>/img/logo.png" alt="Электронный детектив" width="150px" class="img-circle"></a>
					</div>
					<h1 class="text-center">Электронный детектив</h1>
					<ul class="nav nav-pills nav-stacked text-center">
						<?php get_navigation(); ?>
					</ul>
				</div>
			</div>
		</div>
	</div>