import PageManager from './page-manager';
import utils from '@bigcommerce/stencil-utils';
import haloAddOption from './halothemes/haloAddOptionForProduct';
/* eslint-disable no-unused-vars */
/* eslint-disable padded-blocks */

export default class Home extends PageManager {
    loaded(next) {

        // HaloThemes functions
        this.loadSection();
    }

    loadSection() {
    	var check_PdByCate = true;
    	var check_homeBrands = true;
    	var check_instagramFeed = true;
		const $context = this.context;

    	const $sec_PdByCate = $('section[data-prod-by-cat-name]').eq(0);
    	if ($sec_PdByCate.length) {
    		var productsByCategory_top = $sec_PdByCate.offset().top - screen.height;
    	}

    	const $sec_instagramFeed = $('#InstagramGallery').eq(0);
    	if ($sec_instagramFeed.length) {
    		var instagramFeed_top = $sec_instagramFeed.offset().top - screen.height;
    	}

    	const $sec_homeBrands = $('#homeBrands').eq(0);
    	if ($sec_homeBrands.length) {
    		var homeBrands_top = $sec_homeBrands.offset().top - screen.height;
    	}

    	$(window).scroll(function() {
    		const $tScroll = $(this).scrollTop();
    		checkLoadSection($tScroll)
       	});

     	window.onload = function() {
     		const $tScroll = $(this).scrollTop();
     		checkLoadSection($tScroll)
     	}

     	function checkLoadSection($tScroll) {
     		if ($sec_PdByCate.length) {
	    		if (check_PdByCate && $tScroll > productsByCategory_top) {
	    			check_PdByCate = false;
	        		ProductsByCategory($context);
	    		}
	    	}

	    	if ($sec_instagramFeed.length) {
	    		if (check_instagramFeed && $tScroll > instagramFeed_top) {
	    			check_instagramFeed = false;
	        		instagramFeed($context);
	    		}
	    	}

	    	if ($sec_homeBrands.length) {
	    		if (check_homeBrands && $tScroll > homeBrands_top) {
	    			check_homeBrands = false;
	        		homeBrands();
	    		}
	    	}
     	}

	    function ProductsByCategory($context) {
	    	const productsToShow = 4;

	    	$('section[data-prod-by-cat-name]').each(function(index, el) {
			    const $prodLoading = $('<div class="loadingOverlay"></div>');
			    const $thisCategory = $(this);
			    const $thisProducts = $(this).children('.category-products');
			    const $catUrl = $(this).data('prod-by-cat-url');
			    const options = {
			        template: 'halothemes/halo-products-by-category-item',
			    };

			    $thisProducts.prepend($prodLoading.show());

			    utils.api.getPage($catUrl, options, (err, response) => {

			        $thisProducts.children('.productBlockContainer').html(response);

			        if ($thisProducts.children('.productBlockContainer').find('.prod-item').length >= 5) {
			            $thisProducts.children('.productBlockContainer').find('.prod-item:nth-child(n+5)').css({ 'display': 'none' });
			            $thisProducts.append('<div class="showMoreProduct text-center"><a class="btn btn-alt" href="javascript:void(0);">Show More</a></div>');
			        }
			        
			        haloAddOption($context);
			        $thisProducts.children('.loadingOverlay').remove();
			    });
			});

		    $(document).on('click', '.showMoreProduct a', function() {
		        if ($(this).parent().parent().children('.productBlockContainer').find('.prod-item:hidden').length > 0) {
		            $(this).parent().parent().children('.productBlockContainer').find('.prod-item:hidden:lt(' + productsToShow + ')').show();
		            if ($(this).parent().parent().children('.productBlockContainer').find('.prod-item:hidden').length === 0) {
		                // no more products
		                $('.showMoreProduct a.btn').text('No More Products').addClass('disabled');
		            }
		        }
		    });
	    }

	    function instagramFeed($context) {
	    	if ($context.themeSettings.halo_home_instafeed) {
		    	if ($('#instafeed').length > 0) {
			        $('#instafeed').each(function() { // the containers for all your galleries
			            $(this).magnificPopup({
			                delegate: 'a.btn-quickview', // the selector for gallery item
			                type: 'image',
			                mainClass: 'mfp-fade mfp-instagram',
			                gallery: {
			                    enabled: true
			                },
			                image: {
			                    titleSrc: function(item) {
			                        return item.el.attr('feed-caption');
			                    }
			                }
			            });
			        });
			    }
	    	}
	    }

	    function homeBrands() {
	    	const $brands_carousel = $('#homeBrands .owl-carousel');

	    	if ($brands_carousel.length) {
		        $brands_carousel.owlCarousel({
		            items: 5,
		            nav: true,
		            margin: 30,
		            dots: false,
		            slideBy: 5,
		            responsive: {
						0: {
						  items: 1,
						  slideBy: 1
						},
						420: {
						  items: 2,
						  slideBy: 2
						},
						560: {
						  items: 3,
						  slideBy: 3
						},
						768: {
						  items: 4,
						  slideBy: 4
						},
						992: {
						  items: 4,
						  slideBy: 4
						},
						1200: {
						  items: 5,
						  slideBy: 5
						}
		            },
		            responsiveRefreshRate: 0
		        });
		    }
	    }
    }
}
