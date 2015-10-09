<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			bank.php
* @Package:		GetSimple
* @Action:		Theme for E-Detective
*
*****************************************************/

include('header.php'); 
?>

<div class="separator"></div>

	<div class="container">
		<div class="row">
			<div class="col-sm-12" id="content">
				<div class="col-sm-6 col-md-4 col-xs-12 text-center">
					<a href="#">
						<img src="<?php get_theme_url(); ?>/img/det1_bg.jpg" alt="Ограбление сейфа" class="img-responsive center-block">
					</a>
					<h4>Ограбление сейфа</h4>
				</div>
				<div class="col-sm-6 col-md-4 col-xs-12 text-center">
					<a href="#">
						<img src="<?php get_theme_url(); ?>/img/det2_bg.jpg" alt="Кража древнего свитка" class="img-responsive center-block">
					</a>
					<h4>Кража древнего свитка</h4>
				</div>
				<div class="col-sm-6 col-md-4 col-xs-12 text-center">
					<a href="#">
						<img src="<?php get_theme_url(); ?>/img/det3_bg.jpg" alt="Кража кота Мурзика" class="img-responsive center-block">
					</a>
					<h4>Кража кота Мурзика</h4>
				</div>
			</div>
		</div>
	</div>

<div class="separator"></div>

<div id="independent-block">Вверх</div>
<?php include('footer.php'); ?>