(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_assets_pool_pool_module_ts"],{

/***/ 18517:
/*!********************************************!*\
  !*** ./src/app/assets/pool/pool.module.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PoolModule: () => (/* binding */ PoolModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../layout/layout.module */ 48177);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ 93887);
/* harmony import */ var _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/resource-route.pipe */ 19337);
/* harmony import */ var _pool_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pool-routing.module */ 35732);
/* harmony import */ var _pages_home_pool_home_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/home/pool-home.component */ 85679);
/* harmony import */ var _pages_details_pool_details_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/details/pool-details.component */ 82599);










let PoolModule = class PoolModule {};
PoolModule = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.NgModule)({
  declarations: [_pages_home_pool_home_component__WEBPACK_IMPORTED_MODULE_5__.PoolHomeComponent, _pages_details_pool_details_component__WEBPACK_IMPORTED_MODULE_6__.PoolDetailsComponent],
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__.LayoutModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__.SharedModule, _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_3__.ResourceRoutePipe, _pool_routing_module__WEBPACK_IMPORTED_MODULE_4__.PoolRoutingModule]
})], PoolModule);


/***/ }),

/***/ 32721:
/*!**********************************************************************************!*\
  !*** ./src/app/assets/pool/pages/details/pool-details.component.scss?ngResource ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
  background: #f8f6f1;
  color: #17202a;
  min-height: calc(100vh - 120px);
}

.asset-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 42px 24px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.9fr);
  gap: 42px;
  align-items: start;
  background: transparent !important;
  background-image: none !important;
  color: #17202a;
}

.asset-page app-asset-gallery {
  display: block;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.copy {
  position: relative;
  z-index: 2;
  background: #fff;
  color: #17202a;
  border: 1px solid #e6e2da;
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(23, 32, 42, 0.06);
}

.eyebrow {
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: #49606c;
}

h1 {
  margin: 10px 0 8px;
  font-size: clamp(2rem, 3.5vw, 3rem);
  line-height: 1.05;
}

.headline {
  font-size: 1.18rem;
  line-height: 1.45;
  margin: 0 0 12px;
}

.copy > p:not(.headline) {
  color: #55636c;
  line-height: 1.55;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin: 22px 0;
}

.facts span {
  padding: 9px 11px;
  border: 1px solid #ddd8cf;
  border-radius: 9px;
  background: #faf9f6;
}

.price {
  margin: 22px 0;
  font-size: 1rem;
}

.price strong {
  display: inline-block;
  margin-left: 4px;
  font-size: 1.55rem;
  color: #102f40;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions a {
  padding: 12px 18px;
  border: 1px solid #aeb8bd;
  border-radius: 9px;
  text-decoration: none;
  color: #0b5bd3;
  background: #fff;
  font-weight: 650;
}

.actions .primary {
  background: #0b5bd3;
  border-color: #0b5bd3;
  color: #fff;
}

.loading {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px;
}

@media (max-width: 800px) {
  .asset-page {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 16px 40px;
  }
  .copy {
    padding: 22px;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/assets/pool/pages/details/pool-details.component.scss"],"names":[],"mappings":"AACA;EACE,cAAA;EACA,mBAAA;EACA,cAAA;EACA,+BAAA;AAAF;;AAGA;EACE,iBAAA;EACA,cAAA;EACA,uBAAA;EACA,aAAA;EACA,4DAAA;EACA,SAAA;EACA,kBAAA;EACA,kCAAA;EACA,iCAAA;EACA,cAAA;AAAF;;AAGA;EACE,cAAA;EACA,YAAA;EACA,kBAAA;EACA,UAAA;AAAF;;AAGA;EACE,kBAAA;EACA,UAAA;EACA,gBAAA;EACA,cAAA;EACA,yBAAA;EACA,mBAAA;EACA,aAAA;EACA,8CAAA;AAAF;;AAGA;EAAW,yBAAA;EAA2B,gBAAA;EAAkB,kBAAA;EAAmB,sBAAA;EAAuB,cAAA;AAKlG;;AAJA;EAAK,kBAAA;EAAoB,mCAAA;EAAqC,iBAAA;AAU9D;;AATA;EAAY,kBAAA;EAAoB,iBAAA;EAAmB,gBAAA;AAenD;;AAdA;EAA2B,cAAA;EAAgB,iBAAA;AAmB3C;;AAlBA;EAAS,aAAA;EAAe,eAAA;EAAiB,QAAA;EAAU,cAAA;AAyBnD;;AAxBA;EAAc,iBAAA;EAAmB,yBAAA;EAA2B,kBAAA;EAAoB,mBAAA;AA+BhF;;AA9BA;EAAS,cAAA;EAAgB,eAAA;AAmCzB;;AAlCA;EAAgB,qBAAA;EAAuB,gBAAA;EAAkB,kBAAA;EAAoB,cAAA;AAyC7E;;AAxCA;EAAW,aAAA;EAAe,SAAA;EAAW,eAAA;AA8CrC;;AA7CA;EAAa,kBAAA;EAAoB,yBAAA;EAA2B,kBAAA;EAAoB,qBAAA;EAAuB,cAAA;EAAgB,gBAAA;EAAkB,gBAAA;AAuDzI;;AAtDA;EAAoB,mBAAA;EAAqB,qBAAA;EAAuB,WAAA;AA4DhE;;AA3DA;EAAW,iBAAA;EAAmB,cAAA;EAAgB,kBAAA;AAiE9C;;AA/DA;EACE;IAAc,0BAAA;IAA4B,SAAA;IAAW,uBAAA;EAqErD;EApEA;IAAQ,aAAA;EAuER;AACF","sourcesContent":["\n:host {\n  display: block;\n  background: #f8f6f1;\n  color: #17202a;\n  min-height: calc(100vh - 120px);\n}\n\n.asset-page {\n  max-width: 1120px;\n  margin: 0 auto;\n  padding: 42px 24px 56px;\n  display: grid;\n  grid-template-columns: minmax(0, 1.2fr) minmax(320px, .9fr);\n  gap: 42px;\n  align-items: start;\n  background: transparent !important;\n  background-image: none !important;\n  color: #17202a;\n}\n\n.asset-page app-asset-gallery {\n  display: block;\n  min-width: 0;\n  position: relative;\n  z-index: 1;\n}\n\n.copy {\n  position: relative;\n  z-index: 2;\n  background: #fff;\n  color: #17202a;\n  border: 1px solid #e6e2da;\n  border-radius: 18px;\n  padding: 30px;\n  box-shadow: 0 10px 30px rgba(23,32,42,.06);\n}\n\n.eyebrow { text-transform: uppercase; font-weight: 800; font-size: .78rem; letter-spacing: .06em; color: #49606c; }\nh1 { margin: 10px 0 8px; font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.05; }\n.headline { font-size: 1.18rem; line-height: 1.45; margin: 0 0 12px; }\n.copy > p:not(.headline) { color: #55636c; line-height: 1.55; }\n.facts { display: flex; flex-wrap: wrap; gap: 9px; margin: 22px 0; }\n.facts span { padding: 9px 11px; border: 1px solid #ddd8cf; border-radius: 9px; background: #faf9f6; }\n.price { margin: 22px 0; font-size: 1rem; }\n.price strong { display: inline-block; margin-left: 4px; font-size: 1.55rem; color: #102f40; }\n.actions { display: flex; gap: 10px; flex-wrap: wrap; }\n.actions a { padding: 12px 18px; border: 1px solid #aeb8bd; border-radius: 9px; text-decoration: none; color: #0b5bd3; background: #fff; font-weight: 650; }\n.actions .primary { background: #0b5bd3; border-color: #0b5bd3; color: #fff; }\n.loading { max-width: 1120px; margin: 0 auto; padding: 48px 24px; }\n\n@media (max-width: 800px) {\n  .asset-page { grid-template-columns: 1fr; gap: 24px; padding: 24px 16px 40px; }\n  .copy { padding: 22px; }\n}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 35732:
/*!****************************************************!*\
  !*** ./src/app/assets/pool/pool-routing.module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PoolRoutingModule: () => (/* binding */ PoolRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _services_listing_publication_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/listing-publication.guard */ 60087);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _layout_home_homelayout_homelayout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../layout/home/homelayout/homelayout.component */ 14211);
