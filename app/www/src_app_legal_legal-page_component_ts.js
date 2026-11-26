(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_legal_legal-page_component_ts"],{

/***/ 12456:
/*!***********************************************!*\
  !*** ./src/app/legal/legal-page.component.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LegalPageComponent: () => (/* binding */ LegalPageComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _legal_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legal-page.component.html?ngResource */ 87208);
/* harmony import */ var _legal_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./legal-page.component.scss?ngResource */ 38768);
/* harmony import */ var _legal_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_legal_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_site_return__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/site-return */ 50831);
/* harmony import */ var _services_asset_domain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/asset-domain */ 94984);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 19999);
/* harmony import */ var _services_legal_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/legal.service */ 5847);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../home/site-text.pipe */ 99343);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);















let LegalPageComponent = class LegalPageComponent {
  api;
  route;
  router;
  language;
  catalog;
  roles = [];
  loading = false;
  labels = {};
  errorKey = '';
  name = '';
  adult = false;
  agreed = false;
  working = false;
  saved = false;
  role = 'customer';
  sign = false;
  receipt;
  sub;
  request = 0;
  constructor(api, route, router, language) {
    this.api = api;
    this.route = route;
    this.router = router;
    this.language = language;
  }
  ngOnInit() {
    this.sign = this.route.snapshot.data['accept'] === true;
    this.sub = (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.combineLatest)([this.route.queryParamMap, this.language.language$]).subscribe(([params]) => {
      this.role = this.validRole(params.get('role'));
      void this.load();
    });
  }
  validRole(value) {
    return value === 'assetOwner' || value === 'concierge' ? value : 'customer';
  }
  selectRole(value) {
    if (this.sign || this.working) return;
    const role = this.validRole(value);
    if (role === this.role) return;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        role
      },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
  }
  ngOnDestroy() {
    this.request++;
    this.sub?.unsubscribe();
  }
  load() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const n = ++_this.request,
        role = _this.role;
      _this.loading = true;
      _this.catalog = null;
      _this.agreed = false;
      _this.saved = false;
      _this.receipt = null;
      _this.errorKey = '';
      try {
        const catalog = yield _this.api.catalog(role);
        if (n !== _this.request) return;
        _this.catalog = catalog;
        _this.labels = catalog.labels;
        _this.roles = catalog.roles || [];
        if (_this.sign) {
          try {
            const s = yield _this.api.status(role);
            if (n !== _this.request) return;
            _this.receipt = s.receipt;
            _this.saved = s.accepted;
          } catch {
            if (n === _this.request) _this.errorKey = 'needLogin';
          }
        }
      } catch {
        if (n === _this.request) _this.errorKey = 'error';
      } finally {
        if (n === _this.request) _this.loading = false;
      }
    })();
  }
  accept() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.loading || _this2.working || !_this2.catalog?.accepting || !_this2.adult || !_this2.agreed || _this2.name.trim().length < 2) return;
      const n = _this2.request,
        catalog = _this2.catalog;
      _this2.working = true;
      _this2.errorKey = '';
      try {
        const result = yield _this2.api.accept(catalog, _this2.name, _this2.adult);
        if (n !== _this2.request) return;
        _this2.receipt = result.receipt;
        _this2.saved = true;
      } catch (e) {
        if (n === _this2.request) _this2.errorKey = e.status === 409 ? 'changed' : 'errorSave';
      } finally {
        _this2.working = false;
      }
    })();
  }
  continue() {
    const host = location.hostname;
    void this.router.navigateByUrl((0,_services_site_return__WEBPACK_IMPORTED_MODULE_3__.siteReturn)(this.route.snapshot.queryParamMap.get('returnUrl'), host, (0,_services_asset_domain__WEBPACK_IMPORTED_MODULE_4__.assetDomainSlug)(host) ? '/' : '/account/profile'));
  }
  downloadDocument(d) {
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (d.attachment) {
        try {
          const response = yield fetch('/api/legal/files/' + [d.releaseId, d.id, d.language].map(encodeURIComponent).join('/'));
          if (!response.ok) throw Error('download');
          const blob = yield response.blob();
          _this3.download(blob, d.attachment.filename || 'conditions.pdf', 'application/pdf');
        } catch {
          _this3.errorKey = 'errorDownload';
        }
        return;
      }
      _this3.download(d.text + (d.language !== 'fr' ? '\n\n' + _this3.labels.referenceTitle + '\n\n' + d.referenceText : ''), d.id + '-' + d.language + '-' + d.version + '.txt', 'text/plain;charset=utf-8');
    })();
  }
  downloadReceipt() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.receipt) return;
      try {
        _this4.download(JSON.stringify(yield _this4.api.receipt(_this4.receipt.bundleHash), null, 2), 'godirect-acceptation.json', 'application/json');
      } catch {
        _this4.errorKey = 'errorDownload';
      }
    })();
  }
  download(data, name, type) {
    const url = URL.createObjectURL(new Blob([data], {
        type
      })),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  static ctorParameters = () => [{
    type: _services_legal_service__WEBPACK_IMPORTED_MODULE_5__.LegalService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_10__.Router
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_6__.LanguageService
  }];
};
LegalPageComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_11__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_12__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_15__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_8__.PlatformLayoutComponent, _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_7__.SiteTextPipe],
  template: _legal_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_legal_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], LegalPageComponent);


