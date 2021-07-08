import utils from '@bigcommerce/stencil-utils';
import ProductDetailsQuickShop from '../common/product-details-quick-shop';

export default function(context) {
    const product_class = ".card";

    quickShop();

    function quickShop() {
        jQuery(document).on('click', '.btn-quickShop',  function(event){
            event.preventDefault();
            var $target = $(event.currentTarget);
            var $product = $target.parents('.card');
            var productId = $target.data('product-id');
            const $thisCarousel = $(this).parents('.productCarousel');
            const $this_quickShop = $(this).parents('.card').find('.quickShopPopup');

            if ($('body.page-type-category').length === 0) {
                $('.btn-quickShop').not(this).parents('.card').find('.quickShopWrap').remove();
            }

            if ($(window).width() < 1200 && $thisCarousel.hasClass('owl-carousel')) {
                if ($product.find('.quickShopPopup').length) {
                    if ($product.find('.quickShopPopup .quickShopWrap').length) {
                        $product.find('.quickShopPopup .quickShopWrap').remove();
                    }

                    if (!$('.modal-quickShopPopup').length) {
                        $('body').append('<div class="modal-quickShopPopup"><div class="quickShopPopup animated fadeIn"><div class="loadingOverlay" style="display:block;"></div></div></div>');
                    }

                    utils.api.product.getById(productId, { template: 'halothemes/quick_shop_options' }, (err, response) => {

                        $('.modal-quickShopPopup').find('.quickShopPopup').find('.loadingOverlay').remove();
                        if (!$('.modal-quickShopPopup').find('.quickShopPopup .quickShopWrap').length) {
                            $('.modal-quickShopPopup').find('.quickShopPopup').append(response);
                        }
                        return new ProductDetailsQuickShop($('.modal-quickShopPopup').find('.quickShopPopup .quickShopWrap'), context);
                    });
                }
            }
            else {
                if (!$product.find('.quickShopPopup .quickShopWrap').length) {
                    $product.find('.quickShopPopup').append('<div class="loadingOverlay" style="display:block;"></div>');
                    $(product_class).find('.card-figure').removeClass('has-popup');
                    $product.find('.card-figure').addClass('has-popup');

                    utils.api.product.getById(productId, { template: 'halothemes/quick_shop_options' }, (err, response) => {

                        $product.find('.quickShopPopup').find('.loadingOverlay').remove();
                        if (!$product.find('.quickShopPopup .quickShopWrap').length) {
                            $product.find('.quickShopPopup').append(response);
                        }
                        return new ProductDetailsQuickShop($product.find('.quickShopPopup .quickShopWrap'), context);
                    });
                }
                else {
                    $(product_class).find('.card-figure').removeClass('has-popup');
                    $product.find('.card-figure').addClass('has-popup');
                }
            }

            if ($(window).width() < 1200 && $('.module-wrapper.productList').length == 0) {
                const $modal_bg = $('.modal-background');

                $product.addClass('has-popup');
                $product.find('.quickShopPopup').addClass('animated fadeIn');

                if (!$modal_bg.length) {
                    $('body').append('<div class="modal-background" style="display: block;"></div>');
                }
                else {
                    $modal_bg.show();
                }
            }
        });
    }

    function quickShopList() {

        function quickShopList_add($tScroll) {
            if ($('.module-wrapper.productList').length) {
                $('.productBlockContainer .prod-item').each(function(i) {
                    const $tPD_top = $(this).offset().top - screen.height;

                    if ($tScroll > $tPD_top) {
                        var $product_list = $(this).find('.card');
                        var productId_list = $product_list.data('product-id');

                        if (!$product_list.hasClass('has-quickShop')) {

                            if ($product_list.find('.quickShopPopup').length && !$product_list.find('.quickShopPopup .quickShopWrap').length) {
                                $product_list.find('.btnl-quickShop').before($product_list.find('.quickShopPopup'));
                                $product_list.find('.card-figure').addClass('has-popup');

                                utils.api.product.getById(productId_list, { template: 'halothemes/quick_shop_options' }, (err, response) => {
                                    $product_list.find('.quickShopPopup').find('.loadingOverlay').remove();
                                    if (!$product_list.find('.quickShopPopup .quickShopWrap').length) {
                                        $product_list.find('.quickShopPopup').append(response);
                                    }

                                    return new ProductDetailsQuickShop($product_list.find('.quickShopPopup .quickShopWrap'), context);
                                });
                            }
                            else {
                                $product_list.find('.btnl-quickShop').before($product_list.find('.quickShopPopup'));
                                $product_list.find('.card-figure').addClass('has-popup');
                            }
                            $product_list.addClass('has-quickShop');
                        }
                    }
                });
            }
        }

        const $tScroll = $(window).scrollTop();
        quickShopList_add($tScroll);

        $(window).scroll(function() {
            const $tScroll = $(this).scrollTop();
            quickShopList_add($tScroll);
        });

        window.onload = function() {
            const $tScroll = $(this).scrollTop();
            quickShopList_add($tScroll);
        }
    }

    var check_pl = true;
    $(document).on('click','#list-view', function() {
        if (check_pl) {
            check_pl = false;
            quickShopList();
        }
        else {
            $('.productBlockContainer .prod-item').each(function(i) {
                var $product_list = $(this).find('.card');
                $product_list.find('.btnl-quickShop').before($product_list.find('.quickShopPopup'));
            });
        }
    });

    if ($('.module-wrapper.productList').length) {
        if (check_pl) {
            check_pl = false;
            quickShopList();
        }
    }

    $(document).on('click','#grid-view', function() {
        $(product_class).find('.card-figure').removeClass('has-popup');

        $('.productBlockContainer .prod-item').each(function(i) {
            var $product_grid = $(this).find('.card');
            if ($product_grid.find('.quickShopPopup').length) {
                $product_grid.find('.prod-image').append($product_grid.find('.quickShopPopup'));
            }
        });
    });

    $(document).on('click','.quickShopPopup .themevale_close', function(e) {
        const $modal_bg = $('.modal-background');
        $(this).parents('.card-figure').removeClass('has-popup');
        $(this).parents('.card').removeClass('has-popup');
        $modal_bg.remove();
        $('.modal-quickShopPopup').remove();
    });

    $(document).on('click', '.btnl-quickShop', function(e) {
        e.preventDefault();
        if ($('.module-wrapper.productList').length) {
            $(this).parents(product_class) .find('.form-action-addToCart').trigger('click');
        }
    });

    $(document).on('click', '.quickview', function(e) {
        e.preventDefault();
        const this_id = $(this).parents('.card').data('product-id');
        const form_length = $('form[data-product-id="'+this_id+'"]').length;
        const $this_form = $(this).parents('.card').find('.quickShopPopup .quickShopWrap form.form');
        const $modal_bg = $('.modal-background');

        if (!$modal_bg.length) {
            $('body').append('<div class="modal-background" style="display: block;"></div>');
        }
        else {
            $modal_bg.show();
        }

        if (!$this_form.hasClass('form-checked')) {

            $this_form.find('input').each(function() {
                const ip_id = $(this).attr('id');

                if (ip_id != '' && ip_id != undefined) {
                    $(this).attr('id', ip_id + '_' + form_length);
                }
            });

            $this_form.find('label').each(function() {
                const lb_for = $(this).attr('for');

                if (lb_for != '' && lb_for != undefined) {
                    $(this).attr('for', lb_for + '_' + form_length);
                }
            });

            $this_form.addClass('form-checked');
        }
    });

    $(document).on('click', '.modal-background', function(e) {
        e.preventDefault();
        $(product_class).find('.card-figure').removeClass('has-popup');
        $(product_class).removeClass('has-popup');
        $(this).remove();
        $('.modal-quickShopPopup').remove();
    });
}