/* harmony import */ var _pages_home_pool_home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/home/pool-home.component */ 85679);
/* harmony import */ var _pages_details_pool_details_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/details/pool-details.component */ 82599);








const routes = [{
  path: ':assetId',
  component: _layout_home_homelayout_homelayout_component__WEBPACK_IMPORTED_MODULE_2__.HomelayoutComponent,
  canActivateChild: [_services_listing_publication_guard__WEBPACK_IMPORTED_MODULE_1__.ListingPublicationGuard],
  children: [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, {
    path: 'home',
    component: _pages_home_pool_home_component__WEBPACK_IMPORTED_MODULE_3__.PoolHomeComponent
  }, {
    path: 'details',
    component: _pages_details_pool_details_component__WEBPACK_IMPORTED_MODULE_4__.PoolDetailsComponent
  }, {
    path: 'asset',
    component: _pages_details_pool_details_component__WEBPACK_IMPORTED_MODULE_4__.PoolDetailsComponent
  }, {
    path: '',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_services_owner-customers-text_ts"), __webpack_require__.e("default-src_app_home_home_module_ts"), __webpack_require__.e("common")]).then(__webpack_require__.bind(__webpack_require__, /*! ../../home/home.module */ 45055)).then(m => m.HomeModule)
  }, {
    path: '',
    loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_login_login_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../../login/login.module */ 91307)).then(m => m.LoginModule)
  }]
}];
let PoolRoutingModule = class PoolRoutingModule {};
PoolRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.NgModule)({
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule.forChild(routes)],
  exports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule]
})], PoolRoutingModule);


/***/ }),

