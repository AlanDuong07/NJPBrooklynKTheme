import $ from 'jquery';
/* eslint-disable func-names */

export default function () {
    $('ul.all-categories-list li').each(function () {
        const breadLink = $('.page-type-product #breadcrumbs-wrapper ul li.breadcrumb.is-active').prev('.breadcrumb').children('a').attr('href');
        // set active category on category page
        if ($(this).children('a').attr('href') === $('link[rel="canonical"]').attr('href')) {
            $(this).addClass('current-cat');
            $(this).children('.dropdown-category-list').addClass('cat-expanded').siblings('i.fa.fa-angle-down').addClass('is-clicked');
            $(this).parents('.dropdown-category-list').addClass('cat-expanded').siblings('i.fa.fa-angle-down').addClass('is-clicked');
        }
        // set active category on product detail page
        if ($(this).children('a').attr('href') === breadLink) {
            $(this).addClass('current-cat');
            $(this).children('.dropdown-category-list').addClass('cat-expanded').siblings('i.fa.fa-angle-down').addClass('is-clicked');
            $(this).parents('.dropdown-category-list').addClass('cat-expanded').siblings('i.fa.fa-angle-down').addClass('is-clicked');
        }
    });

    $('ul.all-categories-list i.fa.fa-angle-down').click(function () {
        /* Act on the event */
        $(this).toggleClass('is-clicked');
        $(this).siblings('ul.dropdown-category-list').toggleClass('cat-expanded');
    });
}
