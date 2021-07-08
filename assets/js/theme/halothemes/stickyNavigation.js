import $ from 'jquery';

export default function() {

   function doSticky() {
      const $headerHeight = $('header.header').outerHeight();
      $(window).scroll(function() {
         const scrollTop = $(this).scrollTop();
         if (scrollTop > $headerHeight) {
            $('body').addClass('is-sticky');
            $('body.is-sticky').css('margin-top', $headerHeight);

            if ($('.quickSearchResultsWrap').hasClass('hasResults')) {
               $('.is-sticky #quickSearch').addClass('is-open');
            }
         } else {
            $('body').removeClass('is-sticky');
            $('body').css('margin-top', '0px');
            $('#quickSearch').remove('is-open');
         }
      });
      window.onload = function() {
         const scrollTop = $(this).scrollTop();
         if (scrollTop > $headerHeight) {
            $('body').addClass('is-sticky');
            $('body.is-sticky').css('margin-top', $headerHeight);

            if ($('.quickSearchResultsWrap').hasClass('hasResults')) {
               $('.is-sticky #quickSearch').addClass('is-open');
            }
         }
     };
   }
   doSticky();
}
