/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import { classifyForm } from './common/form-utils';
import videoGallery from './product/video-gallery';
import productViewMagnificPopup from './halothemes/productViewMagnificPopup';
import setActiveCategory from './halothemes/setActiveCategory';
import haloBundleProducts from './halothemes/haloBundleProducts';
import Sortable from 'sortablejs';
import haloStickyAddToCart from './halothemes/haloStickyAddToCart';
/* eslint-disable prefer-template */
/* eslint-disable space-infix-ops */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
/* eslint-disable no-unused-vars */

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#writeReview') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);

        // HaloThemes functions
        productViewMagnificPopup();
        setActiveCategory();
        videoGallery();

        if (this.context.themeSettings.halo_bundle_products_enable == true) {
            haloBundleProducts(this.context);   
        }
        
        haloStickyAddToCart();

        $('a.videos-tab').click(function(event) {
            event.preventDefault();
            $('.productView-1 .productView-videos-wrap').removeClass('is-hidden');
            $('.productView-1 .productView-image-wrap').addClass('is-hidden');
            // $('a.photos-tab').removeClass('current-tab');
            // $(this).addClass('current-tab');

            // $('.productView-images').addClass('current-videos-tab');
            // $('#product-photos').addClass('hide');
            // $('#product-videos').removeClass('hide');
            // $('.productView-image').addClass('hide');
            // $('.productView-videos').removeClass('hide');
            // $('.productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"playVideo"'+',"args":""}', '*');
        });

        $('a.photos-tab').click(function(event) {
            event.preventDefault();
            $('.productView-1 .productView-image-wrap').removeClass('is-hidden');
            $('.productView-1 .productView-videos-wrap').addClass('is-hidden');
            // $('a.videos-tab').removeClass('current-tab');
            // $(this).addClass('current-tab');
            // $('.productView-images').removeClass('current-videos-tab');
            // $('#product-videos').addClass('hide');
            // $('#product-photos').removeClass('hide');
            // $('.productView-image').removeClass('hide');
            // $('.productView-videos').addClass('hide');
            // $('.productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"pauseVideo"'+',"args":""}', '*');
        });

        // $('a.video-thumbnail').click(function(event) {
        //     event.preventDefault();
        //     $('.productView-videos iframe').attr('src', '//www.youtube.com/embed/'+$(this).data('video-id')+'?enablejsapi=1');
        //     setTimeout(function() {
        //         $('.productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"playVideo"'+',"args":""}', '*');
        //     }, 500);
        // });

        // Product Accordion Toggle
        const accordionItem = $('[data-accordion-item]');
        const accordionToggle = accordionItem.find('.toggle-title');

        accordionToggle.click(function(event) {
            $(this).toggleClass('is-active');
            $(this).siblings('.toggle-content').stop().slideToggle(200);
        });

        $('.productDescription .toggle-title').trigger('click');

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation();
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        next();
    }

    after(next) {
        this.productReviewHandler();
        if (this.context.themeSettings.halo_compare_colors == true) {
            this.compareColors();
        }
        this.add_sizeChart();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#writeReview') !== -1) {
            this.$reviewLink.click();
        }
    }

    compareColors(){
        $('.halo-compareColors-swatch .form-option').on('click',  function(event){
            $(this).toggleClass('show-color');

            var title = $(this).find('.form-option-variant').attr('title'),
                id = $(this).data('product-swatch-value'),
                $color, $color2, $color3, $img;

            if ($(this).hasClass('show-color')){
                if($(this).find('.form-option-variant--color').length){
                    $color = $(this).find('.form-option-variant--color').attr('style');

                    $('.halo-compareColors-image').append('<div class="item item-color item-'+id+'"><span class="color" style="'+$color+';"></span><span class="title">'+title+'</span></div>');
                } else if($(this).find('.form-option-variant--color2').length){
                    $color = $(this).find('.form-option-variant--color2 span:nth-child(1)').attr('style');
                    $color2 = $(this).find('.form-option-variant--color2 span:nth-child(2)').attr('style');

                    $('.halo-compareColors-image').append('<div class="item item-color item-'+id+'"><span class="color color2"><span style="'+$color+';"></span><span style="'+$color2+';"></span></span><span class="title">'+title+'</span></div>');
                } else if($(this).find('.form-option-variant--color3').length){
                    $color = $(this).find('.form-option-variant--color3 span:nth-child(1)').attr('style');
                    $color2 = $(this).find('.form-option-variant--color3 span:nth-child(2)').attr('style');
                    $color3 = $(this).find('.form-option-variant--color3 span:nth-child(3)').attr('style');

                    $('.halo-compareColors-image').append('<div class="item item-color item-'+id+'"><span class="color color3"><span style="'+$color+';"></span><span style="'+$color2+';"></span><span style="'+$color3+';"></span></span><span class="title">'+title+'</span></div>');
                } else if($(this).find('.form-option-variant--pattern').length){
                    $img = $(this).find('.form-option-variant--pattern').attr('style').split("'")[1];

                    $('.halo-compareColors-image').append('<div class="item item-partern item-'+id+'"><span class="image"><img src='+$img+' alt='+title+' title='+title+'></span><span class="title">'+title+'</span></div>');
                }
            } else{
                $('.halo-compareColors-image .item-'+id+'').remove();
            }

            if ($(window).width() >= 1025) {
                var el = document.getElementById('color-swatch-image');
                
                new Sortable(el, {
                    animation: 150
                });
            }
        });
    }

    add_sizeChart() {
        const $size_chart = $('[data-reveal-id="modal-size-chart-form"]');
        const $form_field = $('.productView-options [data-product-option-change] .form-field');

        if ($size_chart.length) {
            $form_field.each(function() {
                const title_val = $(this).find('[data-option-value]').text();
                const title_small = $(this).find('.form-label--alternate small').text();
                const t_title = $(this).find('.form-label--alternate')
                                        .text()
                                        .replace(title_small, '')
                                        .replace(title_val, '')
                                        .replace(':', '')
                                        .trim()
                                        .toLowerCase();

                if (t_title == 'size') {
                    $(this).prepend($size_chart);
                }
            });
        }
    }
}
