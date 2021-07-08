import $ from 'jquery';
import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import StencilDropDown from './stencil-dropdown';
import GeminiScrollbar from 'gemini-scrollbar';
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable space-before-blocks */
/* eslint-disable comma-dangle */

export default function () {
    const TOP_STYLING = 'top: 49px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchDiv = $('.quickSearchResultsWrap');
    const $searchQuery = $('#search_query');
    const stencilDropDownExtendables = {
        hide: () => {
            $searchQuery.blur();
        },
        show: (event) => {
            $searchQuery.focus();
            event.stopPropagation();
        },
    };
    const stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
    stencilDropDown.bind($('[data-search="quickSearch"]'), $quickSearchDiv, TOP_STYLING);

    stencilDropDownExtendables.onBodyClick = (e) => {
        // If the target element has this data tag or one of it's parents, do not close the search results
        // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
        // any modification to the background element.
        if ($(e.target).closest('[data-prevent-quick-search-close], #search_query, .modal-background, .quickSearch.is-open, .search-toggle, .before-you-leave .search-icon').length === 0) {
            // stencilDropDown.hide($container);
            $quickSearchDiv.removeClass('hasResults');
            $('.quickSearch').removeClass('is-open');
            $('.search-toggle').removeClass('is-open');
            $('body').removeClass('has-search-dropdown');
        }
    };

    // stagger searching for 200ms after last input
    const doSearch = _.debounce((searchQuery) => {
        utils.api.search.search(searchQuery, { template: 'search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }

            if (response.search('quickSearchMessage') > 0) {
                $quickSearchDiv.addClass('hasNoResults');
            } else {
                $quickSearchDiv.removeClass('hasNoResults');
            }

            $quickSearchDiv.addClass('hasResults');
            $('.search-block-recommended').hide();
            $quickSearchResults.html(response);
            $quickSearchResults.find('.productItems').owlCarousel($quickSearchResults.find('.productItems').data('owl'));
            if ($quickSearchResults.find('li.product').size() >= 5) {
                const mySearchScrollbar = new GeminiScrollbar({
                    element: document.querySelector('.quickSearchResults'),
                    onResize: function(){}
                }).create();
            }
        });
    }, 200);

    utils.hooks.on('search-quick', (event) => {
        const searchQuery = $(event.currentTarget).val();

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            if (searchQuery.length == 0) {
                $quickSearchDiv.removeClass('hasResults');
                $('.search-block-recommended').show();
            }
            return;
        }

        doSearch(searchQuery);
    });

    // Catch the submission of the quick-search
    $quickSearchDiv.on('submit', (event) => {
        const searchQuery = $(event.currentTarget).find('input').val();

        if (searchQuery.length === 0) {
            return event.preventDefault();
        }

        return true;
    });
}
