$(document).ready(function() {
  setFullHeight($('.top-panel')); // Default top-panel height

   // OWL Carousel
  var carousel = $('.slider'),
      carouselNext = $('.slider-next'),
      carouselPrev = $('.slider-prev');

  carousel.owlCarousel({
    singleItem: true,
    autoPlay: true
  });

  carouselNext.click(function() {
    carousel.trigger('owl.next');
  });

  carouselPrev.click(function() {
    carousel.trigger('owl.prev');
  });
});

//Anchor links
$(document).on('click', 'a', function(event) {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: $($.attr(this, 'href')).offset().top + 45
  }, 500);
});

function setFullHeight(elem, customBottomOffset = 0) {
  var html = document.documentElement;

  elem.css('height', html.clientHeight - customBottomOffset);
}