/***/ 35785:
/*!****************************************************************************!*\
  !*** ./src/app/assets/pool/pages/home/pool-home.component.scss?ngResource ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
  background: #f8f6f1;
  color: #17202a;
  min-height: calc(100vh - 120px);
}

.asset-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 42px 24px 56px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.9fr);
  gap: 42px;
  align-items: start;
  background: transparent !important;
  background-image: none !important;
  color: #17202a;
}

.asset-page app-asset-gallery {
  display: block;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.copy {
  position: relative;
  z-index: 2;
  background: #fff;
  color: #17202a;
  border: 1px solid #e6e2da;
  border-radius: 18px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(23, 32, 42, 0.06);
}

.eyebrow {
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: #49606c;
}

h1 {
  margin: 10px 0 8px;
  font-size: clamp(2rem, 3.5vw, 3rem);
  line-height: 1.05;
}

.headline {
  font-size: 1.18rem;
  line-height: 1.45;
  margin: 0 0 12px;
}

.copy > p:not(.headline) {
  color: #55636c;
  line-height: 1.55;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin: 22px 0;
}

.facts span {
  padding: 9px 11px;
  border: 1px solid #ddd8cf;
  border-radius: 9px;
  background: #faf9f6;
}

.price {
  margin: 22px 0;
  font-size: 1rem;
}

.price strong {
  display: inline-block;
  margin-left: 4px;
  font-size: 1.55rem;
  color: #102f40;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.actions a {
  padding: 12px 18px;
  border: 1px solid #aeb8bd;
  border-radius: 9px;
  text-decoration: none;
  color: #0b5bd3;
  background: #fff;
  font-weight: 650;
}

.actions .primary {
  background: #0b5bd3;
  border-color: #0b5bd3;
  color: #fff;
}

.loading {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px;
}

@media (max-width: 800px) {
  .asset-page {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 24px 16px 40px;
  }
  .copy {
    padding: 22px;
  }
}
.management-home {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 64px;
  color: #173344;
}

.management-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
}

.management-heading h1 {
  font-size: 2rem;
  margin: 8px 0;
}

.management-heading h2 {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
  color: #526773;
}

.management-heading p {
  color: #647580;
  margin: 12px 0 0;
  max-width: 580px;
}

.management-primary, .management-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.93rem;
  font-weight: 700;
  cursor: pointer;
}

.management-primary {
  background: #153b4b;
  color: #fff;
  border: 1px solid #153b4b;
  flex-shrink: 0;
}

.management-secondary {
  border: 1px solid #d9e1e5;
  color: #214655;
  background: #fff;
  padding: 9px 12px;
}

.management-secondary:disabled {
  opacity: 0.5;
  cursor: wait;
}

.management-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.management-metrics button {
  background: #fff;
  border: 1px solid #e3e7e8;
  border-radius: 14px;
  text-align: left;
  padding: 20px;
  cursor: pointer;
  color: inherit;
  box-shadow: 0 4px 14px rgba(20, 49, 63, 0.025);
}

.management-metrics button span {
  display: block;
  font-size: 0.86rem;
  color: #637782;
  min-height: 36px;
}

.management-metrics strong {
  display: block;
  font-size: 2rem;
  margin-top: 8px;
  line-height: 1;
}

.management-metrics button:hover {
  border-color: #7e9ca8;
}

.management-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 285px;
  gap: 22px;
  align-items: start;
}

.management-panel {
  background: #fff;
  border: 1px solid #e3e7e8;
  border-radius: 16px;
  padding: 24px;
  min-width: 0;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.management-panel h2 {
  font-size: 1.25rem;
  margin: 0;
}

.management-panel h3 {
  font-size: 1.05rem;
  margin: 12px 0;
}

.management-sidebar {
  display: grid;
  gap: 20px;
}

.management-sidebar p {
  line-height: 1.55;
}

.arrival-panel {
  border-top: 3px solid #d8a455;
}

.arrival-panel .eyebrow {
  font-size: 0.69rem;
}

.booking-filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin: 22px 0;
}

.filter-tabs {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.filter-tabs button {
  border: 0;
  border-radius: 7px;
  padding: 9px 10px;
  background: #f3f5f6;
  color: #586e79;
  font-size: 0.83rem;
  cursor: pointer;
}

.filter-tabs button.selected {
  background: #e4eff3;
  color: #123a4c;
  font-weight: 700;
}

.booking-filters input {
  border: 1px solid #dce3e6;
  border-radius: 8px;
  padding: 10px 12px;
  min-width: 160px;
  flex: 1;
  max-width: 300px;
  font-size: 0.84rem;
}

.booking-table-wrap {
  overflow-x: auto;
}

.management-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.84rem;
}

.management-table th {
  text-align: left;
  font-size: 0.74rem;
  font-weight: 600;
  color: #6b7f89;
  padding: 10px 10px 14px 0;
  border-bottom: 1px solid #e4eaed;
}

.management-table td {
  padding: 17px 12px 17px 0;
  border-bottom: 1px solid #edf0f1;
  vertical-align: middle;
}

.management-table small {
  display: block;
  color: #6d7d85;
  margin-top: 5px;
  overflow-wrap: anywhere;
}

.management-status {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 7px;
  background: #fff3dc;
  color: #79551c;
  font-size: 0.75rem;
  white-space: nowrap;
}

.management-status.confirmed {
  background: #e7f4ec;
  color: #26613d;
}

.management-text-link {
  color: #20546b;
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
}

.management-all-link {
  display: inline-block;
  color: #20546b;
  font-weight: 700;
  font-size: 0.88rem;
  text-decoration: none;
  margin-top: 22px;
}

.management-hint {
  color: #697a83;
  font-size: 0.86rem;
  line-height: 1.55;
}

.management-error {
  padding: 12px;
  background: #fff0ec;
  color: #923b2c;
  border-radius: 8px;
}

.management-empty {
  padding: 28px 0;
  color: #6c7c85;
}

.management-quick-link {
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: #254b60;
  font-size: 0.88rem;
  padding: 13px 0;
  border-top: 1px solid #edf0f1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.management-home a:focus-visible, .management-home button:focus-visible, .management-home input:focus-visible {
  outline: 3px solid #3487ad;
  outline-offset: 3px;
}

@media (max-width: 1050px) {
  .management-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .management-sidebar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .management-heading {
    align-items: flex-start;
  }
  .management-primary {
    max-width: 260px;
    text-align: center;
  }
}
@media (max-width: 640px) {
  .management-home {
    padding: 24px 16px 40px;
  }
  .management-heading {
    flex-direction: column;
    gap: 18px;
  }
  .management-primary {
    max-width: none;
    width: 100%;
  }
  .management-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .management-metrics button {
    padding: 15px;
  }
  .management-metrics strong {
    font-size: 1.7rem;
  }
  .management-panel {
    padding: 18px;
  }
  .management-sidebar {
    grid-template-columns: 1fr;
  }
  .booking-filters input {
    max-width: none;
    width: 100%;
  }
  .management-table {
    min-width: 590px;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/assets/pool/pages/home/pool-home.component.scss"],"names":[],"mappings":"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","sourcesContent":["\n:host {\n  display: block;\n  background: #f8f6f1;\n  color: #17202a;\n  min-height: calc(100vh - 120px);\n}\n\n.asset-page {\n  max-width: 1120px;\n  margin: 0 auto;\n  padding: 42px 24px 56px;\n  display: grid;\n  grid-template-columns: minmax(0, 1.2fr) minmax(320px, .9fr);\n  gap: 42px;\n  align-items: start;\n  background: transparent !important;\n  background-image: none !important;\n  color: #17202a;\n}\n\n.asset-page app-asset-gallery {\n  display: block;\n  min-width: 0;\n  position: relative;\n  z-index: 1;\n}\n\n.copy {\n  position: relative;\n  z-index: 2;\n  background: #fff;\n  color: #17202a;\n  border: 1px solid #e6e2da;\n  border-radius: 18px;\n  padding: 30px;\n  box-shadow: 0 10px 30px rgba(23,32,42,.06);\n}\n\n.eyebrow { text-transform: uppercase; font-weight: 800; font-size: .78rem; letter-spacing: .06em; color: #49606c; }\nh1 { margin: 10px 0 8px; font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.05; }\n.headline { font-size: 1.18rem; line-height: 1.45; margin: 0 0 12px; }\n.copy > p:not(.headline) { color: #55636c; line-height: 1.55; }\n.facts { display: flex; flex-wrap: wrap; gap: 9px; margin: 22px 0; }\n.facts span { padding: 9px 11px; border: 1px solid #ddd8cf; border-radius: 9px; background: #faf9f6; }\n.price { margin: 22px 0; font-size: 1rem; }\n.price strong { display: inline-block; margin-left: 4px; font-size: 1.55rem; color: #102f40; }\n.actions { display: flex; gap: 10px; flex-wrap: wrap; }\n.actions a { padding: 12px 18px; border: 1px solid #aeb8bd; border-radius: 9px; text-decoration: none; color: #0b5bd3; background: #fff; font-weight: 650; }\n.actions .primary { background: #0b5bd3; border-color: #0b5bd3; color: #fff; }\n.loading { max-width: 1120px; margin: 0 auto; padding: 48px 24px; }\n\n@media (max-width: 800px) {\n  .asset-page { grid-template-columns: 1fr; gap: 24px; padding: 24px 16px 40px; }\n  .copy { padding: 22px; }\n}\n\n.management-home{max-width:1280px;margin:0 auto;padding:40px 24px 64px;color:#173344}\n.management-heading{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:28px}.management-heading h1{font-size:2rem;margin:8px 0}.management-heading h2{font-size:1.05rem;font-weight:600;margin:0;color:#526773}.management-heading p{color:#647580;margin:12px 0 0;max-width:580px}\n.management-primary,.management-secondary{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:10px;text-decoration:none;font-size:.93rem;font-weight:700;cursor:pointer}.management-primary{background:#153b4b;color:#fff;border:1px solid #153b4b;flex-shrink:0}.management-secondary{border:1px solid #d9e1e5;color:#214655;background:#fff;padding:9px 12px}.management-secondary:disabled{opacity:.5;cursor:wait}\n.management-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:24px}.management-metrics button{background:#fff;border:1px solid #e3e7e8;border-radius:14px;text-align:left;padding:20px;cursor:pointer;color:inherit;box-shadow:0 4px 14px rgba(20,49,63,.025)}.management-metrics button span{display:block;font-size:.86rem;color:#637782;min-height:36px}.management-metrics strong{display:block;font-size:2rem;margin-top:8px;line-height:1}.management-metrics button:hover{border-color:#7e9ca8}\n.management-layout{display:grid;grid-template-columns:minmax(0,1fr) 285px;gap:22px;align-items:start}.management-panel{background:#fff;border:1px solid #e3e7e8;border-radius:16px;padding:24px;min-width:0}.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.management-panel h2{font-size:1.25rem;margin:0}.management-panel h3{font-size:1.05rem;margin:12px 0}.management-sidebar{display:grid;gap:20px}.management-sidebar p{line-height:1.55}.arrival-panel{border-top:3px solid #d8a455}.arrival-panel .eyebrow{font-size:.69rem}.booking-filters{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:22px 0}.filter-tabs{display:flex;gap:3px;flex-wrap:wrap}.filter-tabs button{border:0;border-radius:7px;padding:9px 10px;background:#f3f5f6;color:#586e79;font-size:.83rem;cursor:pointer}.filter-tabs button.selected{background:#e4eff3;color:#123a4c;font-weight:700}.booking-filters input{border:1px solid #dce3e6;border-radius:8px;padding:10px 12px;min-width:160px;flex:1;max-width:300px;font-size:.84rem}.booking-table-wrap{overflow-x:auto}.management-table{border-collapse:collapse;width:100%;font-size:.84rem}.management-table th{text-align:left;font-size:.74rem;font-weight:600;color:#6b7f89;padding:10px 10px 14px 0;border-bottom:1px solid #e4eaed}.management-table td{padding:17px 12px 17px 0;border-bottom:1px solid #edf0f1;vertical-align:middle}.management-table small{display:block;color:#6d7d85;margin-top:5px;overflow-wrap:anywhere}.management-status{display:inline-block;padding:6px 9px;border-radius:7px;background:#fff3dc;color:#79551c;font-size:.75rem;white-space:nowrap}.management-status.confirmed{background:#e7f4ec;color:#26613d}.management-text-link{color:#20546b;text-decoration:none;font-weight:700;white-space:nowrap}.management-all-link{display:inline-block;color:#20546b;font-weight:700;font-size:.88rem;text-decoration:none;margin-top:22px}.management-hint{color:#697a83;font-size:.86rem;line-height:1.55}.management-error{padding:12px;background:#fff0ec;color:#923b2c;border-radius:8px}.management-empty{padding:28px 0;color:#6c7c85}.management-quick-link{display:flex;justify-content:space-between;text-decoration:none;color:#254b60;font-size:.88rem;padding:13px 0;border-top:1px solid #edf0f1}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}\n.management-home a:focus-visible,.management-home button:focus-visible,.management-home input:focus-visible{outline:3px solid #3487ad;outline-offset:3px}\n@media(max-width:1050px){.management-layout{grid-template-columns:minmax(0,1fr)}.management-sidebar{grid-template-columns:repeat(2,minmax(0,1fr))}.management-heading{align-items:flex-start}.management-primary{max-width:260px;text-align:center}}\n@media(max-width:640px){.management-home{padding:24px 16px 40px}.management-heading{flex-direction:column;gap:18px}.management-primary{max-width:none;width:100%}.management-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.management-metrics button{padding:15px}.management-metrics strong{font-size:1.7rem}.management-panel{padding:18px}.management-sidebar{grid-template-columns:1fr}.booking-filters input{max-width:none;width:100%}.management-table{min-width:590px}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 46461:
/*!**********************************************************************************!*\
  !*** ./src/app/assets/pool/pages/details/pool-details.component.html?ngResource ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<ng-container *ngIf=\"asset; else loading\"><section class=\"asset-page\"><div><span class=\"eyebrow\">{{eyebrow}}</span><h1>{{asset.name}}</h1><p class=\"asset-location\" *ngIf=\"asset.location?.city\">{{asset.location.area ? asset.location.area+' · ':''}}{{asset.location.city}} · {{asset.location.country}}</p><p class=\"headline\">{{asset.headline}}</p><p>{{asset.description}}</p><div class=\"facts\"><span *ngFor=\"let fact of facts\">{{fact}}</span></div><h2>{{ \"ui.pages.t54937b3a4f8c\" | siteText }}</h2><p *ngIf=\"kind==='property'\">{{ \"ui.pages.ta34e8d43ee54\" | siteText }} {{p.checkIn}} {{ \"ui.pages.tfad4d8488bf9\" | siteText }} {{p.checkOut}} {{ \"ui.pages.t1020b31d2adf\" | siteText }} {{p.guests}} {{ \"ui.pages.t2e831b75804a\" | siteText }}</p><p *ngIf=\"kind==='parking'\">{{ \"ui.pages.tee8105f79141\" | siteText }} {{p.accessMethod}} {{ \"ui.pages.te593e602ca6b\" | siteText }} {{p.heightLimitM}} m.</p><p *ngIf=\"kind==='pool'\">{{ \"ui.pages.t42f9f15e9931\" | siteText }} {{p.heated?('ui.messages.t52e345f248d7' | siteText):('ui.messages.t97a9b88922a0' | siteText)}}{{ \"ui.pages.tbc4fa3a029ff\" | siteText }} {{p.capacity}} {{ \"ui.pages.t9a812f4619cb\" | siteText }}</p><div class=\"actions\"><a class=\"primary\" [routerLink]=\"'/reserver' | resourceRoute\" queryParamsHandling=\"preserve\">{{ \"ui.pages.t254b0ae17097\" | siteText }}</a><a [routerLink]=\"'/home' | resourceRoute\" queryParamsHandling=\"preserve\">{{ \"ui.pages.tff2427ab208f\" | siteText }}</a></div></div><app-asset-gallery [images]=\"images\" [title]=\"asset.name\"></app-asset-gallery></section></ng-container><ng-template #loading><div class=\"loading\">{{error || ('ui.pages.t01cba1dfba2e' | siteText)}}</div></ng-template>";

/***/ }),

