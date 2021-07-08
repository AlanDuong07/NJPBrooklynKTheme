import utils from '@bigcommerce/stencil-utils';
import 'slick-carousel';
import swal from '../global/sweet-alert';
import Cart from '../cart';

export default function(context){

	function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
   }

   function getCookie(cname) {
      const name = cname + '=';
      const ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) === ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
         }
      }
      return '';
   }

   const deleteCookie = function(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   };

	var BC_Products = function() {
	    var e = {
	        howManyToShow: 3,
	        howManyToStoreInMemory: 10,
	        wrapperId: "history-products",
	        onComplete: null
	    };
	    var t = [];
	    var n = null;
	    var r = null;
	    var i = 0;
	    var s = {
	        configuration: {
	            expires: context.themeSettings.before_you_leave_history_expires_date,
	            path: "/",
	            domain: window.location.hostname
	        },
	        name: "bigcommerce_history",
	        write: function(e) {
	            setCookie(this.name, e.join(" "), this.configuration.expires)
	        },
	        read: function() {
	            var e = [];
	            var t = getCookie(this.name);
	            if (t !== null && t != undefined) {
	                e = t.split(" ")
	            }
	            return e
	        },
	        destroy: function() {
	            setCookie(this.name, null, this.configuration.expires)
	        },
	        remove: function(e) {
	            var t = this.read();
	            var n = $.inArray(e, t);
	            if (n !== -1) {
	                t.splice(n, 1);
	                this.write(t)
	            }
	        }
	    };
	    var o = function() {
	    	for ( var j = 0; j < e.howManyToShow; j++) {
	    		var productId = t[j];
	    		jQuery('#history-products-list-tmp').find('.productCarousel-slide[data-id="product-'+productId+'"]').appendTo(n);
	    	}
	    	jQuery('#history-products-list-tmp').remove();
	        n.show();
	        if (e.onComplete) {
	            try {
	                e.onComplete()
	            } catch (t) {}
	        }
	    };
	    var u = function() {
	    	var tmp = jQuery('#history-products-list-tmp');
	    	var unique = (function(t){
			  var m = {}, unique = []
			  for (var i=0; i<t.length; i++) {
			    var v = t[i];
			    if (!m[v]) {
			      unique.push(v);
			      m[v]=true;
			    }
			  }
			  return unique;
			})(t);

	    	for ( var j = 0; j < e.howManyToShow; j++) {
	    		var productId = t[j];
	    		utils.api.product.getById(productId, { template: 'halothemes/before-you-leave-tmp' }, (err, response) => {
		            if (err) {
		                return false;
		            }

		            $(response).appendTo(tmp);
		            i++;
                	if(i >= e.howManyToShow){
                		o();
                	}
		        });
	    	}
	        
	    };
	    return {
	        resizeImage: function(e, t) {
	            if (t == null) {
	                return e
	            }
	            if (t == "master") {
	                return e.replace(/http(s)?:/, "")
	            }
	            var n = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);
	            if (n != null && n != undefined) {
	                var r = e.split(n[0]);
	                var i = n[0];
	                return (r[0] + "_" + t + i).replace(/http(s)?:/, "")
	            } else {
	                return null
	            }
	        },
	        showHistory: function(i) {
	            var i = i || {};
	            jQuery.extend(e, i);
	            t = s.read();
	            n = jQuery("#" + e.wrapperId);
	            e.howManyToShow = Math.min(t.length, e.howManyToShow);
	            
	            if (e.howManyToShow && n.length) {
	                u()
	            }
	        },
	        getConfig: function() {
	            return e
	        },
	        clearList: function() {
	            s.destroy()
	        },
	        recordHistory: function(t) {
	            var t = t || {};
	            var product_id = $('.productView').find('form[data-cart-item-add] [name="product_id"]').val();
	            
	            jQuery.extend(e, t);
	            var n = s.read();
	            
	            if (product_id) {
	                var r = product_id;
	                var i = jQuery.inArray(r, n);
	                if (i === -1) {
	                    n.unshift(r);
	                    n = n.splice(0, e.howManyToStoreInMemory)
	                } else {
	                    n.splice(i, 1);
	                    n.unshift(r)
	                }
	                s.write(n)
	            }
	        }
	    }
	}();
	
	// Before You Leave 
	function ProductsCarousel(tab) {
		if(!tab.hasClass('slick-slider')) {
	        tab.slick({
	            dots: true,
	            arrows: true,
	            slidesToShow: 1,
	            slidesToScroll: 1,
	            slidesPerRow: 1,
                rows: 1,
	            mobileFirst: true,
	            infinite: false,
	            responsive: [
	            {
	              breakpoint: 1024,
	              settings: {
	                slidesPerRow: 1,
                    rows: 3
	              }
	            },
	            {
	              breakpoint: 767,
	              settings: {
	                slidesPerRow: 1,
                    rows: 2
	              }
	            }
	          ]
	        });
	    }
	}

    function beforeYouLeave() {
        var beforeYouLeave_time = parseInt($('#before-you-leave').data("time")) * 60 * 1000;
        var beforeYouLeave = $("#before-you-leave");

        var productLoadTime = beforeYouLeave_time/2;

 		if (beforeYouLeave_time < 2) {
        	beforeYouLeave_time = beforeYouLeave_time + 100;
        }

        if (!$(beforeYouLeave).length) {
            return;
        } else {
        	var idleTime = 0;

	        $(document).ready(function () {
	            setTimeout(function(){
	            	recommendedProducts();
                	historyProducts();
	            }, productLoadTime);

	            var slickInterval = setInterval(function() {
	            	timerIncrement();	            	
	            }, beforeYouLeave_time + 1000);
	        });
	        
	        $(document).on('mousemove', function() {
	        	resetTimer();
	        });

	        $(document).on('keydown', function() {
	        	resetTimer();
	        });

	        $(document).on('scroll', function() {
	        	resetTimer();
	        });
        }
        
        function timerIncrement() {
            idleTime = idleTime + 1;
            if (idleTime >= 1 && !$('body.openBeforeYouLeave').length ) {
                if (!$('body.open_beforeYouLeave').length) {
            		var heightHeader = $('.header').outerHeight();
            		var tab = $('#tab-recommended .productGrid');

	                $('body').addClass('open_beforeYouLeave');
	                $('body').append('<div class="themevale_background"></div>');
	                ProductsCarousel(tab);

	                if ($(window).width() > 1024) {
	                	if ($('.modal-background').is(':visible') || $('#themevale_newsletter').is(':visible')) {
	                		$('.before-you-leave').css('top',0);
	                	} else {
	                		if ($(window).scrollTop() > heightHeader) {
		                		if ($('body').hasClass('is-sticky')) {
					                $('.before-you-leave').css('top', heightHeader);
					                $('.is-sticky header.header').css('z-index', 10002);
					            } else {
					            	$('.before-you-leave').css('top', 0);
					            }
				            } else {
				                $('.before-you-leave').css('top', 0);
				            }
	                	}
	                }
            	}
            }
        }

        function resetTimer() {
            idleTime = -1;
        }

        function recommendedProducts() {
            var productIDS = context.themeSettings.before_you_leave_recommended_id;
            var listIDs = JSON.parse("[" + productIDS + "]");
            var count = listIDs.length;
            var tab = $('#tab-recommended .productGrid');
            var type = context.themeSettings.card_title_type;
            var typeTitle = '';
            if (type = "clamp") {
            	typeTitle = 'class="clamp" style="-webkit-box-orient: vertical; -webkit-line-clamp: 1;"';
            }
            for (var i = 0; i < listIDs.length; i++) {
                 var productId = listIDs[i];
                 if ($('#before-you-leave #tab-recommended').length) {
                   if ($('#before-you-leave #tab-recommended .productGrid .productCarousel-slide').length <= i) {
                        utils.api.product.getById(productId, { template: 'halothemes/before-you-leave-tmp-rm' }, (err, response) => {
                            var data_product_id = $('.productView .productView-title', $(response)).attr('data-product-id');
                            var brand = $('.productView-brand a', $(response)).text();
                            var name = $('.productView .productView-title', $(response)).text();
                            var img = $('.productView-image', $(response)).find('img').attr('src');
                            var url = $('.productView .productView-title', $(response)).data('url');
                            var price = $('.productView-price', $(response)).html(); 
                            var brandHTML = '';

                            if (brand != '') {
                            	brandHTML = '<p class="card-text card-brand" data-test-info-type="brandName">'+brand+'</p>';
                            }

                            //Color
                            var color = $('[data-product-option-change]',$(response)).find('[data-product-attribute="swatch"] .form-option-swatch .form-option-variant').attr('title');
                            var colorName = '';
                            if (color != undefined) {
                            	colorName = '<span class="color-name">'+color+'</span>';
                            }

                            //Data Option
                            var data_option =  $('[data-product-option-change]',$(response)).find('[data-product-attribute="swatch"]').html();
                            var dataOption = '';
                            if (data_option != undefined) {
                            	dataOption = '<div class="card_optionImage product-option-'+ productId + '"><div data-product-option-change4><div data-product-attribute=\"swatch\">' + data_option + '</div></div></div>';
                            }

                            // New Label
                            var new_label = $('.product-img-box',$(response)).find('.new-badge').html();
                            var newLabel = '';

                            if (new_label != undefined) {
                            	newLabel = '<div class="product-badge new-badge">'+new_label+'</div>';
                            }

                            //Sale Label
                            var sale_label = $('.product-img-box',$(response)).find('.sale-badge').html();
                            var saleLabel = '';

                            if (sale_label != undefined) {
                            	saleLabel = '<div class="product-badge sale-badge">'+sale_label+'</div>';
                            }

                            //soldout Label
                            var soldout_label = $('.product-img-box',$(response)).find('.soldout-badge').html();
                            var soldoutLabel = '';

                            if (soldout_label != undefined) {
                            	soldoutLabel = '<div class="product-badge soldout-badge">'+soldout_label+'</div>';
                            }

                            //Custom Label
                            var custom_label = $('.product-img-box',$(response)).find('.custom-badge').html();
                            var customLabel = '';

                            if (custom_label != undefined) {
                            	customLabel = '<div class="product-badge custom-badge">'+custom_label+'</div>';
                            }

                            var html = '<div class="productCarousel-slide">\
                            				<div class="product">\
	                                            <article class="card" data-product-id="'+data_product_id+'">\
	                                                <figure class="card-figure">\
	                                                '+newLabel+'\
	                                                '+saleLabel+'\
	                                                '+soldoutLabel+'\
	                                                '+customLabel+'\
	                                                <div class="card-img-container">\
	                                                    <a href="'+url+'"><img class="card-image" src="'+img+'" alt="'+name+'" title="'+name+'"></a>\
	                                                </div>\
	                                                </figure>\
	                                                <div class="card-body">\
	                                                    '+brandHTML+'\
	                                                    <h4 class="card-title"><a '+typeTitle+' href="'+url+'">'+name+'</a>'+colorName+'</h4>\
	                                                    <div class="card-text card-price">'+price+'</div>\
	                                                    '+dataOption+'\
	                                                    <a href="'+url+'" class="button button--small card-figcaption-button"><span>Add</span></a>\
	                                                </div>\
	                                            </article>\
                                            </div>\
                                        </div>';

                            $('#before-you-leave #tab-recommended .productGrid').append(html);
                            $('#before-you-leave .before-you-leave-tab .recommended .count').html(count);
                            $('#before-you-leave #tab-recommended .productGrid .productCarousel-slide .card_optionImage [data-product-option-change4] .form-radio').attr('id', '');
                            $('#before-you-leave #tab-recommended .productGrid .productCarousel-slide .card_optionImage [data-product-option-change4] .form-option').attr('for', '');
                        });
                   } else {
                   	return;
                   }
                }
            }
        }

        $(document).on('click','#before-you-leave .themevale_close',function(){
            $('body').removeClass('open_beforeYouLeave');
            $('body .themevale_background').remove();
            $('.is-sticky header.header').css('z-index', '');
            $('.quickSearch .byl-search-close').remove();
            $('.quickSearch').css('top', '');
        });

        $(document).on('click', '.themevale_background', function(e) {
            if ($('body').hasClass('open_beforeYouLeave')) {
                $('body').removeClass('open_beforeYouLeave');
            	$('body .themevale_background').remove();
            	$('header.header').css('z-index', '');
            	$('.quickSearch .byl-search-close').remove();
            	$('.quickSearch').css('top', '');
            }
        });

        $("#before-you-leave .before-you-leave-tab .tab").on("click", function() {
			var tabId= $(this).data('id');
	    	var tab = $(".before-you-leave-tab .tabs-contents #tab-"+tabId+" .productGrid");
	    	setTimeout(function(){
	    		ProductsCarousel(tab);
	    	}, 10);
	    });

        // search on Before You Leave
        $('.before-you-leave-tab .search .search-icon').on('click', function(ev) {
            ev.preventDefault();
            $(this).parent().addClass('is-open');
        	if (!$('.quickSearch').hasClass('is-open')) {
            	$('.quickSearch').addClass('is-open');
            }
            if ($(window).width() > 1024) {
	            if (!$('.header-top .search-toggle').hasClass('is-open')) {
	            	$('.header-top .search-toggle').addClass('is-open');
	            }
	        }
            else {
            	if (!$('.search-icon-mobile .search-toggle').hasClass('is-open')) {
	            	$('.search-icon-mobile .search-toggle').addClass('is-open');
	            }
            }
            if (!$('body').hasClass('is-sticky')) {
	        	$('.quickSearch').css('z-index', 10002);
	        	$('.quickSearch').css('top', '');
	        	if (!$('.quickSearch .byl-search-close').length) {
		            $('.quickSearch').append('<a class="byl-search-close"><svg class="icon"><use xlink:href="#icon-close"></svg></a>');
		        }
            }
            else {
            	$('.quickSearch').css('top', $('header.header').outerHeight());
            }
        });

        $(document).on('click', '.byl-search-close', function(ev) {
        	ev.preventDefault();
            if ($('.quickSearch').hasClass('is-open')) {
	            $(this).parent().removeClass('is-open');
	            if (!$('body').hasClass('is-sticky') || $('.quickSearch .byl-search-close').length) {
	            	$('.quickSearch').removeClass('is-open').css('z-index', '');
	            	$('.quickSearch .byl-search-close').remove();
	            	$('.search-toggle').removeClass('is-open');
	            }
            }
        });
    }

    function historyProducts(){
        BC_Products.recordHistory();
		var cookieValue = getCookie("bigcommerce_history");

		if (!(cookieValue !== null && cookieValue !== undefined && cookieValue !== "")) {
		    $('#tab-history').find(".no-products").show();
		    $('#history-products-list').css("padding", "0");
		    $('#before-you-leave .before-you-leave-tab .history .count').html(0);
		}
		else {
			BC_Products.showHistory({
			    howManyToShow: context.themeSettings.before_you_leave_history_count,
			    howManyToStoreInMemory: context.themeSettings.before_you_leave_history_count,
			    wrapperId: 'history-products-list',
			    onComplete: function() {
			        //start
			        var historyBlock = $('#tab-history');
			        var historyGrid = historyBlock.find('.productGrid');
			        var historyGridInner = historyBlock.find('.productGrid .productGridInner');
			        var historyGridInner = historyGridInner.children();
			        historyGrid.find(".no-products").remove();
			        
			        var count = historyBlock.find('.productGrid .productCarousel-slide').length;
			        $('#before-you-leave .before-you-leave-tab .history .count').html(count);
			        var tab = $('#tab-history .productGrid');

			        $('#tab-history .productGrid .card').each(function() {
		        		var color = $(this).find('.card_optionImage [data-product-attribute="swatch"] .form-option > span').attr('title');
		    			if (color != undefined) {
		    				$(this).find('.card-title').append("<span class='color-name'>"+color+"</span>");
		    				$(this).find('.card-title > a').addClass('has-color-name');
		    			}			            
		        	});

		        	$('#tab-history .productGrid .card .card_optionImage [data-product-option-change4] .form-radio').attr('id', '');
		        	$('#tab-history .productGrid .card .card_optionImage [data-product-option-change4] .form-option').attr('for', '');
			    }
			});
		}	
	}
	
	beforeYouLeave();
}
