"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_assets_boat_boat_module_ts"],{

/***/ 56341:
/*!********************************************!*\
  !*** ./src/app/assets/boat/boat.module.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BoatModule: () => (/* binding */ BoatModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../layout/layout.module */ 48177);
/* harmony import */ var _boat_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./boat-routing.module */ 85012);






/** Lazy-loaded GoDirect feature boundary for boat assets. */
let BoatModule = class BoatModule {};
BoatModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__.LayoutModule, _boat_routing_module__WEBPACK_IMPORTED_MODULE_2__.BoatRoutingModule]
})], BoatModule);


/***/ }),

/***/ 85012:
/*!****************************************************!*\
  !*** ./src/app/assets/boat/boat-routing.module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BoatRoutingModule: () => (/* binding */ BoatRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _services_listing_publication_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/listing-publication.guard */ 60087);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _layout_home_homelayout_homelayout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../layout/home/homelayout/homelayout.component */ 14211);






const routes = [{
  path: ':assetId',
  component: _layout_home_homelayout_homelayout_component__WEBPACK_IMPORTED_MODULE_2__.HomelayoutComponent,
  canActivateChild: [_services_listing_publication_guard__WEBPACK_IMPORTED_MODULE_1__.ListingPublicationGuard],
  children: [{
    path: '',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_services_owner-customers-text_ts"), __webpack_require__.e("default-src_app_home_home_module_ts"), __webpack_require__.e("common")]).then(__webpack_require__.bind(__webpack_require__, /*! ../../home/home.module */ 45055)).then(m => m.HomeModule)
  }, {
    path: '',
    loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_login_login_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../../login/login.module */ 91307)).then(m => m.LoginModule)
  }]
}];
let BoatRoutingModule = class BoatRoutingModule {};
BoatRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule.forChild(routes)],
  exports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule]
})], BoatRoutingModule);


/***/ })

}]);
//# sourceMappingURL=src_app_assets_boat_boat_module_ts.js.map