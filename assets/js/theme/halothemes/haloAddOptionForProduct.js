import utils from '@bigcommerce/stencil-utils';
const fetch = require('node-fetch');

export default function(context) {
    if (context.themeSettings.haloAddOptionForProduct) {
        
        var  list = [];
        const $card = $('.card');
        const token = context.token;

        if ($card.length) {
            for (var i=0; i < $card.length; i++) {
                const $prodWrapId = $card.eq(i).data('product-id');
                const $cartOption = $card.eq(i).find('.card-option').length;
                const $cartOptionItem = $card.eq(i).find('.card-option .form-field label').length;

                if ($prodWrapId != undefined && $cartOption && !$cartOptionItem) {
                    list.push($prodWrapId.toString());
                }
            };
        }

        callProductOption();

        function callProductOption() {

            if(list.length > 0){
                getProductOption(list).then(data => {
                    renderOption(data);

                    for (var i=0; i < $card.length; i++) {
                        const $t_card = $card.eq(i);
                        const productId = $card.eq(i).data('product-id');
                        const $t_cardOption = $card.eq(i).find('.card-option-'+productId+'');
                        const $t_formOption = $card.eq(i).find('.card-option-'+productId+' .form-option-swatch');

                        if ($t_formOption.length > 4) {
                            var countMoreOption  = $t_formOption.length - 4,
                                productLink = $card.eq(i).find('.prod-name a').attr('href');

                            $t_cardOption.find('.form-option-swatch:nth-child(n+5)').remove();

                            if($t_cardOption.find('.form-field .showmore').length == 0){
                                $t_cardOption.find('.form-field').append('<a href="'+productLink+'" class="showmore">+'+countMoreOption+'</a>');
                            }
                        }
                    }
                });
            }
        }

        function getProductOption(list){
            return fetch('/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                  query: `
                    query SeveralProductsByID {
                      site {
                        products(entityIds: [`+list+`], first: 50) {
                          edges {
                            node {
                              entityId
                              name
                               productOptions(first: 50) {
                                edges {
                                  node {
                                    entityId
                                    displayName
                                    isRequired
                                    ... on MultipleChoiceOption {
                                      displayStyle
                                      values {
                                        edges {
                                          node {
                                            entityId
                                            label
                                            isDefault
                                            ... on SwatchOptionValue {
                                              hexColors
                                              imageUrl(width: 50)
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  `}),
            }).then(res => res.json()).then(res => res.data);
        }

        function renderOption(data){
            var aFilter = data.site.products.edges;

            $.each(aFilter, (index, element) => {
                var productId = aFilter[index].node.entityId,
                    productFieldColor = $card.find('.card-option-'+productId+' .form-field'),
                    aFilter2 = aFilter[index].node.productOptions.edges;

                var aFilter3 = aFilter2.filter(function (item) {
                    return item.node.displayStyle === 'Swatch';
                });

                if(aFilter3.length > 0){
                    var aFilter4 = aFilter3[0].node.values.edges;

                    $.each(aFilter4, (idx, element) => {
                        var titleVar = aFilter4[idx].node.label,
                            idVar = aFilter4[idx].node.entityId,
                            lengthColorVar = aFilter4[idx].node.hexColors.length,
                            color1 = aFilter4[idx].node.hexColors[0],
                            color2 = aFilter4[idx].node.hexColors[1],
                            color3 = aFilter4[idx].node.hexColors[2],
                            img = aFilter4[idx].node.imageUrl;

                        if(lengthColorVar == 2){
                            productFieldColor.append('<label class="form-option form-option-swatch" data-product-swatch-value="'+idVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color form-option-variant--color2" title="'+titleVar+'"><span style="background-color:'+color1+'"></span><span style="background-color:'+color2+'"></span></span></label>');
                        } else if(lengthColorVar === 3){
                            productFieldColor.append('<label class="form-option form-option-swatch" data-product-swatch-value="'+idVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color form-option-variant--color2" title="'+titleVar+'"><span style="background-color:'+color1+'"></span><span style="background-color:'+color2+'"></span><span style="background-color:'+color3+'"></span></span></label>');
                        } else if(Boolean(color1)){
                            productFieldColor.append('<label class="form-option form-option-swatch" data-product-swatch-value="'+idVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--color" title="'+titleVar+'" style="background-color: '+color1+'"></span></label>');
                        } else if(Boolean(img)){
                            productFieldColor.append('<label class="form-option form-option-swatch" data-product-swatch-value="'+idVar+'"><span class="form-option-tooltip">'+titleVar+'</span><span class="form-option-variant form-option-variant--pattern" title="'+titleVar+'" style="background-image: url('+img+')"></span></label>');
                        }
                    });
                } else{
                    productFieldColor.remove();
                }
            });
        }
    }
}
