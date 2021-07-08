import $ from 'jquery';
import './common/select-option-plugin';
import 'html5-history-api';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import compareProducts from './global/compare-products';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import 'lazysizes';
import loadingProgressBar from './global/loading-progress-bar';
import FastClick from 'fastclick';
import carousel from './common/carousel';
import mobileMenuToggle from './global/mobile-menu-toggle';

import 'jquery.browser';
import owlCarousel from 'owl.carousel';
import magnificPopup from 'magnific-popup';

import haloGlobal from './halothemes/haloGlobal';

import backToTop from './halothemes/backToTop';

import stickyNavigation from './halothemes/stickyNavigation';

import lazyLoadingEffect from './halothemes/lazyLoadingEffect';

import haloAddOption from './halothemes/haloAddOptionForProduct';
import haloAddToCart from './halothemes/haloAddToCart';
import haloLoginPopup from './halothemes/haloLoginPopup';
import showMoreProducts from './halothemes/showMoreProducts';
import haloQuickShop from './halothemes/themevale_quickShop';
import BeforeYouLeave from './halothemes/themevale_BeforeYouLeave';
import haloNewsletterPopup from './halothemes/haloNewsletterPopup';
import RecentlyViewedProducts from './halothemes/recently-viewed-products';
import halothemesRecentlyBought from './halothemes/halothemes_RecentlyBought';
import calculateFreeShipping from './halothemes/CalculateFreeShipping';

function fastClick(element) {
    return new FastClick(element);
}

export default class Global extends PageManager {
    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    loaded(next) {
        if (this.context.themeSettings.halothemes_sticky_navigation) {
            stickyNavigation();
        }
        if (this.context.themeSettings.halothemes_lazy_loading_effect) {
            lazyLoadingEffect();
        }

        haloGlobal(this.context);
        carousel();
        backToTop();
        fastClick(document.body);
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        cartPreview();
        compareProducts(this.context.urls);
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        mobileMenuToggle();
        this.haloLoad();
        next();
    }

    haloLoad() {
        var checkJS_load = true;
        const $context = this.context;

        function loadJSFeature() {
            if (checkJS_load) {
                checkJS_load = false;

                if ($context.themeSettings.halothemes_megamenu) {
                    $.getScript(url_scriptMenu).then(function() {
                        menuItems();
                        loadMenuMobile();
                    });
                }
                else {
                    loadMenuMobile();
                }

                if ($context.themeSettings.themevale_quick_shop) {
                    haloQuickShop($context);
                }

                if ($context.themeSettings.halothemes_newsletter_popup) {
                    haloNewsletterPopup(1, true);
                }
                else {
                    haloNewsletterPopup(1, false);
                }

                if ($context.themeSettings.enable_recently_viewed_products) {
                    RecentlyViewedProducts($context);
                }

                haloAddOption($context);
                showMoreProducts($context);
                haloAddToCart();
                haloLoginPopup();
                halothemesRecentlyBought($context);

                if ($context.themeSettings.enable_before_you_leave) {
                    BeforeYouLeave($context);
                }

                // OwlCarousel init
                if ($('body.page-type-default').length) {
                    const $carousel = $('[data-owl]');
                    if ($carousel.length) {
                        $carousel.each(function(index, el) {
                            $(this).owlCarousel($(this).data('owl'));
                        });

                    }
                }

                if ($context.themeSettings.themevale_CalculateFreeShipping) {
                    const cFShipping_mess1 = $context.themeSettings.calculateFreeShipping_mess1;
                    const cFShipping_mess2 = $context.themeSettings.calculateFreeShipping_mess2;
                    const cFShipping_mess3 = $context.themeSettings.calculateFreeShipping_mess3;
                    const cFShipping_countryCode1 = $context.themeSettings.calculateFreeShipping_countryCode1;
                    const cFShipping_countryCode2 = $context.themeSettings.calculateFreeShipping_countryCode2;
                    const cFShipping_countryCode3 = $context.themeSettings.calculateFreeShipping_countryCode3;

                    $.getScript('https://ssl.geoplugin.net/javascript.gp?k=9247556ec91c71e9', function() {
                        var countryCode = geoplugin_countryCode();
                        var shipping_message = "";
                        var themeSettings = $context.themeSettings;
                        
                        var countryCodeArray = [cFShipping_countryCode1, cFShipping_countryCode2, cFShipping_countryCode3];
                        var message = ["<span>"+cFShipping_mess1+"</span>",
                                       "<span>Only {remaining} "+cFShipping_mess2+"</span>",
                                       "<span>"+cFShipping_mess3+"</span>"];
                        
                        if ($.inArray(countryCode, countryCodeArray) != -1) {
                            shipping_message = message;
                        }
                        
                        if(shipping_message != "" )
                            calculateFreeShipping(themeSettings, shipping_message, countryCode);
                    });
                }
            }
        }

        function loadMenuMobile() {
            const $list_menuDesk = $('#menu.navPages-container nav.navPages');
            const $list_menuMobi = $('#mobile-categories nav.navPages');
            const $list_pageDesk = $('#menu.navPages-container nav.navPages');
            const $list_pageMobi = $('#mobile-categories nav.navPages');

            if ($(window).width() < 1025) {
                if ($list_menuDesk.find('> ul.navPages-list-desktop').length) {
                    $list_menuDesk.find('> ul.navPages-list-desktop').appendTo($list_menuMobi);
                }
                if ($list_pageDesk.find('> ul.navPages-list-mobile').length) {
                    $list_pageDesk.find('> ul.navPages-list-mobile').appendTo($list_pageMobi);
                }
            }
        }

        $(document).ready(function() {

            $(document).on('scroll', (e) => {
                loadJSFeature();
            });

            $(document).on('keydown', (e)=> {
                loadJSFeature();
            });

            $(document).on('mousemove', (e) => {
                loadJSFeature();
            });

            $(document).on('touchstart', (e) => {
                loadJSFeature();
            });
        });
    }
}
