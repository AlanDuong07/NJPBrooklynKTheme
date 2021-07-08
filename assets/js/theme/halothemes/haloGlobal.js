import $ from 'jquery';
import classie from 'classie';
/* eslint-disable space-before-function-paren */
/* eslint-disable padded-blocks */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
/* eslint-disable wrap-iife */
/* eslint-disable eol-last */
/* eslint-disable prefer-arrow-callback */

export default function(context) {

    $(document).ready(function() {

        $('body').on('click', '.card .btnWL', (e) => {
            e.preventDefault();
            var $this_wl = $(e.currentTarget);
            var url_awl = $this_wl.attr('href');

            if ($('body').hasClass('wl-login')) {
                $.post(url_awl).done(function() {
                    window.location.href = url_awl;
                });
            }
            else {
                window.location.href = '/login.php';
            }
        });

        // OwlCarousel init
        if (!$('body.page-type-default').length) {
            const $carousel = $('[data-owl]');
            if ($carousel.length) {
                $carousel.each(function(index, el) {
                    $(this).owlCarousel($(this).data('owl'));
                });

            }
        }

        $('#breadcrumbs-wrapper').parent().css("border-top", "0");

        // SideBar Toggle Mobile View
        if ($('#sidebar-toggle').length) {
            $('#sidebar-toggle a').click(function() {
                if ($(this).find('i').hasClass('fa-plus')) {
                    $('.page-sidebar > nav').fadeIn(200);
                    if ($('.page-sidebar > nav').length) {
                        $(window).scrollTop($(this).offset().top - 15);
                    }
                    $(this).html('HIDE SIDEBAR <i class="fa fa-minus"></i>');
                } else if ($(this).find('i').hasClass('fa-minus')) {
                    if ($('.page-sidebar > nav').length) {
                        $('.page-sidebar > nav').fadeOut(200);
                    }
                    $(this).html('SHOW SIDEBAR <i class="fa fa-plus"></i>');
                }
            });
        }

        $('.sidebar-toggle-mbBtn').on('click', function(e) {
            e.preventDefault();
            const $mobile_sidebar = $('#mobile-sidebar');

            $('body').toggleClass('has-activeNavPages');
            $mobile_sidebar.toggleClass('is-open');
        });


        // Shop the Latest on Megamenu
        if ($('.shop-the-latest .owl-carousel').length > 0) {
            $('.shop-the-latest .owl-carousel').owlCarousel({
                items: 3,
                slideBy: 3,
                margin: 40,
                nav: true,
                dots: false,
                responsive: {
                    0: {
                        items: 1,
                        slideBy: 1
                    },
                    992: {
                        items: 3,
                        slideBy: 3
                    },
                    1200: {
                        items: 3,
                        slideBy: 3
                    }
                },
                responsiveRefreshRate: 0
            });
        }

        if ($('#lookbook-page').length) {
            $('#lookbook-page .owl-carousel').owlCarousel({
                nav: true,
                dots: true,
                items: 1,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                loop: true,
                responsiveRefreshRate: 0
            });

            const $lb_icons = $('#lookbook-page .black-icons');
            const $list_icons = $('#footer-wrapper .black-icons.footer-info-list');

            if ($list_icons.length) {
                $lb_icons.append($list_icons.html());
            }
        }

        $('.hover_collection').on('click', (e) => {
            e.preventDefault();
            const $target = $(e.currentTarget);
            const $this_banner = $target.parents('.banner-item-img').find('a').attr('href');

            location.href = $this_banner;
        });
       
        //custom tab product view        
        $('.flex-tabs label.tab').click(function(){
            var tab_id = $(this).attr('data-tab');
            if($(window).width() < 992) {
                if($(this).hasClass('current')){
                    $(this).removeClass('current');
                    $("#"+tab_id).removeClass('active');
                }
                else{
                    $('.flex-tabs label.tab').not(this).removeClass('current');
                    $('.panel').removeClass('active');

                    $(this).addClass('current');
                    $("#"+tab_id).addClass('active');
                }
            }
            else {
                $('.flex-tabs label.tab').removeClass('current');
                $('.flex-tabs .panel').removeClass('active');
                $(this).addClass('current');
                $("#"+tab_id).addClass('active');
            }
           
        });

        // Search Toggle
        $('a.search-toggle').click(function(event) {
            /* Act on the event */
            if ($(window).width() > 1024) {
                if ($('body').hasClass('is-sticky')) {
                    var top_qs = $('header.header').outerHeight();
                }
                else {
                    if (!$('body').hasClass('.open_beforeYouLeave')) {
                        var top_qs = $('#top-page-promotion').outerHeight() + $('header.header .header-top').outerHeight();
                    }
                }
                $('.quickSearch').css('top', top_qs);
            }

            if (!$('.quickSearch .quickSearchResultsWrap').hasClass('hasResults') && !$('.quickSearch .quickSearchResultsWrap').hasClass('hasNoResults')) {
                $('.quickSearch #search_query').val('');
                $('.quickSearch .search-block-recommended').show();
            }

            $('.quickSearch').toggleClass('is-open');
            $(this).toggleClass('is-open');
            $('body').toggleClass('has-search-dropdown');
        });

        $('a[href="#"]').click(function(event) {
            if ($('.quickSearch').hasClass('is-open')) {
                event.preventDefault();
            }
        });
        // Mobile Search Toggle Button
        $('#mobile-search-toggle').click(function(event) {
            /* Act on the event */
            $('header.header').toggleClass('mobile-search-is-open');
        });

        $('#footerSubcribeFormSubmit').submit(function(event){
            if ($('#footerSubcribeFormSubmit').find('#nl_email').val()  == "") {
                alert("Please enter a valid email address, such as john@example.com.");
                $('#footerSubcribeFormSubmit').find('#nl_email').focus();
                return false;
            }

        });

        $('#top-page-promotion svg').on('click', function() {
            $('#top-page-promotion').addClass('hide');
        });

        $('.bms-item-btn').on('click', function(e) {
            e.preventDefault();
            const ts_val = $(this).text();
            const $s_query = $('#search_query');
            const $s_form = $('form[action="/search.php"]');

            $s_query.val(ts_val);
            $s_form.submit();
        });

        $(document).on('click', '.viewAllSP-btn', function(e) {
            e.preventDefault();
            const $s_form = $('form[action="/search.php"]');
            $s_form.submit();
        });

        $(document).on('click', '.button-wishlistDropdown-q', function(e) {
            e.preventDefault();
            const $wl_dropDown = $(this).parents('[data-wishlist-add]').find('.dropdown-menu');

            $wl_dropDown.toggleClass('is-open');
        });

        $(document).on('click', (e) => {
            if ($(e.target).closest('.button-wishlistDropdown-q, #wishlist-dropdown-q').length === 0) {
                $('#wishlist-dropdown-q').removeClass('is-open');
            }
        });

        menu_label();
    });
  
    $(window).resize(function() {
        if ($(window).width() >= 992) {
            $('body').removeClass('st-off-canvas');
            $('#st-container').removeClass('st-effect-1 st-menu-open');
        }
        append_menuMobile();
        sidebarMobile();
    });

    function menu_label() {
        if (context.themeSettings.halothemes_megamenu) {
            if (position_label != '' && position_label != undefined) {
                const list_pLabel = JSON.parse('['+position_label+']');
                const $mn_navItem = $('.navPages-container nav.navPages > ul.navPages-list:not(.navPages-list-mobile) > li');

                for (var i=0; i<list_pLabel.length; i++) {
                    const $this_navItem = $mn_navItem.eq(list_pLabel[i] - 1).children('.navPages-action').children('span');

                    if ($this_navItem.find('menu-label').length === 0) {
                        if (i==0) {
                            $this_navItem.after('<span class="menu-label new-label">New</span>');
                        }
                        else if (i==1) {
                            $this_navItem.after('<span class="menu-label hot-label">Hot</span>');
                        }
                        else if (i==2) {
                            $this_navItem.after('<span class="menu-label sale-label">Sale</span>');
                        }
                    }
                }
            }
        }
    }

    function append_menuMobile() {
        const $list_menuDesk = $('#menu.navPages-container nav.navPages');
        const $list_menuMobi = $('#mobile-categories nav.navPages');
        const $list_pageDesk = $('#menu.navPages-container nav.navPages');
        const $list_pageMobi = $('#mobile-categories nav.navPages');

        if ($(window).width() > 1024) {
            if ($list_menuMobi.find('> ul.navPages-list-desktop').length) {
                $list_menuMobi.find('> ul.navPages-list-desktop').appendTo($list_menuDesk);
            }
            if ($list_pageMobi.find('> ul.navPages-list-mobile').length) {
                $list_pageMobi.find('> ul.navPages-list-mobile').appendTo($list_pageDesk);
            }
        }
        else {
            if ($list_menuDesk.find('> ul.navPages-list-desktop').length) {
                $list_menuDesk.find('> ul.navPages-list-desktop').appendTo($list_menuMobi);
            }
            if ($list_pageDesk.find('> ul.navPages-list-mobile').length) {
                $list_pageDesk.find('> ul.navPages-list-mobile').appendTo($list_pageMobi);
            }
        }
    }

    function sidebarMobile() {
        const wd_width = $(window).width();
        const $sidebarMB = $('#mobile-sidebar');
        const $sidebarDesk = $('aside.page-sidebar');
        const $sidebarToggle = $('#sidebar-toggle-mb');

        if (wd_width < 768) {
            if ($sidebarDesk.find('> nav').length) {
                if ($sidebarToggle.length) {
                    $sidebarMB.append($sidebarDesk.find('> nav'));
                }
            }
        }
        else {
            if ($sidebarMB.find('> nav').length) {
                $sidebarDesk.append($sidebarMB.find('> nav'));
            }
        }
    }
    sidebarMobile();

    function toggle_menu() {
        $('#mobile-categories .themevale_close').on('click', function(){
            $('.mobileMenu-toggle').trigger('click');
        });

        $('#mobile-sidebar .themevale_close').on('click', function(){
            if ($('body').hasClass('has-activeNavPages')) {
                $('body').removeClass('has-activeNavPages');
                $('.st-menu.st-effect').removeClass('is-open');
            }
        });

        $('.bg-mobile').on('click', function(ev) {
            if ($('body').hasClass('has-activeNavPages')) {
                $('body').removeClass('has-activeNavPages');
                $('.st-menu.st-effect').removeClass('is-open');
            }
        });
        $('#currency_dropdown').on('click', function(ev) {
            ev.preventDefault();
            $(this).toggleClass('is-open');
        });
    }
    toggle_menu();

    function toggle_account() {
        $('.account-icon').on('click', function(ev) {
            ev.preventDefault();
            $('#mobile-customer').addClass('is-open');
            $('body').toggleClass('themevale_open-Account');
        });

        $('#mobile-customer .themevale_close').on('click', function(ev) {
            $('body').removeClass('themevale_open-Account');
            $('#mobile-customer').removeClass('is-open');
        });

        $(document).on('click', function(ev) {
            if ($(ev.target).closest('#mobile-customer').length === 0 && $(ev.target).closest('.account-icon').length === 0 && $('body').hasClass('themevale_open-Account')) {
                $('body').removeClass('themevale_open-Account');
                $('#mobile-customer').removeClass('is-open');
            }
        });
    }
    toggle_account();

    function toggle_footer() {
        $('#main-footer .footer-columns .footer-info-heading').on('click', function() {
            $(this).parent().toggleClass('open-dropdown');
            $(this).parent().find('.footer-info-list').slideToggle();
        });
    }
    toggle_footer();

    function initCountdown2() {
        if ($('.countDowntimer2').length) {  
            var countDownDate = new Date( $('.countDowntimer2').attr('data-count-down2')).getTime();
            var countdownfunction = setInterval(function() {
                var now = new Date().getTime();
                var distance = countDownDate - now;
                if (distance < 0) {
                    clearInterval(countdownfunction);
                    $(".countDowntimer2").html('');
                } else {
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    var strCountDown = "<div class='clock-item'><span class='num'>"+ days + "D</span><span class='text'>:</span></div><div class='clock-item'><span class='num'>"+ hours + "H</span><span class='text'>:</span></div><div class='clock-item'><span class='num'>" + minutes + "M</span><span class='text'>:</span></div><div class='clock-item'><span class='num'>" + seconds + "S</span></div>";
                    $(".countDowntimer2").html(strCountDown);
                }
            }, 1000);
        }
   }
   initCountdown2();

    // FAQs

   //Product Accordion Toggle
    const accordionItem = $('[data-accordion-item]');
    const accordionToggle = accordionItem.find('.toggle-title');

    accordionToggle.click(function(event) {
        $(this).toggleClass('is-active');
        $(this).siblings('.toggle-content').stop().slideToggle(200);
    });

    $('.first .toggle-title').trigger('click');
}
