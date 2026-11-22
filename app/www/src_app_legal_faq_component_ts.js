(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_legal_faq_component_ts"],{

/***/ 4181:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/legal/faq.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30%3D!./src/app/legal/faq.component.ts ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.faq{max-width:950px;margin:auto;padding:40px 24px;color:#153c48}h1{font-size:2.5rem}section{margin:36px 0}details{padding:18px 0;border-bottom:1px solid #d3dfe1}summary{font-weight:600;cursor:pointer}p{line-height:1.65}a{color:#14546c}`, "",{"version":3,"sources":["webpack://./src/app/legal/faq.component.ts"],"names":[],"mappings":"AAAA,KAAK,eAAe,CAAC,WAAW,CAAC,iBAAiB,CAAC,aAAa,CAAC,GAAG,gBAAgB,CAAC,QAAQ,aAAa,CAAC,QAAQ,cAAc,CAAC,+BAA+B,CAAC,QAAQ,eAAe,CAAC,cAAc,CAAC,EAAE,gBAAgB,CAAC,EAAE,aAAa","sourcesContent":[".faq{max-width:950px;margin:auto;padding:40px 24px;color:#153c48}h1{font-size:2.5rem}section{margin:36px 0}details{padding:18px 0;border-bottom:1px solid #d3dfe1}summary{font-weight:600;cursor:pointer}p{line-height:1.65}a{color:#14546c}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 60581:
/*!****************************************!*\
  !*** ./src/app/legal/faq.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FaqComponent: () => (/* binding */ FaqComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/app/legal/faq.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30%3D!./src/app/legal/faq.component.ts */ 4181);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _services_legal_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/legal.service */ 5847);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../home/site-text.pipe */ 99343);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);










let FaqComponent = class FaqComponent {
  api;
  language;
  content;
  error = false;
  sub;
  request = 0;
  constructor(api, language) {
    this.api = api;
    this.language = language;
  }
  ngOnInit() {
    this.sub = this.language.language$.subscribe(() => {
      void this.load();
    });
  }
  load() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const n = ++_this.request;
      _this.content = null;
      _this.error = false;
      try {
        const content = yield _this.api.content();
        if (n === _this.request) _this.content = content;
      } catch {
        if (n === _this.request) _this.error = true;
      }
    })();
  }
  ngOnDestroy() {
    this.request++;
    this.sub?.unsubscribe();
  }
  static ctorParameters = () => [{
    type: _services_legal_service__WEBPACK_IMPORTED_MODULE_2__.LegalService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_3__.LanguageService
  }];
};
FaqComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__.PlatformLayoutComponent, _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_4__.SiteTextPipe],
  template: `<app-platform-layout><main class="faq" [attr.lang]="content?.language"><p>GoDirect · All Digital Network</p><h1>{{content?.faq.title || ('ui.legal.faq' | siteText)}}</h1><p>{{content?.faq.intro}}</p><nav><a routerLink="/legal">{{'ui.legal.conditions' | siteText}}</a> · <a [href]="'mailto:'+content?.labels.contactEmail">{{'ui.legal.contact' | siteText}}</a></nav><p role="alert" *ngIf="error">{{'ui.legal.contact' | siteText}}</p><section *ngFor="let group of content?.faq.groups"><h2>{{group.title}}</h2><details *ngFor="let item of group.items"><summary>{{item.question}}</summary><p>{{item.answer}}</p></details></section><p>{{content?.faq.disclaimer}}</p></main></app-platform-layout>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LmZhcXttYXgtd2lkdGg6OTUwcHg7bWFyZ2luOmF1dG87cGFkZGluZzo0MHB4IDI0cHg7Y29sb3I6IzE1M2M0OH1oMXtmb250LXNpemU6Mi41cmVtfXNlY3Rpb257bWFyZ2luOjM2cHggMH1kZXRhaWxze3BhZGRpbmc6MThweCAwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RmZTF9c3VtbWFyeXtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXJ9cHtsaW5lLWhlaWdodDoxLjY1fWF7Y29sb3I6IzE0NTQ2Y30_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_legal_faq_component_ts__WEBPACK_IMPORTED_MODULE_1___default())]
})], FaqComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_legal_faq_component_ts.js.map