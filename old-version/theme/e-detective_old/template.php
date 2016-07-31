<?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); }
/****************************************************
*
* @File: 			template.php
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
				<?php get_page_content(); ?>
			</div>
		</div>
	</div>

<div class="separator"></div>

<div id="independent-block">Вверх</div>
<?php include('footer.php'); ?>