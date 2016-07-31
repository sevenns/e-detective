<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			header.php
* @Package:		GetSimple
* @Action:		Theme for E-Detective
*
*****************************************************/
?><!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" > <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php get_page_clean_title(); ?> - <?php get_site_name(); ?></title>
	<meta name="robots" content="index, follow">
	<link href="<?php get_theme_url(); ?>/css/bootstrap.css" rel="stylesheet">
	<link rel="stylesheet" href="<?php get_theme_url(); ?>/css/decide.css">
	<link href="<?php get_theme_url(); ?>/css/main.css" rel="stylesheet">
	<script src="<?php get_theme_url(); ?>/js/jquery-1.11.3.min.js"></script>
	<!--[if lt IE 9]>
		<script src="<?php get_theme_url(); ?>/js/html5shiv-3.7.2.min.js"></script>
		<script src="<?php get_theme_url(); ?>/js/respond-1.4.2.min.js"></script>
	<![endif]-->
	<script src="<?php get_theme_url(); ?>/js/resolution.lib.js"></script>
	<script src="<?php get_theme_url(); ?>/js/resModule.lib.js"></script>
	<script src="<?php get_theme_url(); ?>/js/main.js"></script>
	<script src="<?php get_theme_url(); ?>/js/scrollup.js"></script>
	<?php get_header(); ?>
</head> 
<body id="<?php get_page_slug(); ?>" >
	<header>
		<div class="container">
			<div class="row">
				<div class="col-sm-12">
					<div class="col-xs-12 col-sm-3 col-md-6">
						<div class="col-sm-12 col-md-3 text-center header-logo">
							<a href="/e-detective/"><img src="<?php get_theme_url(); ?>/img/logo.png" alt="Электронный детектив" width="110px" class="img-circle"></a>
						</div>
						<div class="col-md-9 hidden-xs hidden-sm">
							<h1>Электронный детектив</h1>
						</div>
					</div>
					<div class="col-sm-9 col-md-6">
						<ul class="list-inline text-center header-nav">
							<?php get_navigation() ?>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</header>