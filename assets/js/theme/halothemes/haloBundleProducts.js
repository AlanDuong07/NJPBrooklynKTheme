import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';

export default function(context) {
    const relate_tab = "#relatedProducts";

    showBundle();

    $(document).on('click', '.halo-toggle-options', function(event) {
        event.preventDefault();

        $('.halo-toggle-options').not($(this)).removeClass('is-focus');
        $('.halo-detail-options').not($(this).next('.halo-detail-options')).removeClass('is-open');

        if (!$(this).next('.halo-detail-options').hasClass('is-open')) {
            $(this).addClass('is-focus');
            $(this).next('.halo-detail-options').addClass('is-open');
        } else {
            $(this).next('.halo-detail-options').removeClass('is-open');
            $(this).removeClass('is-focus');
        }
    });

    $(document).on('click', '.halo-option-close', function(event) {
        event.preventDefault();

        $('.halo-detail-options').removeClass('is-open');
        $('.halo-toggle-options').removeClass('is-focus');
    });

    $(document).on('click', event => {
        if ($('.halo-detail-options').hasClass('is-open')) {
            if (($(event.target).closest('.halo-detail-options').length === 0) && ($(event.target).closest('.halo-toggle-options').length === 0)){
                $('.halo-detail-options').removeClass('is-open');
                $('.halo-toggle-options').removeClass('is-focus');
            }
        }
    });

    $(document).on('change', '.halo-detail-checkbox', function() {
        var id = $(this).attr('id').replace('fbt_product', '');

        if ($(this).is(':checked') == false) {
            $('.halo-product-item[data-product-id="' + id + '"]').removeClass('isChecked');
        } else {
            $('.halo-product-item[data-product-id="' + id + '"]').addClass('isChecked');
        }

        totalPrice();
    });

    $(document).on('click', '#halo-addAll', function(event) {
        const $form = $('form', $('#halo-bundle-products'));
        var arrPro = new Array();

        $('.halo-detail-checkbox').each(function(i, val) {
            if ($(val).is(':checked')) {
                arrPro.push(i);
            }
        });

        var check = false;

        if (arrPro.length > 0) {
            check = checkProduct($form, arrPro);
        }

        if (check) {
            if (arrPro.length > 0) {
                $('#halo-bundle-products .loadingOverlay').show();

                addToCart($form, 0, arrPro);
            }
        } else {
            const errorMessage = 'Please make sure all options have been filled in.';

            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                return alert(tmp.textContent || tmp.innerText);

            }
        }

        event.preventDefault();
    });

    function showBundle() {
        const options = {
                template: {
                    item: 'halothemes/halo-bundle-products-tmp',
                    options: 'halothemes/halo-bundle-products-options',
                },
            };

        var prodBundleId = [];

        $('#halo-bundle-products').removeClass('halo-block-disable');

        firstItem();

        $('#halo-bundle-products .bundle-product-right').append('<div class="halo-product-total"><div class="total-price"><span class="text">Total:</span><span class="price"></span></div><a class="button button--primary halo-product-total-button" id="halo-addAll">Add All To Cart</a></div>');

        $.each(context.productCustomFields, function(index, obj) {
            if (obj.name == '__bundleid') {
                prodBundleId = JSON.parse('['+obj.value+']');
            }
        });

        if ($('#halo-bundle-products').length > 0 && prodBundleId.length == 0) {
            var num = 0;
            var list = [];

            $(relate_tab + ' .card').each(function(i, val) {
                list.push({i:i, data: ""});

                var pId = $(val).data('product-id');

                if (pId != undefined) {
                    utils.api.product.getById(pId, options, (err, response) => {
                        if (err) {
                            return false;
                        }

                        list.forEach(function(element) {
                            if(element.i == i){
                                element.data = response;
                            }
                        });
                        
                        num++;

                        if(num == $(relate_tab + ' .card').length){
                            showList(list);
                        }
                    });
                }
            });
        } else if ($('#halo-bundle-products').length > 0 && prodBundleId.length > 0) {
            var num = 0;
            var list = [];

            $.each(prodBundleId, function(i, val){
                list.push({i:i, data: ""});

                var pId = prodBundleId[i];

                if (pId != undefined) {
                    utils.api.product.getById(pId, options, (err, response) => {
                        if (err) {
                            return false;
                        }

                        list.forEach(function(element) {
                            if(element.i == i){
                                element.data = response;
                            }
                        });
                        
                        num++;

                        if(num == prodBundleId.length){
                            showList(list);
                        }
                    });
                }
            });
        }
    }

    function firstItem(){
        const firstItem = $('#halo-bundle-products .halo-product-list .halo-product-item:first-child'),
            pId = firstItem.data('product-id'),
            $form = firstItem.find('form'),
            hasOptions = $form.find('[data-fbt-option-change]').length,
            hasDefaultOptions = $form.find('[data-default]').length;

        if (hasDefaultOptions && hasOptions) {
            utils.api.productAttributes.optionChange(pId, $form.serialize(), (err, response) => {
                const attributesData = response.data || {};
                const attributesContent = response.content || {};

                updateProductAttributes($form, attributesData);

                if (hasDefaultOptions) {
                    updateView($form, attributesData, attributesContent);
                } else {
                    updateDefaultAttributesForOOS(attributesData);
                }
            });
        }
    }

    function showList(list){
        list.forEach(function(element) {
            var response = element.data;

            $('#halo-bundle-products .halo-product-list').append(response.item);

            if (response.options.trim() != "") {
                var pId = $(response.item).data('product-id');
                const $form = $('#halo-bundle-products .halo-product-list .halo-product-item[data-product-id="' + pId + '"] form');

                $form.append(response.options);

                const $productOptionsElement = $('[data-fbt-option-change]', $form);
                const hasOptions = $productOptionsElement.html().trim().length;
                const hasDefaultOptions = $(response.options).find('[data-default]').length;

                if (hasDefaultOptions && hasOptions) {
                    utils.api.productAttributes.optionChange(pId, $form.serialize(), (err, response) => {
                        const attributesData = response.data || {};
                        const attributesContent = response.content || {};

                        updateProductAttributes($form, attributesData);

                        if (hasDefaultOptions) {
                            updateView($form, attributesData, attributesContent);
                        } else {
                            updateDefaultAttributesForOOS(attributesData);
                        }
                    });
                }

                setProductVariant();
            }
        });

        productOptions();
        showSlickSlider();
        totalPrice();
    }

    function showSlickSlider(){
        $('#halo-bundle-products .halo-product-list').slick({
            dots: true,
            arrows: false,
            slidesToShow: 2,
            slidesToScroll: 1,
            mobileFirst: true,
            infinite: false,
            nextArrow: "<div class='slick-next slick-arrow'>next</div>",
            prevArrow: "<div class='slick-prev slick-arrow'>prev</div>",
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToScroll: 1,
                        slidesToShow: 4,
                        dots: false,
                        arrows: true
                    }
                },
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        dots: false,
                        arrows: true
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 551,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }

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
        $attributes.find('input:text, input:password, input:file, textarea').each(function() {

            if (!$(this).prop('required')) {} else {
                if ($(this).val()) {} else {
                    $(this).focus();
                    check = false;
                }
            }
        });

        $attributes.find('select').each(function() {

            if (!$(this).prop('required')) {

            } else {
                if ($(this).val()) {} else {
                    $(this).focus();
                    check = false;
                }
            }
        });

        var att = "";
        $attributes.find('input:radio, input:checkbox').each(function() {
            if (att != $(this).attr("name")) {

                att = $(this).attr("name");
                if (!$(this).prop('required')) {
                    if ($(this).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                    if ($(this).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {}
                    }
                } else {
                    if ($(this).attr("type") == "checkbox") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                    if ($(this).attr("type") == "radio") {
                        if ($("[name='" + att + "']:checked").val()) {} else {
                            check = false;
                        }
                    }
                }
            }
        });

        return check;
    }

    function addToCart(form, i, arrP) {
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
                $('#halo-bundle-products .loadingOverlay').hide();
                updateCartContent(response.data.cart_item.id);

                return;
            }

            addToCart(form, i, arrP);
        });
    }

    function updateCartContent(cartItemId, onComplete) {
        const $body = $('body');
        const loadingClass = 'is-loading';
        const $cartDropdown = $('#halo-cart-sidebar');
        const $cartLoading = $('<div class="loadingOverlay"></div>');

        $body.addClass('openCartSidebar');

        var topCartDropdown;

        if ($(window).scrollTop() > 0 && !$('.header').hasClass('is-sticky')) {
            topCartDropdown = $('.header').outerHeight() - $(window).scrollTop();
        } else {
            topCartDropdown = $('.header').outerHeight();
        }

        $cartDropdown
            .addClass(loadingClass)
            .html($cartLoading)
            .css('top', topCartDropdown);
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

    function getCartContent(cartItemId, onComplete) {
       const options = {
            template: 'common/cart-preview'
        };

        utils.api.cart.getContent(options, onComplete);
    }

    function totalPrice() {
        var total = 0,
            pos = 0,
            symbol = "$";

        $('.halo-product-item.isChecked').each(function(i, val) {
            var currency,
                price, s;

            if ($(val).find('.price-section .price.price--withTax').length){
                currency = $(val).find('.price-section .price.price--withTax').text();
            } else{
                currency = $(val).find('.price-section .price.price--withoutTax').text();
            }

            price = parseFloat(currency.replace(/[^0-9.-]+/g, ""));

            s = currency.replace(parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), "");

            if (isNaN(parseFloat(s.replace(/[^0-9.-]+/g, "")))){
                symbol = s;
            }

            if (currency.indexOf(symbol) != -1){
                pos = currency.indexOf(symbol);
            }

            total = total + price;
        });

        total = parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        if (pos == 0){
            total = symbol + total;
        } else{
            total = total + symbol;
        }

        $('.halo-product-total .price').html(total);
    }

    function productOptions() {
        totalPrice();

        const $form = $('form', $(document));

        const $productOptionsElement = $('[data-fbt-option-change]', $form);

        $(document).on('change', $productOptionsElement, event => {
            productOptionsChanged(event);
            setProductVariant(event);
        });
    }

    function setProductVariant() {
        const unsatisfiedRequiredFields = [];
        const options = [];

        $.each($('[data-fbt-option-change] [data-product-attribute]'), (index, value) => {
            const optionLabel = value.children[0].innerText;
            const optionTitle = optionLabel.split(':')[0].trim();
            const required = optionLabel.toLowerCase().includes('required');
            const type = value.getAttribute('data-product-attribute');

            if ((type === 'input-file' || type === 'input-text' || type === 'input-number') && value.querySelector('input').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'textarea' && value.querySelector('textarea').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'date') {
                const isSatisfied = Array.from(value.querySelectorAll('select')).every((select) => select.selectedIndex !== 0);

                if (isSatisfied) {
                    const dateString = Array.from(value.querySelectorAll('select')).map((x) => x.value).join('-');
                    options.push(`${optionTitle}:${dateString}`);

                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-select') {
                const select = value.querySelector('select');
                const selectedIndex = select.selectedIndex;

                if (selectedIndex !== 0) {
                    options.push(`${optionTitle}:${select.options[selectedIndex].innerText}`);
                    $(value.children[0]).find('[data-option-value]').text(select.options[selectedIndex].innerText);
                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch' || type === 'input-checkbox' || type === 'product-list') {
                const checked = value.querySelector(':checked');
                if (checked) {
                    if (type === 'set-rectangle' || type === 'set-radio' || type === 'product-list') {
                        const label = checked.labels[0].innerText;
                        if (label) {
                            options.push(`${optionTitle}:${label}`);
                            $(value.children[0]).find('[data-option-value]').text(label);
                        }
                    }

                    if (type === 'swatch') {
                        const label = checked.labels[0].children[0];
                        if (label) {
                            options.push(`${optionTitle}:${label.title}`);
                            $(value.children[0]).find('[data-option-value]').text(label.title);
                        }
                    }

                    if (type === 'input-checkbox') {
                        options.push(`${optionTitle}:Yes`);
                    }

                    return;
                }

                if (type === 'input-checkbox') {
                    options.push(`${optionTitle}:No`);
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }
        });
    }

    function productOptionsChanged(event) {
        const $changedOption = $(event.target);
        const $form = $changedOption.parents('form');
        const productId = $('[name="product_id"]', $form).val();

        if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
            return;
        }

        if ($changedOption.attr('id') === 'fbt_product' + productId) {
            return;
        }
        
        utils.api.productAttributes.optionChange(productId, $form.serialize(), (err, response) => {
            const productAttributesData = response.data || {};
            const productAttributesContent = response.content || {};
            showProductImage(productId, productAttributesData);
            updateProductAttributes($form, productAttributesData);
            updateView($form, productAttributesData, productAttributesContent);
            totalPrice();
        });

        return false;
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

    function showProductImage(productId, data) {
        if (_.isPlainObject(data.image)) {
            const mainImageUrl = utils.tools.image.getSrc(
                data.image.data,
                context.themeSettings.productgallery_size
            );

            $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'srcset': mainImageUrl,
                'data-srcset': $(this).attr('srcset'),
            });

        } else {
            const mainImageUrl = $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr('data-srcset');
            $('.halo-product-item[data-product-id="' + productId + '"]').find('img').attr({
                'srcset': mainImageUrl,
                'data-srcset': $(this).attr('srcset'),
            });
        }
    }

    function updateView($scope, data, content = null) {
        const viewModel = getViewModel($scope);

        showMessageBox(data.stock_message || data.purchasing_message);

        if (_.isObject(data.price)) {
            updatePriceView(viewModel, data.price);
        }

        var productId = $('[name="product_id"]', $scope).val();

        if (!data.purchasable || !data.instock) {
            $('.halo-product-item[data-product-id="' + productId + '"]').removeClass('isChecked');

            $('#fbt_product' + productId).prop('checked', false).prop('disabled', true);

            $('.halo-product-item[data-product-id="' + productId + '"]').removeClass('hasOptions--selected');
        } else {
            $('.halo-product-item[data-product-id="' + productId + '"]').addClass('isChecked');

            $('#fbt_product' + productId).prop('checked', true).prop('disabled', false);

            if ($scope.find('[data-fbt-option-change]').length) {
                var check = checkBeforeAdd($scope);

                if (check == true) {
                    $('.halo-product-item[data-product-id="' + productId + '"]').addClass('hasOptions--selected');
                }
            }
        }
    }

    function updateDefaultAttributesForOOS($scope, data) {
        var productId = $('[name="product_id"]', $scope).val();

        if (!data.purchasable || !data.instock) {
            $('.halo-product-item[data-product-id="' + productId + '"]').removeClass('isChecked');
            $('#fbt_product' + productId).prop('checked', false).prop('disabled', true);
            $('.halo-product-item[data-product-id="' + productId + '"]').removeClass('hasOptions--selected');
        } else {
            $('.halo-product-item[data-product-id="' + productId + '"]').addClass('isChecked');
            $('#fbt_product' + productId).prop('checked', true).prop('disabled', false);

            if ($scope.find('[data-fbt-option-change]').length) {
                var check = checkBeforeAdd($scope);

                if (check == true) {
                    $('.halo-product-item[data-product-id="' + productId + '"]').addClass('hasOptions--selected');
                }
            }
        }
    }

    function getViewModel($scope) {
        return {
            $priceWithTax: $('[data-product-price-with-tax]', $scope),
            $priceWithoutTax: $('[data-product-price-without-tax]', $scope),
            rrpWithTax: {
                $div: $('.rrp-price--withTax', $scope),
                $span: $('[data-product-rrp-with-tax]', $scope),
            },
            rrpWithoutTax: {
                $div: $('.rrp-price--withoutTax', $scope),
                $span: $('[data-product-rrp-price-without-tax]', $scope),
            },
            nonSaleWithTax: {
                $div: $('.non-sale-price--withTax', $scope),
                $span: $('[data-product-non-sale-price-with-tax]', $scope),
            },
            nonSaleWithoutTax: {
                $div: $('.non-sale-price--withoutTax', $scope),
                $span: $('[data-product-non-sale-price-without-tax]', $scope),
            },
            priceSaved: {
                $div: $('.price-section--saving', $scope),
                $span: $('[data-product-price-saved]', $scope),
            },
            priceNowLabel: {
                $span: $('.price-now-label', $scope),
            },
            priceLabel: {
                $span: $('.price-label', $scope),
            },
            $weight: $('.productView-info [data-product-weight]', $scope),
            $increments: $('.form-field--increments :input', $scope),
            $addToCart: $('#form-action-addToCart', $scope),
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope),
            },
            $sku: $('[data-product-sku]'),
            $upc: $('[data-product-upc]'),
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope),
            },
            $bulkPricing: $('.productView-info-bulkPricing', $scope),
        };
    }

    function showMessageBox(message) {
        const $messageBox = $('.productAttributes-message');

        if (message) {
            $('.alertBox-message', $messageBox).text(message);
            $messageBox.show();
        } else {
            $messageBox.hide();
        }
    }

    function clearPricingNotFound(viewModel) {
        viewModel.rrpWithTax.$div.hide();
        viewModel.rrpWithoutTax.$div.hide();
        viewModel.nonSaleWithTax.$div.hide();
        viewModel.nonSaleWithoutTax.$div.hide();
        viewModel.priceSaved.$div.hide();
        viewModel.priceNowLabel.$span.hide();
        viewModel.priceLabel.$span.hide();
    }
    
    function updatePriceView(viewModel, price) {
        clearPricingNotFound(viewModel);

        if (price.with_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithTax.html(price.with_tax.formatted);
        }

        if (price.without_tax) {
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithoutTax.html(price.without_tax.formatted);
        }

        if (price.rrp_with_tax) {
            viewModel.rrpWithTax.$div.show();
            viewModel.rrpWithTax.$span.html(price.rrp_with_tax.formatted);
        }

        if (price.rrp_without_tax) {
            viewModel.rrpWithoutTax.$div.show();
            viewModel.rrpWithoutTax.$span.html(price.rrp_without_tax.formatted);
        }

        if (price.saved) {
            viewModel.priceSaved.$div.show();
            viewModel.priceSaved.$span.html(price.saved.formatted);
        }

        if (price.non_sale_price_with_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithTax.$span.html(price.non_sale_price_with_tax.formatted);
        }

        if (price.non_sale_price_without_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithoutTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithoutTax.$span.html(price.non_sale_price_without_tax.formatted);
        }
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
}
