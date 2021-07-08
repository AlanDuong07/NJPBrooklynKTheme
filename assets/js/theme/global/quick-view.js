import $ from 'jquery';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal } from './modal';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', (event) => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('product-id');

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { config: { products: { new: true }, product: { videos: true } }, template: 'products/quick-view' }, (err, response) => {
            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');

            const thumbnailCarousel = modal.$content.find('.productView-thumbnails');

            modal.$content.find('[data-slick]').slick();

            if($(window).width() > 1024) {
                $(".halo_productView-images .productView-image").zoom();
            }

            modal.$content.find('.productView-thumbnail').each( function(index, el) {
                if ($(this).children('a').data('image-gallery-zoom-image-url') == modal.$content.find('.productView-image').data('zoom-image') ){
                    $(this).children('a').addClass('is-active');
                }
            });

            $('a.videos-tab').click(function(event) {
                event.preventDefault();
                $('.halo_productQuickView .productView-videos-wrap').removeClass('is-hidden');
                $('.halo_productQuickView .productView-image-wrap').addClass('is-hidden');
            });

            $('a.photos-tab').click(function(event) {
                event.preventDefault();
                $('.halo_productQuickView .productView-image-wrap').removeClass('is-hidden');
                $('.halo_productQuickView .productView-videos-wrap').addClass('is-hidden');
            });

            // thumbnailCarousel.trigger('to.owl.carousel', [modal.$content.find('.productView-thumbnail-link.is-active').parents('.owl-item').index(), 200]);

            // $('.productView--quickView a.videos-tab').click(function(event) {
            //     event.preventDefault();
            //     $('.productView--quickView .productView-images').addClass('current-videos-tab');
            //     $('.productView--quickView a.photos-tab').removeClass('current-tab');
            //     $('.productView--quickView #product-photos').addClass('hide');
            //     $(this).addClass('current-tab');
            //     $('.productView--quickView #product-videos').removeClass('hide');
            //     $('.productView--quickView .productView-image').addClass('hide');
            //     $('.productView--quickView .productView-videos').removeClass('hide');
            //     $('.productView--quickView .productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"playVideo"'+',"args":""}', '*');
            // });

            // $('.productView--quickView a.photos-tab').click(function(event) {
            //     event.preventDefault();
            //     $('.productView--quickView .productView-images').removeClass('current-videos-tab');
            //     $('.productView--quickView a.videos-tab').removeClass('current-tab');
            //     $('.productView--quickView #product-videos').addClass('hide');
            //     $(this).addClass('current-tab');
            //     $('.productView--quickView #product-photos').removeClass('hide');
            //     $('.productView--quickView .productView-image').removeClass('hide');
            //     $('.productView--quickView .productView-videos').addClass('hide');
            //     $('.productView--quickView .productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"pauseVideo"'+',"args":""}', '*');
            // });

            // $('.productView--quickView a.video-thumbnail').click(function(event) {
            //     event.preventDefault();
            //     $('.productView--quickView .productView-videos iframe').attr('src', '//www.youtube.com/embed/'+$(this).data('video-id')+'?enablejsapi=1');
            //     setTimeout(function() {
            //         $('.productView--quickView .productView-videos iframe')[0].contentWindow.postMessage('{'+'"event":"command",'+'"func":"playVideo"'+',"args":""}', '*');
            //     }, 500);
            // });

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });
}