/***/ 59701:
/*!****************************************************************************!*\
  !*** ./src/app/assets/pool/pages/home/pool-home.component.html?ngResource ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<ng-container *ngIf=\"asset; else loading\">\n  <main *ngIf=\"showAdmin; else customerHome\" class=\"management-home\">\n    <header class=\"management-heading\">\n      <div><span class=\"eyebrow\">{{adminT('eyebrow')}}</span><h1>{{asset.name}}</h1><p class=\"asset-location\" *ngIf=\"asset.location?.city\">{{asset.location.area ? asset.location.area+' · ':''}}{{asset.location.city}} · {{asset.location.country}}</p><h2>{{adminT('title')}}</h2><p>{{adminT('intro')}}</p></div>\n      <a class=\"management-primary\" [routerLink]=\"'/admin/reservations' | resourceRoute\" [queryParams]=\"{create:'1'}\">+ {{adminT('newBooking')}}</a>\n    </header>\n    <nav class=\"management-metrics\" [attr.aria-label]=\"'ui.pages.t8558c2442478' | siteText\">\n      <button type=\"button\" (click)=\"filter='upcoming'\"><span>{{adminT('upcoming')}}</span><strong>{{dashboardLoaded?upcomingBookings.length:'—'}}</strong></button>\n      <button type=\"button\" (click)=\"filter='attention'\"><span>{{adminT('approvals')}}</span><strong>{{dashboardLoaded?approvalCount:'—'}}</strong></button>\n      <button type=\"button\" (click)=\"filter='attention'\"><span>{{adminT('payments')}}</span><strong>{{dashboardLoaded?paymentCount:'—'}}</strong></button>\n      <button type=\"button\" (click)=\"filter='attention'\"><span>{{adminT('cancellations')}}</span><strong>{{dashboardLoaded?cancellationCount:'—'}}</strong></button>\n    </nav>\n    <div class=\"management-layout\">\n      <section class=\"management-panel bookings-panel\" [attr.aria-busy]=\"dashboardLoading\">\n        <div class=\"panel-heading\"><h2>{{adminT('bookingList')}}</h2><button type=\"button\" class=\"management-secondary\" (click)=\"refreshDashboard()\" [disabled]=\"dashboardLoading\">{{adminT('refresh')}}</button></div>\n        <div class=\"booking-filters\"><div class=\"filter-tabs\" role=\"group\" [attr.aria-label]=\"adminT('bookingList')\"><button type=\"button\" [class.selected]=\"filter==='upcoming'\" [attr.aria-pressed]=\"filter==='upcoming'\" (click)=\"filter='upcoming'\">{{adminT('upcoming')}}</button><button type=\"button\" [class.selected]=\"filter==='attention'\" [attr.aria-pressed]=\"filter==='attention'\" (click)=\"filter='attention'\">{{adminT('attention')}}</button><button type=\"button\" [class.selected]=\"filter==='all'\" [attr.aria-pressed]=\"filter==='all'\" (click)=\"filter='all'\">{{adminT('all')}}</button></div><input type=\"search\" [value]=\"search\" (input)=\"onSearch($event)\" [placeholder]=\"adminT('search')\" [attr.aria-label]=\"adminT('search')\"></div>\n        <p *ngIf=\"filter==='attention'\" class=\"management-hint\">{{adminT('attentionHint')}}</p>\n        <p *ngIf=\"dashboardLoading\" role=\"status\">{{adminT('loading')}}</p>\n        <p *ngIf=\"dashboardError\" class=\"management-error\" role=\"alert\">{{dashboardError}}</p>\n        <p *ngIf=\"!dashboardLoading && !dashboardError && !visibleBookings.length\" class=\"management-empty\">{{adminT('empty')}}</p>\n        <div class=\"booking-table-wrap\" *ngIf=\"!dashboardError && visibleBookings.length\">\n          <table class=\"management-table\"><thead><tr><th>{{adminT('guest')}}</th><th>{{adminT('stay')}}</th><th>{{adminT('status')}}</th><th>{{adminT('payment')}}</th><th><span class=\"sr-only\">{{adminT('action')}}</span></th></tr></thead><tbody>\n            <tr *ngFor=\"let b of visibleBookings | slice:0:8\"><td><strong>{{b.customerName || b.customerEmail}}</strong><small>{{b.customerEmail}}</small></td><td>{{b.startAt | date:'dd/MM/yyyy · HH:mm'}}<small>→ {{b.endAt | date:'dd/MM/yyyy · HH:mm'}}</small></td><td><span class=\"management-status\" [class.confirmed]=\"b.status==='confirmed' && !cancelling(b)\">{{statusText(b)}}</span></td><td>{{paymentText(b)}}</td><td><a class=\"management-text-link\" [routerLink]=\"'/admin/reservations' | resourceRoute\" [queryParams]=\"{bookingId:b.id}\">{{adminT('manage')}} →</a></td></tr>\n          </tbody></table>\n        </div>\n        <a class=\"management-all-link\" [routerLink]=\"'/admin/reservations' | resourceRoute\">{{adminT('allBookings')}} →</a>\n      </section>\n      <aside class=\"management-sidebar\">\n        <section class=\"management-panel arrival-panel\"><span class=\"eyebrow\">{{adminT('nextArrival')}}</span><ng-container *ngIf=\"nextArrival as arrival; else noArrival\"><h3>{{arrival.customerName || arrival.customerEmail}}</h3><p>{{arrival.startAt | date:'dd/MM/yyyy · HH:mm'}} → {{arrival.endAt | date:'dd/MM/yyyy · HH:mm'}}</p><a class=\"management-text-link\" [routerLink]=\"'/admin/reservations' | resourceRoute\" [queryParams]=\"{bookingId:arrival.id}\">{{adminT('manage')}} →</a></ng-container><ng-template #noArrival><p>{{dashboardLoading?adminT('loading'):adminT('noArrival')}}</p></ng-template></section>\n        <section class=\"management-panel\"><h3>{{adminT('attention')}}</h3><p class=\"management-hint\">{{adminT('approvalNote')}}</p><a class=\"management-quick-link\" [routerLink]=\"'/owner/payments' | resourceRoute\">{{adminT('paymentsLink')}} <span>→</span></a><a class=\"management-quick-link\" [routerLink]=\"'/details' | resourceRoute\" queryParamsHandling=\"preserve\">{{adminT('propertyLink')}} <span>→</span></a></section>\n      </aside>\n    </div>\n  </main>\n  <ng-template #customerHome><section class=\"asset-page\"><app-asset-gallery [images]=\"images\" [title]=\"asset.name\"></app-asset-gallery><div class=\"copy\"><span class=\"eyebrow\">{{eyebrow}}</span><h1>{{asset.name}}</h1><p class=\"asset-location\" *ngIf=\"asset.location?.city\">{{asset.location.area ? asset.location.area+' · ':''}}{{asset.location.city}} · {{asset.location.country}}</p><p class=\"headline\">{{localizedHeadline}}</p><p>{{localizedDescription}}</p><div class=\"facts\"><span *ngFor=\"let fact of facts\">{{fact}}</span></div><div class=\"price\">{{t('from')}} <strong>{{price.basePrice}} {{price.currency}}</strong> / {{price.pricingUnit==='night'?t('night'):t('day')}}</div><div class=\"actions\"><a class=\"primary\" [routerLink]=\"'/reserver' | resourceRoute\" queryParamsHandling=\"preserve\">{{t('book')}}</a><a [routerLink]=\"'/details' | resourceRoute\" queryParamsHandling=\"preserve\">{{detailLabel}}</a></div></div></section></ng-template>\n</ng-container>\n<ng-template #loading><div class=\"loading\">{{error || t('loading')}}</div></ng-template>\n";

/***/ }),

