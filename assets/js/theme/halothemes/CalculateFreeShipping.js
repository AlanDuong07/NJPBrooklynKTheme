import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';

export default function (themeSettings, free_shipping_message = '', countryCode = '') {
    
    if (themeSettings.themevale_CalculateFreeShipping == false) return false;

    if( getCookie('themevale_CalculateFreeShipping') === 'closed') return false;
    
    const options = {
        template: {
            pageTitle: 'cart/page-title',
            statusMessages: 'cart/status-messages',
        },
    };
    var shopperCurrency;
    var previewCart = "";
    var is_exist_100 = false, max_percent = 0;
    var shipping_message = free_shipping_message[0];

    $.ajax({
        type: "GET",
        url: '/api/storefront/checkout-settings',
        headers: {
            "Accept": "application/vnd.bc.v1+json",
            "X-API-INTERNAL": "This API endpoint is for internal use only and may change in the future"
        },
        success: function(response){
            if( response ){
                shopperCurrency = response.storeConfig.shopperCurrency;
                
                var currency =  free_shipping_message[0].match(/\d+/)[0];
                var new_currency = currency * shopperCurrency.exchangeRate;
                new_currency = formatMoney(new_currency, shopperCurrency.decimalPlaces, shopperCurrency.decimalSeparator, shopperCurrency.thousandsSeparator );
                if( shopperCurrency.symbolLocation == "left")
                    new_currency = shopperCurrency.symbol + new_currency;
                else
                    new_currency = new_currency + shopperCurrency.symbol;
                
                shipping_message = free_shipping_message[0] = free_shipping_message[0].replace(response.storeConfig.currency.symbol + currency, new_currency);
            }
        }
    });

    function formatMoney(n, c, d, t) {
      var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    if( countryCode == '')
        findCountry();
    else
        getCart();
    
    $(document).ready(function(){

        var free_shipping_css = '@keyframes load-ani {100% {-webkit-transform: rotate(360deg);transform: rotate(360deg); } }@-webkit-keyframes load-ani {100% {-webkit-transform: rotate(360deg); } }@keyframes fadeIn {from {opacity: 0; }to {opacity: 1; } }@-webkit-keyframes fadeIn {from {opacity: 0; }to {opacity: 1; } }@-webkit-keyframes progress-bar-stripes { from { background-position: 0 0 }to { background-position: 40px 0 }}@-moz-keyframes progress-bar-stripes { from { background-position: 0 0 }to { background-position: 40px 0 }}@keyframes progress-bar-stripes { from { background-position: 0 0 }to { background-position: 40px 0 }}[data-cart-status], .alertBox.alertBox--info {display: none;}';
        $( "<style>"+free_shipping_css+"</style>" ).appendTo( "head" );

        shipping_message = "<span>"+shipping_message+"</span>";
       
        var banner = '<div id="fs_container" style="display: none; color: inherit;"><div id="fs_background" style="position: relative; opacity: 1; margin: 0px; padding: 0px; left: 0px; background-color: '+ themeSettings.themevale_FreeShipping_bg +'; width: 100%; z-index: 100000; top: 0px;"><div id="fs_bar" style="text-align: center; margin: 0px; padding: 10px 35px; display: -ms-flexbox; display: -webkit-flex; display: flex; -ms-flex-align: center; -webkit-align-items: center; align-items: center; -ms-flex-pack: center; -webkit-justify-content: center; justify-content: center; -ms-flex-wrap: wrap; -webkit-flex-wrap: wrap; flex-wrap: wrap; min-height: 50px; height: auto; width: 100%; box-sizing: border-box; border: none; color: '+themeSettings.themevale_FreeShipping_text+'; font-size: 18px; font-weight: 600; line-height: 26px;"></div><div><a id="fs_close" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); font-family: Helvertical, Arial, sans-serif; font-weight: 400; font-size: 18px; color: #fff; text-decoration: none;" href="javascript:void(0)">X</a></div></div></div>';

        // $('body').prepend(banner);

        $(document).on('click', '#fs_close', function(){
            setCookie('themevale_CalculateFreeShipping', 'closed', 1);
            $('#fs_container').slideUp();
        })
        
        $(document).ajaxComplete(( event, xhr, settings ) => {

            try{
                if ( settings.url.indexOf("/cart.php") != -1 ) {
                    
                    if( xhr.responseJSON != undefined ) {
                        if( xhr.responseJSON.hasOwnProperty('statusMessages') ){
                            if( xhr.responseJSON.statusMessages != "" )
                                showFreeShippingMessage(xhr.responseJSON.statusMessages, previewCart);
                            else
                                showFreeShippingMessage(shipping_message, previewCart);
                            previewCart = '';
                            max_percent = 0;
                            is_exist_100 = false;
                        }
                    }
                    else{
                        if( $(xhr.responseText).hasClass('previewCart') ){
                            previewCart = 'popupCart';
                            getCart(  );
                        } 
                        else if( $(xhr.responseText).find('.previewCart').length ) {
                            previewCart = 'previewCart';
                            getCart(  );
                        }
                    }
                    
                }
            }
            catch(e){}
        });
    
        
    });

    function getCart(){
        utils.api.cart.getContent(options, (err, response) => { });
    }

    function showFreeShippingMessage(message, previewCart = '') {
        var country = "";
        if( $(message).length ) {
           

            $(message).each((i, el) => {
                if( el.nodeName == "#text")
                    return;
                if( is_exist_100 == true)
                    return;
                
                country = $('.country', $(el)).text();
                var countryList = country.split(",");

                if( $('.condition_remaining', $(el)).text() != "" || $('.congratulation', $(el)).text()){
                    if ($.inArray(countryCode, countryList) != -1) 
                        shipping_message = showProgress(message, el);
                    else if ($.inArray("All", countryList) != -1) 
                        shipping_message = showProgress(message, el);
                    else if( max_percent == 0)
                            shipping_message = free_shipping_message[0];
                }
            });
        }
        else {
            shipping_message = free_shipping_message[0];
        }
        
        $('#fs_bar').html(shipping_message);
        // $('#fs_container').show();
    }

    function showProgress(shipping_message, el) {
        const condition_required    = $('.condition_required', $(el)).text();
        const condition_matched     = $('.condition_matched', $(el)).text();
        const condition_remaining   = $('.condition_remaining', $(el)).text();

        const num_required  = (condition_required != "" ? Number(condition_required.replace(/[^0-9.-]+/g,"")) : 0);
        const num_matched   = (condition_matched != "" ? Number(condition_matched.replace(/[^0-9.-]+/g,"")) : 0);
        const num_remaining = (condition_remaining != "" ? Number(condition_remaining.replace(/[^0-9.-]+/g,"")) : 0);
        
        shipping_message = free_shipping_message[1].replace('{{remaining}}',condition_remaining );
        var percent = parseInt(num_matched / num_required * 100);
        percent = (percent > 100 ? 100 : percent);
        if( num_required == num_remaining )
            percent = 100;

        if( $('.congratulation', $(el)).text() != "")
            percent = 100;
        if(percent > max_percent)
            max_percent = percent;
        else
            return;

        var color = (themeSettings.themevale_FreeShipping_100 ? themeSettings.themevale_FreeShipping_100 : '#69c69c');
        if(percent <= 30 ) {
            color = (themeSettings.themevale_FreeShipping_33 ? themeSettings.themevale_FreeShipping_33 : '#F44336');
        }
        else if( percent <= 60) {
            color = (themeSettings.themevale_FreeShipping_66 ? themeSettings.themevale_FreeShipping_66 : '#FF9800');
        }
        else if( percent == 100 ){
            shipping_message = free_shipping_message[2];
        }

        var progress = '<div class="progress_shipping" role="progressbar" style="height: 15px; margin-top: 10px; margin-bottom: 10px;background-color: #e1dfd6;-webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);box-shadow: inset 0 1px 2px rgba(0,0,0,.1);">\
                        <div class="progress-meter" style="position: relative;display: block;height: 100%;background-color: '+color+';text-align: center; line-height: 15px;color: #ffffff;width: '+percent+'%; -webkit-animation: 2s linear 0s normal none infinite running progress-bar-stripes;animation: 2s linear 0s normal none infinite running progress-bar-stripes;background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,rgba(0,0,0,0) 75%,rgba(0,0,0,0)); background-size: 40px 40px; transition: 0.9s linear; transition-property: width, background-color;">'+percent+'%</div>\
                    </div>';

        
        if( previewCart == 'popupCart'){
            if( $('.free_shipping_message', $('.previewCart')).length >= 1 ){
                $('.free_shipping_message', $('.previewCart')).remove();
            }
            if( $('.free_shipping_message', $('.previewCart')).length == 0 ){
                if (percent < 100 ){
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[1].replace('{remaining}','<b style="color: #323232; font-weight: 600;">'+condition_remaining+'</b>' )+'</div>';
                    shipping_message = free_shipping_message[1].replace('{remaining}','<span style="border-bottom: 1px solid #fff; display: inline-block; line-height: 19px;">'+condition_remaining+'</span>' );
                }
                else{
                    is_exist_100 = true;
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[2]+'</div>';
                }
                $('.previewCart-header').append('<div class="free_shipping_message">' + progress + '</div>');
            }
        }
        else if( previewCart == 'previewCart' ){

            if( $('.free_shipping_message', $('.previewCart').parent() ).length >= 1 ){
                $('.free_shipping_message', $('.previewCart').parent() ).remove();
            }
            if( $('.free_shipping_message', $('.previewCart').parent() ).length == 0 ){
                if (percent < 100 ){
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[1].replace('{remaining}','<b style="color: #323232; font-weight: 600;">'+condition_remaining+'</b>' )+'</div>';
                    shipping_message = free_shipping_message[1].replace('{remaining}','<span style="border-bottom: 1px solid #fff; display: inline-block; line-height: 19px;">'+condition_remaining+'</span>' );
                }
                else{
                    is_exist_100 = true;
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[2]+'</div>';
                }
                $('.previewCart').parent().prepend('<div class="free_shipping_message">' + progress + '</div>');
            }
        }
        else if( window.location.pathname == '/cart.php'){
            // cart page
            if( $('.free_shipping_message', $('[data-cart-content]').parent() ).length >= 1 ){
                $('.free_shipping_message', $('[data-cart-content]').parent() ).remove();
            }
            if( $('.free_shipping_message', $('[data-cart-content]').parent() ).length == 0 ){
                if (percent < 100 ){
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[1].replace('{remaining}','<b style="color: #323232; font-weight: 600;">'+condition_remaining+'</b>' )+'</div>';
                    shipping_message = free_shipping_message[1].replace('{remaining}','<span style="border-bottom: 1px solid #fff; display: inline-block; line-height: 19px;">'+condition_remaining+'</span>' );
                }
                else{
                    is_exist_100 = true;
                    progress += '<div class="fsm-content" style="margin-bottom: 25px;">'+free_shipping_message[2]+'</div>';
                }
                $('[data-cart-content]').prepend('<div class="free_shipping_message">' + progress + '</div>');
            }
        }
        else{
            // not cart page
            if (percent < 100 ){
                shipping_message = free_shipping_message[1].replace('{remaining}','<span style="border-bottom: 1px solid #fff; display: inline-block; line-height: 19px;">'+condition_remaining+'</span>' );
            }
            else{
                is_exist_100 = true;
                shipping_message = free_shipping_message[2];
            }
        }

        return shipping_message;
    }

    function findCountry () {
        $.getScript('https://ssl.geoplugin.net/javascript.gp?k=9247556ec91c71e9', function() {
            countryName = geoplugin_countryName();
            countryCode = geoplugin_countryCode();
            currencyCode = geoplugin_currencyCode();

            var countryCodeArray = ["US"];
            var destinationCountryName = "<span>Free shipping, within US, for orders over 3 Orbit Small</span>";

            if ($.inArray(countryCode, countryCodeArray) != -1) {
                shipping_message = destinationCountryName;
            }

            var countryCodeArray = ["HK","CN","TW","JP","TH","PH","ID","VN","BN","KR","PK","IN","BD","MM","NP","KP","LK","KZ","KH","LA","UZ","MN","MO","TL","IR","IQ","YE","AF","SY","AZ","AE","TJ","KG","LB","OM","KW","QA","BH","BT"];
            var destinationCountryName = "<span>Free shipping, within Vietnam, for orders over $200</span>";

            if ($.inArray(countryCode, countryCodeArray) != -1) {
                // alert(destinationCountryName+"-"+destinationCountryURL);
                shipping_message = destinationCountryName;
            }

            getCart(  );

        });
    }

    function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
   }

   function getCookie(cname) {
      const name = cname + '=';
      const ca = document.cookie.split(';');

      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) === ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
         }
      }
      return '';
   }

   const deleteCookie = function(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   };
}
