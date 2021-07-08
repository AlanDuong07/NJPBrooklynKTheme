import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import swal from 'sweetalert2';
import _ from 'lodash';

export default function(){
    if ($('#form-action-addToCart').length) {
        var scroll = $('#form-action-addToCart').offset();
        var scrollTop = scroll.top;

        $(window).scroll(function(){
            if($(window).scrollTop() > scrollTop){
                if(!$('#sticky_addtocart').hasClass('show_sticky')){
                    var heightHeader = $('.header').height();
                    $('#sticky_addtocart').addClass('show_sticky');
                    $('body').addClass('is-stickyAddToCart');
                    if ($('body').hasClass('is-sticky')) {
                        $('#sticky_addtocart').css('top', heightHeader);
                    } else {
                        $('#sticky_addtocart').css('top', '0px');
                    }
                }
            } else{
                $('#sticky_addtocart').removeClass('show_sticky');
                $('body').removeClass('is-stickyAddToCart');
                $('.pop-up-option').removeClass('is-open');
                $('.choose_options_add').removeClass('is-active');
            }
        });

        $(document).on('click','.choose_options_add', function(event){
            $(this).toggleClass('is-active');
            $('.pop-up-option').toggleClass('is-open');
        });

        $(document).on('click','.pop-up-option .close', function(event){
            $(".pop-up-option").removeClass('is-open');
            $('.choose_options_add').removeClass('is-active');
        });

        window.onload = function(){
            if($(window).scrollTop() > scrollTop){
                if(!$('#sticky_addtocart').hasClass('show_sticky')){
                    var heightHeader = $('.header').height();
                    $('#sticky_addtocart').addClass('show_sticky');
                    $('body').addClass('is-stickyAddToCart');
                    if ($('body').hasClass('is-sticky')) {
                        $('#sticky_addtocart').css('top', heightHeader);
                    } else {
                        $('#sticky_addtocart').css('top', '0px');
                    }
                }
            }
        }
    }
    
}