/***/ 82599:
/*!*********************************************************************!*\
  !*** ./src/app/assets/pool/pages/details/pool-details.component.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PoolDetailsComponent: () => (/* binding */ PoolDetailsComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _pool_details_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pool-details.component.html?ngResource */ 46461);
/* harmony import */ var _pool_details_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pool-details.component.scss?ngResource */ 32721);
/* harmony import */ var _pool_details_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_pool_details_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_asset_photos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/asset-photos */ 19009);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _services_resource_context_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/resource-context.service */ 54560);
/* harmony import */ var _services_private_media_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/private-media.service */ 71260);









let PoolDetailsComponent = class PoolDetailsComponent {
  http;
  ctx;
  media;
  asset = null;
  error = '';
  images = [];
  kind = 'pool';
  detailLabel = 'La piscine';
  eyebrow = 'Location de piscine';
  constructor(http, ctx, media) {
    this.http = http;
    this.ctx = ctx;
    this.media = media;
  }
  ngOnInit() {
    var _this = this;
    this.http.get(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({
      next: function () {
        var _ref = (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (a) {
          _this.asset = yield _this.media.resolveFirebaseTree(a);
          _this.images = _this.assetImages(_this.asset);
        });
        return function next(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      error: () => this.error = 'Ressource introuvable.'
    });
  }
  get p() {
    return this.asset?.properties || {};
  }
  get price() {
    return this.asset?.pricing || {};
  }
  assetImages(a) {
    return (0,_services_asset_photos__WEBPACK_IMPORTED_MODULE_3__.assetPhotoPaths)(a, this.ctx.resourceType, this.ctx.resourceId).map(path => this.media.objectUrl(path));
  }
  get facts() {
    return [`${this.p.lengthM || '-'} × ${this.p.widthM || '-'} m`, `${this.p.capacity || '-'} personnes`, this.p.heated ? 'Chauffée' : 'Non chauffée', this.p.indoor ? 'Intérieure' : 'Extérieure'];
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient
  }, {
    type: _services_resource_context_service__WEBPACK_IMPORTED_MODULE_4__.ResourceContextService
  }, {
    type: _services_private_media_service__WEBPACK_IMPORTED_MODULE_5__.PrivateMediaService
  }];
};
PoolDetailsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
  selector: 'app-pool-details',
  template: _pool_details_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: false,
  styles: [(_pool_details_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], PoolDetailsComponent);


/***/ }),

