webpackJsonp([0],{

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_foundation_sites_js_foundation_foundation__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_foundation_sites_js_foundation_foundation___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_foundation_sites_js_foundation_foundation__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_foundation_sites_js_foundation_foundation_reveal__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_foundation_sites_js_foundation_foundation_reveal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_foundation_sites_js_foundation_foundation_reveal__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_nod__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__page_manager__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__bigcommerce_stencil_utils__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__global_modal__ = __webpack_require__(26);
function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var WishList=function(_PageManager){_inherits(WishList,_PageManager);function WishList(){_classCallCheck(this,WishList);var _this=_possibleConstructorReturn(this,_PageManager.call(this));_this.options={template:'account/add-wishlist'};return _this}/**
     * Creates a confirm box before deleting all wish lists
     */WishList.prototype.wishlistDeleteConfirm=function wishlistDeleteConfirm(){var _this2=this;__WEBPACK_IMPORTED_MODULE_0_jquery___default()('body').on('click','[data-wishlist-delete]',function(event){var confirmed=confirm(_this2.context.wishlistDelete);if(confirmed){return true}event.preventDefault()})};WishList.prototype.registerAddWishListValidation=function registerAddWishListValidation($addWishlistForm){var _this3=this;this.addWishlistValidator=__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__common_nod__["a" /* default */])({submit:'.wishlist-form input[type="submit"]'});this.addWishlistValidator.add([{selector:'.wishlist-form input[name="wishlistname"]',validate:function validate(cb,val){var result=val.length>0;cb(result)},errorMessage:'You must enter a wishlist name.'}]);$addWishlistForm.submit(function(event){_this3.addWishlistValidator.performCheck();if(_this3.addWishlistValidator.areAll('valid')){return}event.preventDefault()})};WishList.prototype.wishListHandler=function wishListHandler(){var _this4=this;__WEBPACK_IMPORTED_MODULE_0_jquery___default()('body').on('click','[data-wishlist]',function(event){var wishListUrl=event.currentTarget.href;var modal=__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__global_modal__["a" /* defaultModal */])();event.preventDefault();modal.open();__WEBPACK_IMPORTED_MODULE_5__bigcommerce_stencil_utils__["a" /* api */].getPage(wishListUrl,_this4.options,function(err,content){if(err){return modal.updateContent(err)}modal.updateContent(content,{wrap:true});var $wishlistForm=__WEBPACK_IMPORTED_MODULE_0_jquery___default()('.wishlist-form',modal.$content);_this4.registerAddWishListValidation($wishlistForm)})})};WishList.prototype.loaded=function loaded(next){var $addWishListForm=__WEBPACK_IMPORTED_MODULE_0_jquery___default()('.wishlist-form');if($addWishListForm.length){this.registerAddWishListValidation($addWishListForm)}this.wishlistDeleteConfirm();this.wishListHandler();next()};return WishList}(__WEBPACK_IMPORTED_MODULE_4__page_manager__["a" /* default */]);/* harmony default export */ __webpack_exports__["default"] = (WishList);

/***/ })

});
//# sourceMappingURL=theme-bundle.chunk.0.js.map