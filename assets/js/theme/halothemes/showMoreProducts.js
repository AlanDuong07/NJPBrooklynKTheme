import $ from 'jquery';
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import haloAddOption from './haloAddOptionForProduct';

export default function(context) {
   if ($('#homeshowmoreProducts .prod-item').length >= 5) {
      $('#homeshowmoreProducts .prod-item:nth-child(n+5)').css({ 'display': 'none'});
      $('#homeshowmoreProducts .container').append('<div class="showMoreProduct text-center"><a class="btn btn-alt" href="javascript:void(0);">Show More</a></div>');
   }

   const productsToShow = 4;
   const totalProducts = $('#homeshowmoreProducts .prod-item');
   $('.showMoreProduct a').click(function() {
      if ($('#homeshowmoreProducts .prod-item:hidden').length > 0) {
         $('#homeshowmoreProducts .prod-item:hidden:lt(' + productsToShow + ')').show();
         if ($('#homeshowmoreProducts .prod-item:hidden').length === 0) {
            // no more products
            $('.showMoreProduct a.btn').text('No More Products').addClass('disabled');
         }
      }
   });

   // category show more

   if ($('.page-type-category #product-listing-container .prod-item').length >= 13) {
      $('.page-type-category #product-listing-container .prod-item:nth-child(n+13)').css({ 'display': 'none' });
      $('.page-type-category #product-listing-container .product-pagination.bottom').prepend('<div class="showMoreProduct text-center"><a class="btn btn-alt" href="javascript:void(0);">Show More</a></div>');
   }
   const total_products = $('.page-type-category #product-listing-container .product-pagination.bottom').data('total_products');
   const productsToShowCat = 12;
   const totalProductsCat = $('#product-listing-container .prod-item').length;
   var total_pages = parseInt(total_products/totalProductsCat) + ( parseInt(total_products%totalProductsCat) > 0 ? 1 : 0);
   var currentPage = 1;
   const $context = context;
   
   $('.showMoreProduct a').click(function() {
      if ($('#product-listing-container .prod-item:hidden').length > productsToShowCat) {
         showProduct();
      }
      else{
         if( currentPage < total_pages){
            currentPage +=1;
            $.ajax({
               url: window.location.pathname + '?page='+ currentPage,
               success : function(response){
                  var $list_products = $('#product-listing-container .productBlockContainer', $(response));
                  $list_products.children().hide().appendTo('#product-listing-container .productBlockContainer');
                  showProduct();
                  if ($('#product-listing-container form[data-product-compare] > .module-wrapper').hasClass('productList')) {
                     $('#product-listing-container form[data-product-compare] > .module-wrapper.productList .prod-item').each(function(index, el) {
                        if ($(this).find('.btn-compare').length > 0) {
                           $(this).find('.btn-compare').appendTo($(this).find('.prod-desc'));
                        }
                     });
                  }
                  var w = $(window).width();
                  if(w < 1199) {
                     if ($('#product-listing-container form[data-product-compare] > .module-wrapper').hasClass('productGrid')) {
                        $('#product-listing-container form[data-product-compare] > .module-wrapper.productGrid .prod-item').each(function(index, el) {
                           if ($(this).find('.btn-compare').length > 0) {
                              $(this).find('.btn-compare').appendTo($(this).find('.prod-desc'));
                           }
                        });
                     }
                  } else {
                     if ($('#product-listing-container form[data-product-compare] > .module-wrapper').hasClass('productGrid')) {
                        $('#product-listing-container form[data-product-compare] > .module-wrapper.productGrid .prod-item').each(function(index, el) {
                           if ($(this).find('.btn-compare').length > 0) {
                              $(this).find('.btn-compare').appendTo($(this).find('.prod-image .actions'));
                           }
                        });
                     }
                  }
                  haloAddOption($context);
               }
            });
         }
         else{
            showProduct();
         }
      }
   });

  function showProduct(){
      if ($('#product-listing-container .prod-item:hidden').length > 0) {
         $('#product-listing-container .prod-item:hidden:lt(' + productsToShowCat+ ')').show();
         if ($('#product-listing-container .prod-item:hidden').length === 0 && currentPage == total_pages) {
            // no more products
            $('.showMoreProduct a.btn').text('No More Products').addClass('disabled');
         }
      }
      else{
         $('.showMoreProduct a.btn').text('No More Products').addClass('disabled');
      }
  }
}
