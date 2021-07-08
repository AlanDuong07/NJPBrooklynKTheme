function menuItem(num) {
    return $('.navPages-container nav.navPages > ul.navPages-list:not(.navPages-list-mobile) > li:nth-child(' + num + ')');
}(function() {
    $.fn.HaloMegaMenu = function(param) {
        param = $.extend({
            dropAlign: 'left',
            dropWidth: '493px',
            dropType: 'imageLeft',
            cateColumns: 1,
            bottomMegamenu: 'none',
            disabled: false,
            bottomCates: '',
            imagesTop: ''
        }, param);
        this.each(function(idx, el) {
            if (param.disabled === false) {
                const subMegaMenu = $(el).children('.navPage-subMenu');
                const nav = $(el).children('.navPages-action').children('span');
                subMegaMenu.removeClass('subMenu').addClass('subMegaMenu');
                $(el).addClass('hasMegamenu');
                $(el).addClass('hasSub');

                // label: New, Sale, Hot
                // if (param.label === 'new') {
                //     nav.after('<span class="menu-label new-label">New</span>');
                // } else if (param.label === 'sale') {
                //     nav.after('<span class="menu-label sale-label">Sale</span>');
                //     $(el).addClass('Sale');
                // } else if (param.label === 'hot') {
                //     nav.after('<span class="menu-label hot-label">Hot</span>');
                // }  else {
                //     $(el).addClass('not-label');
                // }

                // dropdown Alignment
                if (param.dropAlign === 'fullWidth') {
                    $(el).addClass('fullWidth');
                } else if (param.dropAlign === 'center') {
                    $(el).addClass('alignCenter');
                } else if (param.dropAlign === 'right') {
                    $(el).addClass('alignRight');
                } else if (param.dropAlign === 'leftEdge') {
                    $(el).addClass('leftEdge');
                } else if (param.dropAlign === 'rightEdge') {
                    $(el).addClass('rightEdge');
                } else {
                    $(el).addClass('alignLeft');
                }

                // dropdown Type
                if (param.dropType === 'imageLeft') {
                    subMegaMenu.addClass('imageLeft');
                    subMegaMenu.wrapInner('<div class="cateArea"></div>');
                    subMegaMenu.prepend('<div class="imageArea colLeft">' + param.images + '</div>');
                } else if (param.dropType === 'imageRight') {
                    subMegaMenu.addClass('imageRight');
                    subMegaMenu.wrapInner('<div class="cateArea"></div>');
                    subMegaMenu.append('<div class="imageArea colRight">' + param.images + '</div>');
                } else if (param.dropType === 'noImage') {
                    subMegaMenu.addClass('noImage').wrapInner('<div class="cateArea"></div>');
                } else if (param.dropType === 'imageTop') {
                    subMegaMenu.addClass('imageTop').wrapInner('<div class="cateArea"></div>');
                }

                // dropdown Width
                if ((param.dropAlign === 'fullWidth')) {
                    subMegaMenu.wrapInner('<div class="container"></div>');
                    subMegaMenu.css({
                        'width': '100%'
                    });
                } else {
                    subMegaMenu.css({
                        'width': param.dropWidth
                    });
                }

                // cateColumns
                if (param.cateColumns === 2) {
                    subMegaMenu.find('.cateArea').addClass('columns-2');
                } else if (param.cateColumns === 3) {
                    subMegaMenu.find('.cateArea').addClass('columns-3');
                } else if (param.cateColumns === 4) {
                    subMegaMenu.find('.cateArea').addClass('columns-4');
                } else if (param.cateColumns === 5) {
                    subMegaMenu.find('.cateArea').addClass('columns-5');
                }

                // imageAreaWidth
                subMegaMenu.find('.imageArea').css({
                    'width': '100%',
                    'max-width': param.imageAreaWidth
                });

                // cateAreaWidth
                subMegaMenu.find('.cateArea').css({
                    'width': '100%',
                    'max-width': param.cateAreaWidth
                });
                if (param.bottomCates.length && (param.bottomCates !== '')) {
                    subMegaMenu.find('.cateArea').addClass('has-bottom-cates');
                    subMegaMenu.find('.cateArea').append('<div class="bottomCate">' + param.bottomCates + '</div>');
                }
                if (param.imagesTop.length && (param.imagesTop !== '')) {
                    function megamenuImageTop($_image_array) {
                        var j = 1;
                        for (var i = 0; i < $_image_array.length; i++) {
                            j++;
                            subMegaMenu.find('.cateArea > ul > li:nth-child(' + j + ') > a').after('<span class="image-top">'+$_image_array[i]+'</span>');
                        }
                    }
                    megamenuImageTop(param.imagesTop);
                }
                if (param.bottomMegamenu.length && (param.bottomMegamenu !== 'none')) {
                    subMegaMenu.append('<div class="bottomMegamenu">' + param.bottomMegamenu + '</div>');
                }
            } else {
                const nav = $(el).children('.navPages-action').children('span');
                
                // label: New, Sale, Hot
                // if (param.label === 'new') {
                //     nav.after('<span class="menu-label new-label">New</span>');
                // } else if (param.label === 'sale') {
                //     nav.after('<span class="menu-label sale-label">Sale</span>');
                //     $(el).addClass('Sale');
                // } else if (param.label === 'hot') {
                //     nav.after('<span class="menu-label hot-label">Hot</span>');
                // }  else {
                //     $(el).addClass('not-label');
                // }
            }
        });
        return this;
    }
})($);
