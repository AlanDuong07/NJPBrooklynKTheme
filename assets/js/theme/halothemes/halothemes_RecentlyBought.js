import $ from 'jquery';
import jqueryCookie from 'jquery.cookie';
import utils from '@bigcommerce/stencil-utils';


export default function(context) {
    
	// ========================================================================
    // Someone Purchase
    function recentlyBought() {
        var productIDs = context.themeSettings.recently_bought_productID;
        var Location1 = context.themeSettings.recently_bought_location1;
        var Location2 = context.themeSettings.recently_bought_location2;
        var Location3 = context.themeSettings.recently_bought_location3;
        var Location4 = context.themeSettings.recently_bought_location4;
        var Location5 = context.themeSettings.recently_bought_location5;
        var Location6 = context.themeSettings.recently_bought_location6;
        var Location7 = context.themeSettings.recently_bought_location7;
        var Location8 = context.themeSettings.recently_bought_location8;
        var Location9 = context.themeSettings.recently_bought_location9;
        var Location10 = context.themeSettings.recently_bought_location10;
        var ar1 = Location1.split(', ');
        var ar2 = Location2.split(', ');
        var ar3 = Location3.split(', ');
        var ar4 = Location4.split(', ');
        var ar5 = Location5.split(', ');
        var ar6 = Location6.split(', ');
        var ar7 = Location7.split(', ');
        var ar8 = Location8.split(', ');
        var ar9 = Location9.split(', ');
        var ar10 = Location10.split(', ');

        var hoursItems = context.themeSettings.recently_bought_hours;
        var listHours = JSON.parse("[" + hoursItems + "]");

        var listIDs = JSON.parse("[" + productIDs + "]");

        var text_info = context.themeSettings.recently_bought_text_info;
        var text_name = context.themeSettings.recently_bought_text_name;

        var changeSlides = context.themeSettings.recently_bought_changeSlides;
        var changeSlidesTime = 1000 * (Number(changeSlides));

        $("body").append('<div id="recently_bought_list"></div>');

        setInterval(function(){
            $('.themevale_recently-bought').hide();
            var item = (Math.floor(Math.random()*listIDs.length));
            var productId = listIDs[item];

            var locationList = Array(ar1,ar2,ar3,ar4,ar5,ar6,ar7,ar8,ar9,ar10);
            var locationItem = (Math.floor(Math.random()*locationList.length));
            var location = locationList[locationItem];

            var hour_item = (Math.floor(Math.random()*listHours.length));
            var hours = listHours[hour_item];

            if ($.cookie('recently_bought_notification') == 'closed') {
                $('#recently_bought_list').remove();
            }
            $(document).on('click','.themevale_recently-bought .modal-close',function(){
                $('#recently_bought_list').remove();
                $.cookie('recently_bought_notification', 'closed', {expires:1, path:'/'});
            });

            if( $('#RB_'+ productId).length ) {
                $('#RB_'+ productId).show();
                $('.themevale_recently-bought').css('animation-name','fadeInUp');
            }
            else {
                utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
                    var name = $('.productView-title', $(response)).text();
                    var img = $('.productView-image', $(response)).find('img').attr('src');
                    var url = $('.productView-title', $(response)).data('product-view-url');

                    var html = '<div id="RB_'+productId+'" class="themevale_recently-bought">\
                        <a href="#" class="modal-close" data-close-recently-bought><span aria-hidden="true">&#215;</span></a>\
                        <div class="recently-bought-inneer">\
                            <div class="product-image">\
                                <a href="'+url+'"><img class="card-image" src="'+img+'" alt="'+name+'" title="'+name+'"></a>\
                            </div>\
                            <div class="product-info">\
                                <p class="text">'+text_name+' <span class="product-name"><a href="'+url+'">'+name+'</a></span></p>\
                                <div id="location-info">'+hours+' '+text_info+' '+location+'</div>\
                            </div>\
                        </div>\
                    </div>';
                    $('#recently_bought_list').append(html);
                    $('.themevale_recently-bought').css('animation-name','fadeInUp');

                    var ckc_manager = $('#consent-manager');
                    var ckc_banner = $('#consent-manager-update-banner');
                    if (ckc_manager.length || ckc_banner.length) {
                        if ($(window).width() >= 1200) {
                            var h_ckc = ckc_manager.outerHeight() + ckc_banner.outerHeight() + 45;
                        }
                        else {
                            var h_ckc = ckc_manager.outerHeight() + ckc_banner.outerHeight() + 15;
                        }
                        $('.themevale_recently-bought').css('bottom', h_ckc);
                    }
                });
            }
            setTimeout(function(){ 
                 $('#RB_'+ productId).hide();
                 
            }, 8000);
        }, changeSlidesTime); 
    }
    if ($(window).width() > 767) {
        if (context.themeSettings.recently_bought == true) {
            recentlyBought();
        } 
    } else {
        if(context.themeSettings.recently_bought == true && context.themeSettings.show_recently_bought_mobile == true) {
            recentlyBought();
        }
    }
}
