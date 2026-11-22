"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_document-review_component_ts"],{

/***/ 13135:
/*!*********************************************************************!*\
  !*** ./src/app/workspace/document-review.component.html?ngResource ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = "<app-platform-layout><main class=\"document-shell\"><a routerLink=\"/platform/admin\">← GoDirect</a><h1>{{t('adminTitle')}}</h1><p>{{t('reviewIntro')}}</p><p *ngIf=\"error\" role=\"alert\">{{error}}</p><p class=\"notice\">{{t('blocked')}}</p><ng-container *ngIf=\"data\"><label>{{t('status')}}<select [(ngModel)]=\"filter\"><option value=\"all\">{{t('all')}}</option><option *ngFor=\"let s of ['pendingReview','draft','validated','refused','expiredDossier']\" [value]=\"s\">{{t('status_'+s)}}</option></select></label><label>{{t('search')}}<input [(ngModel)]=\"query\"></label><section *ngFor=\"let r of rows\"><h2>{{r.name}}</h2><p>{{t('owner')}} : {{r.ownerName}}</p><p>{{t('status_'+r.status)}} · {{r.validated}} / {{r.total}}</p><p *ngIf=\"r.reason\">{{r.reason}}</p><a [routerLink]=\"['/platform/admin/documents',r.assetType,r.id]\">{{t('open')}}</a></section><p *ngIf=\"!rows.length\">{{t('noAssets')}}</p></ng-container></main></app-platform-layout>\n";

/***/ }),

/***/ 36317:
/*!********************************************************!*\
  !*** ./src/app/workspace/document-review.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentReviewComponent: () => (/* binding */ DocumentReviewComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _document_review_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./document-review.component.html?ngResource */ 13135);
/* harmony import */ var _asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./asset-documents.component.scss?ngResource */ 88052);
/* harmony import */ var _asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);













let DocumentReviewComponent = class DocumentReviewComponent {
  http;
  auth;
  language;
  data;
  error = '';
  busy = false;
  filter = 'all';
  query = '';
  sub;
  sequence = 0;
  constructor(http, auth, language) {
    this.http = http;
    this.auth = auth;
    this.language = language;
  }
  ngOnInit() {
    this.sub = this.language.language$.subscribe(() => void this.refresh());
  }
  ngOnDestroy() {
    this.sequence++;
    this.sub?.unsubscribe();
  }
  t(k) {
    return this.data?.labels?.[k] || {
      adminTitle: 'Validation des justificatifs',
      error: 'Impossible de charger les dossiers.'
    }[k] || k;
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const n = ++_this.sequence;
      _this.busy = true;
      _this.error = '';
      try {
        const uid = (yield _this.auth.user()).uid,
          data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this.http.get('/api/platform/admin/documents', {
            headers: yield _this.auth.headers(),
            params: {
              language: _this.language.currentLanguage
            }
          }));
        if (n !== _this.sequence || uid !== (yield _this.auth.user()).uid) return;
        _this.data = data;
      } catch {
        if (n === _this.sequence) {
          _this.error = _this.t('error');
          _this.data = null;
        }
      } finally {
        if (n === _this.sequence) _this.busy = false;
      }
    })();
  }
  get rows() {
    const q = this.query.trim().toLowerCase();
    return (this.data?.rows || []).filter(r => (this.filter === 'all' || r.status === this.filter) && (!q || (r.name + ' ' + r.ownerName).toLowerCase().includes(q))).sort((a, b) => Number(b.status === 'pendingReview') - Number(a.status === 'pendingReview'));
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_4__.LanguageService
  }];
};
DocumentReviewComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_9__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__.PlatformLayoutComponent],
  template: _document_review_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], DocumentReviewComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_document-review_component_ts.js.map