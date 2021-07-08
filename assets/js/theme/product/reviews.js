import $ from 'jquery';
import nod from '../common/nod';
import forms from '../common/models/forms';

export default class {
    constructor($reviewForm) {
        this.validator = nod({
            submit: $reviewForm.find('input[type="submit"]'),
        });

        this.$reviewsContent = $('#product-reviews');
        this.$collapsible = $('[data-collapsible]', this.$reviewsContent);

        this.initLinkBind();
        this.injectPaginationLink();
        this.collapseReviews();
    }

    /**
     * On initial page load, the user clicks on "(12 Reviews)" link
     * The browser jumps to the review page and should expand the reviews section
     */
    initLinkBind() {
        $('.reviewLinkCount').click(() => {
            if (!$('#tab-reviews').is(':checked')) {
                $('#tab-reviews').click();
            }
            $('html, body').animate({
                scrollTop: $('.flex-tabs').offset().top,
            }, 600);
        });
    }

    collapseReviews() {
        // We're in paginating state, do not collapse
        if (window.location.hash && window.location.hash.indexOf('#product-reviews') === 0) {
            // force collapse on page load
            $('#tab-reviews').click();

            $('html, body').animate({
                scrollTop: $('.flex-tabs').offset().top,
            }, 600);
        }
    }

    /**
     * Inject ID into the pagination link
     */
    injectPaginationLink() {
        const $nextLink = $('.pagination-item--next .pagination-link', this.$reviewsContent);
        const $prevLink = $('.pagination-item--previous .pagination-link', this.$reviewsContent);

        if ($nextLink.length) {
            $nextLink.attr('href', `${$nextLink.attr('href')} #product-reviews`);
        }

        if ($prevLink.length) {
            $prevLink.attr('href', `${$prevLink.attr('href')} #product-reviews`);
        }
    }

    registerValidation() {
        this.validator.add([{
            selector: '[name="revrating"]',
            validate: 'presence',
            errorMessage: 'The \'Rating\' field cannot be blank.',
        }, {
            selector: '[name="revtitle"]',
            validate: 'min-length:2',
            errorMessage: 'The \'Review Subject\' field cannot be blank.',
        }, {
            selector: '[name="revtext"]',
            validate: 'min-length:2',
            errorMessage: 'The \'Comments\' field cannot be blank.',
        }, {
            selector: '[name="email"]',
            validate: (cb, val) => {
                const result = forms.email(val);
                cb(result);
            },
            errorMessage: 'Please use a valid email address, such as user@example.com.',
        }]);

        return this.validator;
    }

    validate() {
        return this.validator.performCheck();
    }
}
