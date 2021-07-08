import utils from '@bigcommerce/stencil-utils';

export default function (context) {
    const azWrapper = $('#azBrands'),
        azNavigation = $('#azBrandsTable');

    const requestOptions = {
        config: {
            blog: {
                posts: {
                    limit: context.themeSettings.homepage_brands_count,
                },
            },
        },
        template: 'halothemes/halo-all-brands',
    };

    if (context.themeSettings.halothemes_brandlayout === 'aztable') {
        getAllBrand();
        brandNavigationEvent();
    }

    function getAllBrand(){
        azWrapper.addClass('is-loading');

        const url = context.urls.brands;

        utils.api.getPage(url, requestOptions, (error, response) => {
            if (error) {
                return '';
            }

            var list = $(response);

            parseListBrand(list);

            const nextUrl = list.data('brands-list-next');

            if (nextUrl) {
                loadMoreBrands(nextUrl);
            } else{
                azWrapper.removeClass('is-loading');
            }
        });
    }

    function isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }

    function brandNavigationEvent(){
        azNavigation.on('click', 'a', (event) => {
            event.preventDefault();

            const $target = $(event.currentTarget);

            azNavigation.children('li').removeClass('is-active');

            $target.parent().addClass('is-active');

            const letter = $target.data('href');

            if (letter !== undefined || letter) {
                azWrapper.removeClass('active-all');
                azWrapper.find('.azBrands-group').removeClass('is-active');
                azWrapper.find('[data-letter='+letter+']').addClass('is-active');
            } else {
                azWrapper.addClass('active-all');
            }
        });
    }

    function parseListBrand(list){
        azWrapper.find('.azBrands-group').each((index, element) => {
            var letter = $(element).data('letter');

            if(!isLetter(letter)){
                for (let i = 0; i < 10; i++) {
                    $('.azBrands-group-list', element).append(list.find('[data-brand-letter='+i+']'));
                }
            } else {
                $('.azBrands-group-list', element).append(list.find('[data-brand-letter='+letter+']'));
            }

            if($('.azBrands-group-list', element).children().length > 0){
                azNavigation.find('[data-letter='+letter+']').removeClass('disable').addClass('has-letter');
            }
        });
    }

    function loadMoreBrands(url) {
        utils.api.getPage(url, requestOptions, (error, response) => {
            if (error) {
                return '';
            }

            var list = $(response);

            parseListBrand(list);

            const nextUrl = list.data('brands-list-next');

            if (nextUrl) {
                loadMoreBrands(nextUrl);
            } else{
                azWrapper.removeClass('is-loading');
            }
        });
    }
}