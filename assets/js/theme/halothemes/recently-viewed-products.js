import utils from '@bigcommerce/stencil-utils';
import 'slick-carousel';
import swal from '../global/sweet-alert';
import Cart from '../cart';

export default function(context){
	
	if(location.pathname == "/cart.php"){
		var cart_page = new Cart(context);
		cart_page.onReady();
	}

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
	        wrapperId: "recently-viewed-products",
	        onComplete: null
	    };
	    var t = [];
	    var n = null;
	    var r = null;
	    var i = 0;
	    var s = {
	        configuration: {
	            expires: context.themeSettings.recently_viewed_products_expires_date,
	            path: "/",
	            domain: window.location.hostname
	        },
	        name: "bigcommerce_recently_viewed",
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
	    		jQuery('#recently-viewed-products-list-tmp').find('.item[data-id="product-'+productId+'"]').appendTo(n);
	    	}
	    	jQuery('#recently-viewed-products-list-tmp').remove();
	        n.show();
	        if (e.onComplete) {
	            try {
	                e.onComplete()
	            } catch (t) {}
	        }
	    };
	    var u = function() {
	    	var tmp = jQuery('#recently-viewed-products-list-tmp');
	    	for ( var j = 0; j < e.howManyToShow; j++) {
	    		var productId = t[j];
	    		utils.api.product.getById(productId, { template: 'halothemes/recently-viewed-product-tmp' }, (err, response) => {
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
	        showRecentlyViewed: function(i) {
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
	        recordRecentlyViewed: function(t) {
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
	
	$(document).ready(function(){
		var view = true;
		if (window.innerWidth < 425) {
			view = false;
		}
		if( context.themeSettings.layout_recently != 'default'){
			view = false;
		}
		
		
		BC_Products.recordRecentlyViewed();

		var cookieValue = getCookie("bigcommerce_recently_viewed");

		if (!(cookieValue !== null && cookieValue !== undefined && cookieValue !== "")) {
		    $('.recently-viewed-products-sidebar').find(".no-products").show();
		    $('#recently-viewed-products-list').css("padding", "0");
		    if (window.innerWidth > 767 && view) {
		        $(".lst-seen-widget").addClass("is-show-widget");
		        $(".wrap-icons").removeClass("collapsed");
		    } else {
		        $(".wrap-icons").addClass("collapsed");
		    }
		}
		else {

			BC_Products.showRecentlyViewed({
			    howManyToShow: context.themeSettings.number_of_recently_viewed_products,
			    howManyToStoreInMemory: context.themeSettings.number_of_recently_viewed_products,
			    wrapperId: 'recently-viewed-products-list',
			    onComplete: function() {
			        //start
			        var recentlyViewBlock = $('.recently-viewed-products-sidebar');
			        var recentlyGrid = recentlyViewBlock.find('.products-grid');
			        var productGrid = recentlyGrid.find('> .item');
			        recentlyGrid.find(".no-products").remove();
			        
			        if (productGrid.length) {
			            if (window.innerWidth > 767 && view) {
			                $(".lst-seen-widget").addClass("is-show-widget");
			                $(".wrap-icons").removeClass("collapsed");
			            } else {
			                $(".wrap-icons").addClass("collapsed");
			            }

			            if (recentlyViewBlock.is(':visible')) {

			                if (!recentlyGrid.hasClass('slick-initialized')) {
			                	
			                    var slidesToShow = 2;
			                    if (window.innerWidth > 767 && productGrid.length < 2) {
			                    	slidesToShow = 1;
			                    }

			                    recentlyGrid.slick({
			                        infinite: false,
			                        speed: 1000,
			                        slidesToShow: slidesToShow,
			                        dots: false,
			                        arrows: true,
			                        vertical: true,
			                        slidesToScroll: slidesToShow,
			                        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><title>ic-arrow-right</title><path d="M15.111 12L8 4.889 8.889 4l8 8-8 8L8 19.111z"></path></svg></button>',
			                        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><title>ic-arrow-left</title><path d="M8.778 12l7.111-7.111L15 4l-8 8 8 8 .889-.889z"></path></svg></button>',
			                        responsive: [{
			                                breakpoint: 992,
			                                settings: {
			                                    slidesToScroll: 2,
			                                    slidesToShow: 2
			                                }
			                            },
			                            {
			                                breakpoint: 768,
			                                settings: {
			                                    slidesToScroll: 1,
			                                    slidesToShow: 1
			                                }
			                            }
			                        ]
			                    });
			                    recentlyGrid.prepend('<div class="product-info"></div>');

			                };
			            };
			        }
			        //end
			    }
			});
		}

		/* */
		$(document).on("click", ".collapse-icon", function() {
		    $(".lst-seen-widget").removeClass("is-show-widget");
		    $(".wrap-icons").addClass("collapsed");
		});
		$(document).on("click", ".wrap-icons div:first-child", function() {
		    $(".lst-seen-widget").addClass("is-show-widget");
		    $(".wrap-icons").removeClass("collapsed");
		});
		
	    $(document).on('click', 'a.recent_item_url', function(e) {
	        if (window.innerWidth <= 768) {
	            e.preventDefault();
	        }
	    });

	    if (window.innerWidth < 768) {
	        $(".lst-seen-widget").removeClass("is-show-widget");
	        $(".wrap-icons").addClass("collapsed");
	    }
	    if (window.innerWidth > 1024) {
		    $('.recently-viewed-products-sidebar .products-grid').on('mouseenter', '.slick-slide', function(e) {
		        e.preventDefault();
		        var $currTarget = $(e.currentTarget),
		            index = $currTarget.index('.recently-viewed-products-sidebar .products-grid .slick-active');
				var margin_top = index * $('.recently-viewed-products-sidebar .products-grid .item').outerHeight();
				if($currTarget.parent().children().length > 2) {
		        	margin_top += 34;
				}

		        $(".recently-viewed-products-sidebar .product-info").html($(this).find(".second-info").html()).css("margin-top", margin_top).show();
		        if (index == 1) {
		        	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', 0);
		        }
		        else {
		        	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', '');
		        }
		    });
		    $('.recently-viewed-products-sidebar .products-grid').on('mouseenter', '.slick-arrow', function(e) {
		        $(".recently-viewed-products-sidebar .product-info").hide();
		        $('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', '');
		    });

		    $('.recently-viewed-products-sidebar .products-grid').on('mouseleave', function(){
		    	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', '');
		    });
	    }
	    else {
	    	$(document).on('click','.recently-viewed-products-sidebar .products-grid .item', function(e) {
		        e.preventDefault();
		        var $currTarget = $(e.currentTarget),
		            index = $currTarget.index('.recently-viewed-products-sidebar .products-grid .slick-active');
				var margin_top = index * $('.recently-viewed-products-sidebar .products-grid .item').outerHeight();
		        if (window.innerWidth > 767) {
					if($currTarget.parent().children().length > 2) {
			        	margin_top += 34;
					}
			        if (index == 1) {
			        	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', 0);
			        }
			        else {
			        	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', '');
			        }
		        }
		        else {
		        	if($currTarget.parent().children().length > 1) {
			        	margin_top += 34;
					}
		        	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', 0);
		        }

		        $(".recently-viewed-products-sidebar .product-info").html($(this).find(".second-info").html()).css("margin-top", margin_top).show().addClass('is-show');
		    });

		    $(document).on('click', function(ev) {
	            if ($(ev.target).closest('.recently-viewed-products-sidebar .product-info, .recently-viewed-products-sidebar .products-grid .item').length === 0) {
	            	$(".recently-viewed-products-sidebar .product-info").removeClass('is-show');
	            	$('.recently-viewed-products-sidebar .products-grid .slick-arrow.slick-next').css('opacity', '');
	            }
	        });
	    }

	    var backToTop = $('.recently-viewed-products-sidebar .backtoTop');
	    if ($(this).scrollTop() > 220) {
	        $('.recently-viewed-products-sidebar').addClass("slided-up");
	    } else {
	        $('.recently-viewed-products-sidebar').removeClass("slided-up");
	    };
	    $(window).scroll(function() {
	        if ($(this).scrollTop() > 220) {
	            $('.recently-viewed-products-sidebar').addClass("slided-up");
	        } else {
	            $('.recently-viewed-products-sidebar').removeClass("slided-up");
	        };
	    });

	    backToTop.off('click.scrollTop').on('click.scrollTop', function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        $('html, body').animate({
	            scrollTop: 0
	        }, 400);
	        return false;
	    });
	});

}