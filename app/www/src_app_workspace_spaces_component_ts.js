(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_spaces_component_ts"],{

/***/ 80953:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/workspace/spaces.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9!./src/app/workspace/spaces.component.ts ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `main{max-width:55rem;margin:3rem auto;padding:1rem}a{display:block;margin:.8rem 0;padding:1rem;background:white;border:1px solid #cad9d1;border-radius:.7rem;color:#173b36}`, "",{"version":3,"sources":["webpack://./src/app/workspace/spaces.component.ts"],"names":[],"mappings":"AAAA,KAAK,eAAe,CAAC,gBAAgB,CAAC,YAAY,CAAC,EAAE,aAAa,CAAC,cAAc,CAAC,YAAY,CAAC,gBAAgB,CAAC,wBAAwB,CAAC,mBAAmB,CAAC,aAAa","sourcesContent":["main{max-width:55rem;margin:3rem auto;padding:1rem}a{display:block;margin:.8rem 0;padding:1rem;background:white;border:1px solid #cad9d1;border-radius:.7rem;color:#173b36}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 95324:
/*!***********************************************!*\
  !*** ./src/app/workspace/spaces.component.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpacesComponent: () => (/* binding */ SpacesComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/app/workspace/spaces.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9!./src/app/workspace/spaces.component.ts */ 80953);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/language.service */ 48756);







let SpacesComponent = class SpacesComponent {
  access;
  language;
  constructor(access, language) {
    this.access = access;
    this.language = language;
  }
  get fr() {
    return this.language.currentLanguage === 'fr';
  }
  static ctorParameters = () => [{
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_1__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_2__.LanguageService
  }];
};
SpacesComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule],
  template: `<main><h1>{{fr?'Mes espaces':'My workspaces'}}</h1><a routerLink="/locations">{{fr?'Locataire · Trouver une location':'Renter · Find a rental'}}</a><a [routerLink]="access.isOwner?'/owner/listings':'/owner/start'">{{fr?(access.isOwner?'Propriétaire · Mes biens':'Mettre mon bien en location'):'Owner · My listings'}}</a><a *ngIf="access.isConcierge" routerLink="/concierge">{{fr?'Propriétaire par délégation · Biens confiés':'Delegated manager · Assigned properties'}}</a></main>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NTVyZW07bWFyZ2luOjNyZW0gYXV0bztwYWRkaW5nOjFyZW19YXtkaXNwbGF5OmJsb2NrO21hcmdpbjouOHJlbSAwO3BhZGRpbmc6MXJlbTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlcjoxcHggc29saWQgI2NhZDlkMTtib3JkZXItcmFkaXVzOi43cmVtO2NvbG9yOiMxNzNiMzZ9_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_spaces_component_ts__WEBPACK_IMPORTED_MODULE_0___default())]
})], SpacesComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_spaces_component_ts.js.map