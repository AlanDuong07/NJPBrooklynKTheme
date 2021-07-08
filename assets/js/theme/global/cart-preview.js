import $ from 'jquery';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';
import Cart from '../cart';
import { defaultModal } from './modal';
/* eslint-disable func-names */
/* eslint space-before-function-paren: ["error", "never"] */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable space-before-blocks */
/* eslint-disable padded-blocks */

import GeminiScrollbar from 'gemini-scrollbar';

export default function(secureBaseUrl, cartId) {
    const loadingClass = 'is-loading';
    const $cart = $('[data-cart-preview]');
    const $cartDropdown = $('#cart-preview-dropdown .cart-preview-inner');
    const $cartLoading = $('<div class="loadingOverlay"></div>');
    const $body = $('body');

    const contextJSON = null;
    const context = JSON.parse(contextJSON || '{}');

    if(location.pathname == "/cart.php"){
        var cart_page = new Cart(context);
        cart_page.onReady();
    }

    $('body').on('cart-quantity-update', (event, quantity) => {
        $('.cart-quantity')
            .text(quantity)
            .toggleClass('countPill--positive', quantity > 0);
    });

    const eventtype = $.browser.mobile ? 'touchstart' : 'click';
    $cart.on(eventtype, function(ev) {
        ev.preventDefault();
        const options = {
            template: 'common/cart-preview',
        };
        $('body').toggleClass('side-cart-open');

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            if (response.search('previewCart-emptyBody') > 0) {
                $('#cart-preview-dropdown .triangle-with-shadow').removeClass('triangle-grey');
            } else {
                $('#cart-preview-dropdown .triangle-with-shadow').addClass('triangle-grey');
            }

            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
            // if ($cartDropdown.find('li.previewCartItem').size() >= 3) {
            //     const myCartScrollbar = new GeminiScrollbar({
            //         element: document.querySelector('.previewCartList'),
            //         onResize: function(){},
            //     }).create();
            // }

        });
    });



    $('.recently-viewed-products-sidebar .cart-icon').on(eventtype, function(ev) {
        ev.preventDefault();
        const options = {
            template: 'common/cart-preview',
        };
        $('body').toggleClass('side-cart-open');

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            if (response.search('previewCart-emptyBody') > 0) {
                $('#cart-preview-dropdown .triangle-with-shadow').removeClass('triangle-grey');
            } else {
                $('#cart-preview-dropdown .triangle-with-shadow').addClass('triangle-grey');
            }

            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();
        });
    });

    function refreshContent(remove) {
        const options = {
            template: 'common/cart-preview',
        };

        $cartDropdown
            .addClass(loadingClass)
            .prepend($cartLoading);
        $cartLoading
            .show();

        utils.api.cart.getContent(options, (err, response) => {
            $cartDropdown
                .removeClass(loadingClass)
                .html(response);
            $cartLoading
                .hide();

            const quantity = $('[data-cart-quantity]').data('cartQuantity') || 0;

            $('body').trigger('cart-quantity-update', quantity);
        });

        if(location.pathname == "/cart.php"){
            cart_page.refreshContent();
        }
    }

    $(document).on(eventtype, function(ev) {
        if ($(ev.target).closest('#top-cart, #cart-preview-dropdown, .cart-icon, [data-prevent-quick-search-close], [data-cart-edit-item-remove]').length === 0) {
            $('body').removeClass('side-cart-open');
        }
    });

    $(document).on('click', '.previewCart-icon-close', (event) => {
        event.preventDefault();
        $('body').removeClass('side-cart-open');
    });

    // cart update
    $(document).on('click','[data-cart-update]', (event) => {
        const $target = $(event.currentTarget);

        event.preventDefault();

        // update cart quantity
        cartUpdate($target);
    });

    // cart qty manually updates
    $(document).on('focus','.previewCart .form-input--incrementTotal', (event) => {
        const $target = $(event.currentTarget);
        $target.data('preVal', $target.val());
    });    
    
    $(document).on('change','.previewCart .form-input--incrementTotal', (event) => {
        const $target = $(event.currentTarget);
        var preVal= $target.data('preVal');
        event.preventDefault();

        cartUpdateQtyTextChange($target, preVal);
    });

    $(document).on('click','.previewCart .btn-removeItem', (event) => {
        const itemId = $(event.currentTarget).data('cart-itemid');
        const openTime = new Date();
        const result = confirm($(event.currentTarget).data('confirm-delete'));
        const delta = new Date() - openTime;
        event.preventDefault();

        // Delta workaround for Chrome's "prevent popup"
        if (!result && delta > 10) {
            return;
        }

        // remove item from cart
        cartRemoveItem(itemId);
    });

    $(document).on('click', '.product-addmore-button', event => {
        event.preventDefault();
        const $form = $('.product-edit-info [data-product-option-change3]').eq(0).clone();
        $form.appendTo('.product-edit-info');
    });

    $(document).on('click', '[data-cart-edit-item-remove] a', event => {
        event.preventDefault();

        const $form = $(event.currentTarget).parents('.product-edit-change');
        $form.remove();
    });

    $(document).on('click', '[data-edit-cart-add-to-cart]', event =>{
        const $form = $('[data-product-option-change3] form');
        const itemId = $('.product-edit-detail .product-edit').data('product-edit-item-id');
        var arrPro = new Array();

        $form.each(function(i, val) {
            arrPro.push(i);
        });

        var check = false;

        if (arrPro.length > 0) {
            check = checkProduct($form, arrPro);
        }

        if (check) {
            if (arrPro.length > 0) {
                utils.api.cart.itemRemove(itemId, (err, response) => {
                    if (response.data.status === 'succeed') {
                        $('[data-edit-cart-add-to-cart]').addClass('loading');
                        addToCart($form, 0, arrPro, itemId);
                    } else {
                        alert(response.data.errors.join('\n'));
                        updateCartContent(itemId);
                    }
                });
            }
        } else {
            const errorMessage = 'Please make sure all options have been filled in.';

            if (errorMessage) {
                alert(errorMessage);
            }
        }

        event.preventDefault();
    });

    $(document).on('click', '.previewCart .btn-editPreCart', (event) => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('cart-edit-id'),
            itemId = $(event.currentTarget).data('cartItemid'),
            $qty = $(event.currentTarget).data('cart-edit-quantity'),
            itemImg = $(event.currentTarget).parents('.previewCartItem').find('.previewCartItem-image img');

        const modal = defaultModal();

        const options = {
            template: 'halothemes/halo-edit-cart',
        };

        const options2 = {
            template: 'halothemes/halo-edit-cart2',
        };

        modal.open({ size: 'medium' });

        $('#modal').addClass('modal--editOptions');
        $('.modal-background').addClass('modal--editOptions-background');

        utils.api.productAttributes.configureInCart(itemId, options2, (err2, response2) => {
            utils.api.product.getById(productId, options, (err, response) => {
                modal.updateContent(response);

                $('#modal').find('[data-product-edit-item-id]').attr('data-product-edit-item-id', itemId);
                $('#modal').find('.product-edit-info [data-cart-edit-item]').prepend(response2.content);
                $('#modal').find('.product-edit-image').append(itemImg.clone());
                $('#modal').find('.cart-edit-row .form-input--incrementTotal').val($qty);
                $('#modal').find('.cart-edit-row .form-input--incrementTotal').attr('cart-itemid', itemId);
                $('#modal').find('.cart-edit-row .form-input--incrementTotal').attr('id', 'qty-'+itemId);

                const $form = $('#modal .form');
                const $submit = $('[data-edit-cart-add-to-cart]');
                const $messageBox = $('.alertMessageBox');
                const $productOptionsElement = $('[data-product-option-change3]');
                const hasOptions = $productOptionsElement.html().trim().length;
                const hasDefaultOptions = $productOptionsElement.find('[data-default]').length;

                if (hasDefaultOptions && hasOptions) {
                    utils.api.productAttributes.optionChange(productId, $form.serialize(), (err, response) => {
                        const attributesData = response.data || {};

                        updateProductAttributes($form, attributesData);

                        $('#modal').find('.cart-edit-row .form-input--incrementTotal').attr('data-stock', attributesData.stock);

                        if (hasDefaultOptions) {
                            if (attributesData.purchasing_message) {
                                $('p.alertBox-message', $messageBox).text(attributesData.purchasing_message);
                                $submit.prop('disabled', true);
                                $messageBox.show();
                            } else {
                                $submit.prop('disabled', false);
                                $messageBox.hide();
                            }

                            if (!attributesData.purchasable || !attributesData.instock) {
                                $submit.prop('disabled', true);
                            } else {
                                $submit.prop('disabled', false);
                            }

                            if (_.isObject(attributesData.price)){
                                if (attributesData.price.with_tax) {
                                    $form.find('[data-cart-edit-item-price] .price').html(attributesData.price.with_tax.formatted);
                                }

                                if (attributesData.price.without_tax) {
                                    $form.find('[data-cart-edit-item-price] .price').html(attributesData.price.without_tax.formatted);
                                }
                            }
                        }
                    });
                }
                setProductVariant($form);
            });
        });
    });

    $(document).on('change', '[data-product-option-change3]' , event => {
        const $changedOption = $(event.target);
        const $form = $changedOption.parents('form');
        const $submit = $('[data-edit-cart-add-to-cart]');
        const $messageBox = $('.alertMessageBox');
        const item = $('[name="product_id"]', $form).val();

        utils.api.productAttributes.optionChange(item, $form.serialize(), (err, result) => {
            const data = result.data || {};

            if (err) {
                alert(err);
                return false;
            }

            updateProductAttributes($form, data);
            
            if (data.purchasing_message) {
                $('p.alertBox-message', $messageBox).text(data.purchasing_message);
                $submit.prop('disabled', true);
                $messageBox.show();
            } else {
                $submit.prop('disabled', false);
                $messageBox.hide();
            }

            if (!data.purchasable || !data.instock) {
                $submit.prop('disabled', true);
            } else {
                $submit.prop('disabled', false);
            }

            if (_.isObject(data.price)) {
                if (data.price.with_tax) {
                    $form.find('[data-cart-edit-item-price] .price').html(data.price.with_tax.formatted);
                }

                if (data.price.without_tax) {
                    $form.find('[data-cart-edit-item-price] .price').html(data.price.without_tax.formatted);
                }
            }
        });

        setProductVariant($form);
    });

    function checkProduct(form, arrPro) {
        var check = true;

        for (var i = 0, len = arrPro.length; i < len; i++) {
            var k = arrPro[i];
            var $form = $(form[k]);
            if ($form.find('[data-fbt-option-change]').length) {
                check = checkBeforeAdd($form);
                if (check == false)
                    return false;
            }
        }

        return check;
    }

    function checkBeforeAdd($attributes) {
        var check = true;

        $attributes.find('select').each(function() {
            if (!$(this).prop('required')) {
            } else {
                if ($(this).val()) {} else {
                    $(this).focus();
                    check = false;
                }
            }
        });

        return check;
    }

    function addToCart(form, i, arrP, cartId) {
        if (i >= arrP.length) {
            window.location = '/cart.php';
            return;
        }

        if (window.FormData === undefined) {
            return;
        }

        var k = arrP[i];
        // Add item to cart
        utils.api.cart.itemAdd(filterEmptyFilesFromForm(new FormData(form[k])), (err, response) => {
            const errorMessage = err || response.data.error;

            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;
                alert(tmp.textContent || tmp.innerText);
            }

            i++;

            if (i >= arrP.length) {
                const modal = defaultModal();

                modal.close();

                updateCartContent(cartId);

                return;
            }

            addToCart(form, i, arrP);
        });
    }

    function filterEmptyFilesFromForm(formData) {
        try {
            for (const [key, val] of formData) {
                if (val instanceof File && !val.name && !val.size) {
                    formData.delete(key);
                }
            }
        } catch (e) {
            console.error(e);
        }

        return formData;
    }

    function updateProductAttributes($scope, data) {
        const behavior = data.out_of_stock_behavior;
        const inStockIds = data.in_stock_attributes;
        const outOfStockMessage = ` (${data.out_of_stock_message})`;

        if (behavior !== 'hide_option' && behavior !== 'label_option') {
            return;
        }

        $('[data-product-attribute-value]', $scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('productAttributeValue'), 10);

            if (inStockIds.indexOf(attrId) !== -1) {
                enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    function disableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.hide();
        } else {
            $attribute.addClass('unavailable');
        }
    }

    function disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);

            if ($select.val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.attr('disabled', 'disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    function enableAttribute($attribute, behavior, outOfStockMessage) {
        if (getAttributeType($attribute) === 'set-select') {
            return enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute.removeClass('unavailable');
        }
    }

    function enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.prop('disabled', false);
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }

    function getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');

        return $parent ? $parent.data('productAttribute') : null;
    }

    function setProductVariant($form) {
        const unsatisfiedRequiredFields = [];
        const options = [];

        $.each($('[data-product-attribute]', $form), (index, value) => {
            const type = value.getAttribute('data-product-attribute');

            if (type === 'set-select') {
                const select = value.querySelector('select');
                const selectedIndex = select.selectedIndex;

                if (selectedIndex !== 0) {
                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }
        });
    }

    function cartRemoveItem(itemId) {
        utils.api.cart.itemRemove(itemId, (err, response) => {
            if (response.data.status === 'succeed') {
                refreshContent();
            } else {
                alert(response.data.errors.join('\n'));
            }
        });
    }

    function cartUpdate($target) {
        const itemId = $target.data('cart-itemid');
        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.val(), 10);
        const maxQty = parseInt($el.data('quantity-max'), 10);
        const minQty = parseInt($el.data('quantity-min'), 10);
        const minError = $el.data('quantity-min-error');
        const maxError = $el.data('quantity-max-error');
        const newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;

        // Does not quality for min/max quantity
        if (newQty < minQty) {
            return alert(minError);
        } else if (maxQty > 0 && newQty > maxQty) {
            return alert(maxError);
        }

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);

                refreshContent(remove);
            } else {
                $el.val(oldQty);
                alert(response.data.errors.join('\n'));
            }
        });
    }

    function cartUpdateQtyTextChange($target, preVal = null) {
        const itemId = $target.data('cart-itemid');
        const $el = $(`#qty-${itemId}`);
        const maxQty = parseInt($el.data('quantityMax'), 10);
        const minQty = parseInt($el.data('quantityMin'), 10);
        const oldQty = preVal !== null ? preVal : minQty;
        const minError = $el.data('quantityMinError');
        const maxError = $el.data('quantityMaxError');
        const newQty = parseInt(Number($el.val()), 10);
        let invalidEntry;

        // Does not quality for min/max quantity
        if (newQty < minQty) {
            return alert(minError);
        } else if (maxQty > 0 && newQty > maxQty) {
            return alert(maxError);
        }

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);

                refreshContent(remove);
            } else {
                $el.val(oldQty);
                alert(response.data.errors.join('\n'));
            }
        });
    }

    function updateCartContent(cartItemId, onComplete) {
        if($body.hasClass('side-cart-open')){
            $cartDropdown
                .addClass(loadingClass)
                .prepend($cartLoading);
           $cartLoading
              .show();

            getCartContent(cartItemId, (err, response) => {
                if (err) {
                    return;
                }

                $cartDropdown
                    .removeClass(loadingClass)
                    .html(response);
                $cartLoading
                    .hide();

                const quantity = $('[data-cart-quantity]').data('cartQuantity') || 0;
                $body.trigger('cart-quantity-update', quantity);

                if (onComplete) {
                    onComplete(response);
                }
            });
        }
      
        if(location.pathname == "/cart.php"){
            cart_page.refreshContent();
            calculateFreeShipping();
        }
    }

    function getCartContent(cartItemId, onComplete) {
       const options = {
            template: 'common/cart-preview'
        };

        utils.api.cart.getContent(options, onComplete);
    }

    function listenQuantityChange() {
        $(document).on('click', '[data-cart-edit-item-quantity] button', event => {
            event.preventDefault();
            const $target = $(event.currentTarget);
            const itemId = $target.data('cart-itemid');
            const $el = $target.siblings('.form-input--incrementTotal');
            const maxQty = parseInt($el.data('quantityMax'), 10);
            const minQty = parseInt($el.data('quantityMin'), 10);
            const oldQty = parseInt($el.val(), 10);
            const minError = $el.data('quantityMinError');
            const maxError = $el.data('quantityMaxError');
            const newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
            const stock = $el.data('stock');
            const proTitle= $('.product-edit-title').html();
            let invalidEntry;

            // Does not quality for min/max quantity
            if (!newQty) {
                invalidEntry = newQty;
                $el.val(oldQty);
                alert(`${invalidEntry} is not a valid entry`)
                
            } else if (newQty < minQty) {
                $el.val(oldQty);
                alert(minError)
                
            } else if (maxQty > 0 && newQty > maxQty) {
                $el.val(oldQty);
                alert(maxError)
            } else if (newQty > stock) {
                $el.val(oldQty);
                alert("We don't have enough "+ proTitle +" stock on hand for the quantity you selected. Please try again.");
            } else {
               $el.val(newQty);
            }            
        });

        $(document).on('focus','[data-cart-edit-item-quantity] .form-input--incrementTotal', (event) => {
            const $target = $(event.currentTarget);
            $target.data('preval', $target.val());
        });  

        $(document).on('change','[data-cart-edit-item-quantity] .form-input--incrementTotal', (event) => {
            const $target = $(event.currentTarget);
            var preVal= $target.data('preval');
            event.preventDefault();

            listenQuantityChangeUpdate($target, preVal);
        });

    }
    listenQuantityChange();

    function listenQuantityChangeUpdate($target, preVal = null) {
        const itemId = $target.data('cart-itemid');
        const $el = $target;
        const maxQty = parseInt($el.data('quantityMax'), 10);
        const minQty = parseInt($el.data('quantityMin'), 10);
        const oldQty = preVal !== null ? preVal : minQty;
        const minError = $el.data('quantityMinError');
        const maxError = $el.data('quantityMaxError');
        const newQty = parseInt(Number($el.val()), 10);
        const stock = $el.data('stock');
        const proTitle= $('.product-edit-title').html();
        let invalidEntry;

        // Does not quality for min/max quantity
        if (!newQty) {
            invalidEntry = $el.val();
            $el.val(oldQty);
            alert(`${invalidEntry} is not a valid entry`)
            
        } else if (newQty < minQty) {
            $el.val(oldQty);
            alert(minError)
            
        } else if (maxQty > 0 && newQty > maxQty) {
            $el.val(oldQty);
            alert(maxError)
        }else if (newQty > stock) {
            $el.val(oldQty);
            alert("We don't have enough "+ proTitle +" stock on hand for the quantity you selected. Please try again.");
        }
    }
}
