import utils from '@bigcommerce/stencil-utils';

export default function() {
    if ($(window).width() > 1024) {
        if ($('.productView-nextProducts').length) {
            var productId = $('.productView-nextProducts').data('product-id'),
                nextId = productId + 1,
                prevId = productId - 1,
                nextLink, prevLink;

            const $prodWrap = $('.productView-nextProducts .next-prev-modal'),
                $prodIcons = $('.productView-nextProducts .next-prev-icons'),
                $options = {
                    template: 'halothemes/halo-prev-next-product-tpm'
                };

            const $breadcrumbs = $('#breadcrumbs-wrapper .breadcrumbs');

            if ($breadcrumbs.length) {
                $breadcrumbs.addClass('is-preNextProduct');
            }

            if(nextId != undefined){
                utils.api.product.getById(nextId, $options, (err, response) => {
                    if(err){
                        return false;
                    }
                    nextLink = $(response).find('.card-link').attr('href');

                    if(nextLink != undefined && nextLink != ''){
                        $prodIcons.find('.next-icon').attr('href', nextLink);
                        $prodIcons.find('.next-icon').removeClass('disable');
                        $prodWrap.find('#next-product-modal').append(response);
                    }
                });            
            }

            if(prevId != undefined){
                utils.api.product.getById(prevId, $options, (err, response) => {
                    if(err){
                        return false;
                    }

                    prevLink = $(response).find('.card-link').attr('href');
                    
                    if(prevLink != undefined && prevLink != ''){
                        $prodIcons.find('.prev-icon').attr('href', prevLink);
                        $prodIcons.find('.prev-icon').removeClass('disable');
                        $prodWrap.find('#prev-product-modal').append(response);
                    }
                });            
            }

            $prodIcons.on('mouseover', function(){
                $prodWrap.addClass('is-active');
            })
            .on('mouseleave', function(){
                $prodWrap.removeClass('is-active');
            });

            $('.next-icon', $prodIcons).on('mouseover', function(){
                if (!$(this).hasClass('disable')) {
                    $('#prev-product-modal').removeClass('is-show');
                    $('#next-product-modal').addClass('is-show');
                }
                else {
                    $('#prev-product-modal').removeClass('is-show');
                }
            });

            $('.prev-icon', $prodIcons).on('mouseover', function(){
                if (!$(this).hasClass('disable')) {
                    $('#next-product-modal').removeClass('is-show');
                    $('#prev-product-modal').addClass('is-show');  
                }
                else {
                    $('#next-product-modal').removeClass('is-show');
                }
            });

            $prodWrap.on('mouseover', function(){
                $prodWrap.addClass('is-active');
            })
            .on('mouseleave', function(){
                $prodWrap.removeClass('is-active');
            });
        }
    }
}
