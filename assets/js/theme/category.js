import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import $ from 'jquery';
import FacetedSearch from './common/faceted-search';
import setActiveCategory from './halothemes/setActiveCategory';
import productDisplayMode from './halothemes/productDisplayMode';

export default class Category extends CatalogPage {
    loaded() {
        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        // HaloThemes function
        setActiveCategory();
        productDisplayMode();
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                products: {
                    new: true,
                },
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
                sidebarToggleMobile: 'halothemes/sidebar-toggle-mobile',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);
            $facetedSearchContainer.prepend(content.sidebarToggleMobile);

            // HaloThemes function
            if ($('#sidebar-toggle').length) {
                $('#sidebar-toggle a').click(function () {
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
            setActiveCategory();
            productDisplayMode();
            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }
}