/***/ }),

/***/ 38768:
/*!************************************************************!*\
  !*** ./src/app/legal/legal-page.component.scss?ngResource ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.legal-shell {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
  color: #153c48;
}

h1 {
  font-size: 2.4rem;
}

article {
  margin: 32px 0;
  padding-top: 20px;
  border-top: 1px solid #ccd9db;
}

nav {
  display: flex;
  gap: 24px;
  margin: 24px 0;
}

pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font: inherit;
  line-height: 1.65;
}

label {
  display: block;
  margin: 18px 0;
}

select, input:not([type=checkbox]) {
  display: block;
  padding: 12px;
  max-width: 100%;
  border: 1px solid #8ca6ac;
  border-radius: 6px;
}

button {
  padding: 12px 18px;
  margin: 8px 12px 8px 0;
  border: 0;
  border-radius: 8px;
  background: #14546c;
  color: white;
}

button:disabled {
  opacity: 0.5;
}

.check {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.check input {
  margin-top: 5px;
}

.draft, [role=alert] {
  padding: 16px;
  background: #fff3d6;
  color: #664609;
}

a {
  color: #14546c;
}

.eyebrow {
  font-weight: 600;
}`, "",{"version":3,"sources":["webpack://./src/app/legal/legal-page.component.scss"],"names":[],"mappings":"AAAA;EAAa,iBAAA;EAAiB,cAAA;EAAc,kBAAA;EAAkB,cAAA;AAK9D;;AAL4E;EAAG,iBAAA;AAS/E;;AATgG;EAAQ,cAAA;EAAc,iBAAA;EAAiB,6BAAA;AAevI;;AAfoK;EAAI,aAAA;EAAa,SAAA;EAAS,cAAA;AAqB9L;;AArB4M;EAAI,qBAAA;EAAqB,uBAAA;EAAuB,aAAA;EAAa,iBAAA;AA4BzQ;;AA5B0R;EAAM,cAAA;EAAc,cAAA;AAiC9S;;AAjC4T;EAAkC,cAAA;EAAc,aAAA;EAAa,eAAA;EAAe,yBAAA;EAAyB,kBAAA;AAyCja;;AAzCmb;EAAO,kBAAA;EAAkB,sBAAA;EAAsB,SAAA;EAAS,kBAAA;EAAkB,mBAAA;EAAmB,YAAA;AAkDhhB;;AAlD4hB;EAAgB,YAAA;AAsD5iB;;AAtDujB;EAAO,aAAA;EAAa,uBAAA;EAAuB,SAAA;AA4DlmB;;AA5D2mB;EAAa,eAAA;AAgExnB;;AAhEuoB;EAAoB,aAAA;EAAa,mBAAA;EAAmB,cAAA;AAsE3rB;;AAtEysB;EAAE,cAAA;AA0E3sB;;AA1EytB;EAAS,gBAAA;AA8EluB","sourcesContent":[".legal-shell{max-width:1000px;margin:0 auto;padding:40px 24px;color:#153c48}h1{font-size:2.4rem}article{margin:32px 0;padding-top:20px;border-top:1px solid #ccd9db}nav{display:flex;gap:24px;margin:24px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.65}label{display:block;margin:18px 0}select,input:not([type=checkbox]){display:block;padding:12px;max-width:100%;border:1px solid #8ca6ac;border-radius:6px}button{padding:12px 18px;margin:8px 12px 8px 0;border:0;border-radius:8px;background:#14546c;color:white}button:disabled{opacity:.5}.check{display:flex;align-items:flex-start;gap:12px}.check input{margin-top:5px}.draft,[role=alert]{padding:16px;background:#fff3d6;color:#664609}a{color:#14546c}.eyebrow{font-weight:600}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 87208:
/*!************************************************************!*\
  !*** ./src/app/legal/legal-page.component.html?ngResource ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"legal-shell\"><p class=\"eyebrow\">GoDirect · All Digital Network</p><h1>{{sign?labels.acceptTitle:labels.conditions}}</h1><p>{{labels.intro}}</p><nav aria-label=\"GoDirect\"><a routerLink=\"/legal\">{{'ui.legal.conditions' | siteText}}</a><a routerLink=\"/faq\">{{'ui.legal.faq' | siteText}}</a><a [href]=\"'mailto:'+labels.contactEmail\">{{'ui.legal.contact' | siteText}}</a></nav><label>{{labels.activity}}<select [ngModel]=\"role\" (ngModelChange)=\"selectRole($event)\" [disabled]=\"sign||working\"><option *ngFor=\"let r of roles\" [value]=\"r.id\">{{r.label}}</option></select></label><p *ngIf=\"errorKey\" role=\"alert\">{{labels[errorKey] || ('ui.legal.contact' | siteText)}}</p><ng-container *ngIf=\"catalog\"><p>{{labels.languageLabel}} : {{catalog.language}}</p><p class=\"draft\" *ngIf=\"!catalog.published\">{{labels.notPublished}} {{catalog.accepting?labels.draftTest:labels.waitPublication}}</p><article *ngFor=\"let d of catalog.documents\" [attr.lang]=\"d.language\"><h2>{{d.title}}</h2><p>{{d.version}}</p><button type=\"button\" (click)=\"downloadDocument(d)\">{{labels.downloadText}}</button><pre>{{d.text}}</pre><details *ngIf=\"d.language!=='fr'\"><summary>{{labels.showFrench}}</summary><pre lang=\"fr\">{{d.referenceText}}</pre></details></article><section *ngIf=\"sign&&!saved\"><h2>{{labels.signTitle}}</h2><p>{{labels.signIntro}}</p><label>{{labels.name}}<input [(ngModel)]=\"name\" autocomplete=\"name\" maxlength=\"240\"></label><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"adult\">{{labels.adult}}</label><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"agreed\">{{labels.agree}}</label><p>{{labels.noMarketing}}</p><button type=\"button\" (click)=\"accept()\" [disabled]=\"loading||working||!catalog.accepting||!adult||!agreed||name.trim().length<2\">{{working?labels.saving:labels.save}}</button></section><section *ngIf=\"sign&&saved\"><h2>{{labels.saved}}</h2><p>{{receipt?.signerName}} · {{receipt?.acceptedAt | date:'dd/MM/yyyy HH:mm'}} · {{receipt?.language}}</p><button type=\"button\" (click)=\"downloadReceipt()\">{{labels.receipt}}</button><button type=\"button\" (click)=\"continue()\">{{labels.continue}}</button></section></ng-container></main></app-platform-layout>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_legal_legal-page_component_ts.js.map