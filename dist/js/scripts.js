$(document).ready(function() {
   // OWL Carousel
  var carousel = $('.slider'),
      carouselNext = $('.slider-next'),
      carouselPrev = $('.slider-prev');

  carousel.owlCarousel({
    items: 1,
    autoPlay: true
  });

  carouselNext.click(function() {
    carousel.trigger('next.owl.carousel');
  });

  carouselPrev.click(function() {
    carousel.trigger('prev.owl.carousel');
  });

  $('.top-nav').on('click', 'a', function(event) {
    if ($(this).attr('href')[0] === '#') {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top + 45
      }, 500);
    }
  });
});