/***/ 85679:
/*!***************************************************************!*\
  !*** ./src/app/assets/pool/pages/home/pool-home.component.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PoolHomeComponent: () => (/* binding */ PoolHomeComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _pool_home_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pool-home.component.html?ngResource */ 59701);
/* harmony import */ var _pool_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pool-home.component.scss?ngResource */ 35785);
/* harmony import */ var _pool_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_pool_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_asset_photos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/asset-photos */ 19009);
/* harmony import */ var _services_asset_admin_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/asset-admin-i18n */ 28466);
/* harmony import */ var _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../home/site-content-service/site-content.service */ 73196);
/* harmony import */ var godigital_lib__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! godigital-lib */ 22464);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/language.service */ 48756);
/* harmony import */ var _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/asset-page-i18n */ 94700);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _services_resource_context_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../services/resource-context.service */ 54560);
/* harmony import */ var _services_private_media_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../services/private-media.service */ 71260);
















let PoolHomeComponent = class PoolHomeComponent {
  http;
  ctx;
  media;
  language;
  store;
  auth;
  contentService;
  uiContent = null;
  t(key) {
    const fallback = _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_8__.ASSET_PAGE_I18N[this.language.currentLanguage]?.[key] || _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_8__.ASSET_PAGE_I18N.fr[key] || key;
    return this.contentService?.tFromContent(this.uiContent, 'ui.assetPages.' + key, this.language.currentLanguage, fallback) || fallback;
  }
  get localized() {
    return this.asset?.translations?.[this.language.currentLanguage] || {};
  }
  get localizedHeadline() {
    return this.localized.headline || this.asset?.headline || '';
  }
  get localizedDescription() {
    return this.localized.description || this.asset?.description || '';
  }
  asset = null;
  error = '';
  images = [];
  kind = 'pool';
  get detailLabel() {
    return this.t('pool');
  }
  get eyebrow() {
    return this.t('pool');
  }
  constructor(http, ctx, media, language, store, auth, contentService) {
    this.http = http;
    this.ctx = ctx;
    this.media = media;
    this.language = language;
    this.store = store;
    this.auth = auth;
    this.contentService = contentService;
  }
  ownerView = 'admin';
  bookings = [];
  dashboardLoading = false;
  dashboardError = '';
  dashboardLoaded = false;
  filter = 'upcoming';
  search = '';
  requestId = 0;
  stopAuth;
  destroyed = false;
  viewChanged = event => {
    this.ownerView = event.detail === 'customer' ? 'customer' : 'admin';
    void this.refreshDashboard();
  };
  storageChanged = event => {
    if (event.key === 'alegria-owner-view') {
      this.readOwnerView();
      void this.refreshDashboard();
    }
  };
  readOwnerView() {
    try {
      this.ownerView = localStorage.getItem('alegria-owner-view') === 'customer' ? 'customer' : 'admin';
    } catch {
      this.ownerView = 'admin';
    }
  }
  get currentUser() {
    const store = this.store;
    return store.firebaseauth?.currentUser || store.firebaseAuth?.currentUser || store.auth?.currentUser || null;
  }
  get showAdmin() {
    return !!this.asset?.ownerId && this.currentUser?.uid === this.asset.ownerId && this.ownerView === 'admin';
  }
  ngOnInit() {
    var _this = this;
    void this.contentService?.getContent().then(c => this.uiContent = c);
    this.readOwnerView();
    window.addEventListener('alegria-owner-view-change', this.viewChanged);
    window.addEventListener('storage', this.storageChanged);
    const db = this.store;
    const firebaseAuth = db.firebaseauth || db.firebaseAuth || db.auth;
    if (typeof firebaseAuth?.onAuthStateChanged === 'function') this.stopAuth = firebaseAuth.onAuthStateChanged(() => {
      void this.refreshDashboard();
    });
    this.http.get(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({
      next: function () {
        var _ref = (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (a) {
          try {
            const resolved = yield _this.media.resolveFirebaseTree(a);
            if (_this.destroyed) return;
            _this.asset = resolved;
            _this.images = _this.assetImages(_this.asset);
            yield _this.refreshDashboard();
          } catch {
            if (!_this.destroyed) _this.error = 'Ressource introuvable.';
          }
        });
        return function next(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      error: () => this.error = 'Ressource introuvable.'
    });
  }
  refreshDashboard() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const request = ++_this2.requestId;
      _this2.dashboardError = '';
      if (!_this2.showAdmin) {
        _this2.bookings = [];
        _this2.dashboardLoading = false;
        _this2.dashboardLoaded = false;
        return;
      }
      _this2.dashboardLoading = true;
      const uid = _this2.currentUser.uid;
      const assetId = _this2.ctx.resourceId;
      try {
        const rows = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this2.http.get(`/api/owners/${encodeURIComponent(uid)}/bookings`, {
          headers: yield _this2.auth.headers()
        }));
        if (request !== _this2.requestId || _this2.destroyed || !_this2.showAdmin || uid !== _this2.currentUser?.uid || assetId !== _this2.ctx.resourceId) return;
        _this2.bookings = (Array.isArray(rows) ? rows : []).filter(b => b.ownerId === uid && b.assetType === 'pool' && b.assetId === assetId);
        _this2.dashboardLoaded = true;
      } catch {
        if (request === _this2.requestId) {
          _this2.bookings = [];
          _this2.dashboardLoaded = false;
          _this2.dashboardError = _this2.adminT('loadError');
        }
      } finally {
        if (request === _this2.requestId) _this2.dashboardLoading = false;
      }
    })();
  }
  ngOnDestroy() {
    this.destroyed = true;
    this.requestId++;
    this.stopAuth?.();
    window.removeEventListener('alegria-owner-view-change', this.viewChanged);
    window.removeEventListener('storage', this.storageChanged);
  }
  isActive(b) {
    return !['cancelled', 'rejected', 'completed'].includes(b.status);
  }
  needsApproval(b) {
    return this.isActive(b) && b.status === 'pending' && b.workflow?.adminApproved !== true;
  }
  needsPayment(b) {
    return this.isActive(b) && (Number(b.bookingDeposit) > 0 && b.workflow?.depositPaid !== true || Number(b.balanceAmount) > 0 && b.workflow?.balancePaid !== true || Number(b.securityDeposit) > 0 && b.workflow?.warrantyProvided !== true);
  }
  cancelling(b) {
    return this.isActive(b) && (b.cancellationRequestStatus === 'pending' || ['refund_pending', 'refund_failed', 'review_required'].includes(b.cancellation?.status));
  }
  needsAttention(b) {
    return this.needsApproval(b) || this.needsPayment(b) || this.cancelling(b);
  }
  get upcomingBookings() {
    return this.bookings.filter(b => this.isActive(b) && Date.parse(b.endAt) >= Date.now()).sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
  }
  get approvalCount() {
    return this.bookings.filter(b => this.needsApproval(b)).length;
  }
  get paymentCount() {
    return this.bookings.filter(b => this.needsPayment(b)).length;
  }
  get cancellationCount() {
    return this.bookings.filter(b => this.cancelling(b)).length;
  }
  get visibleBookings() {
    const query = this.search.trim().toLocaleLowerCase();
    const list = this.filter === 'upcoming' ? this.upcomingBookings : this.filter === 'attention' ? this.bookings.filter(b => this.needsAttention(b)) : this.bookings;
    return list.filter(b => !query || [b.customerName, b.customerEmail, b.id].some(v => String(v || '').toLocaleLowerCase().includes(query))).slice().sort((a, b) => this.filter === 'all' ? Date.parse(b.startAt) - Date.parse(a.startAt) : Date.parse(a.startAt) - Date.parse(b.startAt));
  }
  get nextArrival() {
    return this.upcomingBookings.find(b => b.status === 'confirmed' && Date.parse(b.startAt) >= Date.now());
  }
  onSearch(event) {
    this.search = event.target.value;
  }
  statusText(b) {
    if (b.status === 'cancelled') return this.adminT('cancelled');
    if (this.cancelling(b)) return this.adminT(b.cancellationRequestStatus === 'pending' ? 'cancellationRequested' : 'refundPending');
    return this.adminT(b.status === 'confirmed' ? 'confirmed' : b.status === 'completed' ? 'completed' : b.status === 'rejected' ? 'rejected' : 'pending');
  }
  paymentText(b) {
    if (b.cancellation?.status === 'completed') return this.adminT('refundCompleted');
    return this.adminT(this.cancelling(b) ? 'refundFollowup' : this.needsPayment(b) ? 'paymentDue' : 'paymentsReady');
  }
  adminT(key) {
    const lang = this.language.currentLanguage;
    const fallback = _services_asset_admin_i18n__WEBPACK_IMPORTED_MODULE_4__.ASSET_ADMIN_I18N['pool'][lang]?.[key] || _services_asset_admin_i18n__WEBPACK_IMPORTED_MODULE_4__.ASSET_ADMIN_I18N['pool'].en[key] || key;
    return this.contentService?.tFromContent(this.uiContent, 'ui.management.pool.' + key, lang, fallback) || fallback;
  }
  get p() {
    return this.asset?.properties || {};
  }
  get price() {
    return this.asset?.pricing || {};
  }
  assetImages(a) {
    return (0,_services_asset_photos__WEBPACK_IMPORTED_MODULE_3__.assetPhotoPaths)(a, this.ctx.resourceType, this.ctx.resourceId).map(path => this.media.objectUrl(path));
  }
  get facts() {
    return [`${this.p.lengthM || '-'} × ${this.p.widthM || '-'} m`, `${this.p.capacity || '-'} ${this.t('people')}`, this.p.heated ? this.t('heated') : this.t('unheated'), this.p.indoor ? this.t('indoor') : this.t('outdoor')];
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClient
  }, {
    type: _services_resource_context_service__WEBPACK_IMPORTED_MODULE_9__.ResourceContextService
  }, {
    type: _services_private_media_service__WEBPACK_IMPORTED_MODULE_10__.PrivateMediaService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_7__.LanguageService
  }, {
    type: godigital_lib__WEBPACK_IMPORTED_MODULE_13__.StoreDbService
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_6__.ReservationAuthService
  }, {
    type: _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_5__.SiteContentService
  }];
};
PoolHomeComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_14__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_15__.Component)({
  selector: 'app-pool-home',
  template: _pool_home_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: false,
  styles: [(_pool_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], PoolHomeComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_assets_pool_pool_module_ts.js.map