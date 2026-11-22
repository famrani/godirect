(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_legal_legal-admin_component_ts"],{

/***/ 52334:
/*!*************************************************************!*\
  !*** ./src/app/legal/legal-admin.component.html?ngResource ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"legal-admin\"><a routerLink=\"/platform/admin\">← {{t('back')}}</a><h1>{{t('title')}}</h1><a routerLink=\"/platform/admin/documents\">{{t('assetDocuments')}}</a><p>{{t('intro')}}</p><p *ngIf=\"error\" role=\"alert\">{{error}}</p><p *ngIf=\"message\" role=\"status\">{{message}}</p><ng-container *ngIf=\"data\"><p>{{t(data.activePublished?'active':'notPublished')}} : {{data.activeRelease||'—'}}</p><p *ngIf=\"!data.activePublished\" role=\"status\">{{t('notPublishedHelp')}}</p><button *ngIf=\"data.canResumeActive\" (click)=\"resume()\" [disabled]=\"busy\">{{t('resumeExisting')}}</button><button *ngIf=\"!data.draft && !data.canResumeActive\" (click)=\"create()\" [disabled]=\"busy\">{{t('create')}}</button><ng-container *ngIf=\"data.draft\"><h2>{{t('draft')}} : {{data.draftRelease}}</h2><p>{{t('existingTextsHelp')}}</p><fieldset [disabled]=\"busy\"><label>{{t('role')}}<select [(ngModel)]=\"role\" (ngModelChange)=\"select()\"><option *ngFor=\"let r of roles\" [value]=\"r\">{{t(r)}}</option></select></label><label>{{t('language')}}<select [(ngModel)]=\"lang\" (ngModelChange)=\"select()\"><option *ngFor=\"let l of languages\" [value]=\"l\">{{l}}</option></select></label><label>{{t('titleField')}}<input [(ngModel)]=\"document.title\" maxlength=\"240\"></label><label>{{t('version')}}<input [(ngModel)]=\"document.version\" maxlength=\"80\"></label><label>{{t('file')}}<input type=\"file\" accept=\".pdf,.txt,.md\" (change)=\"choose($event)\"></label><p>{{t('formats')}}</p><p *ngIf=\"file\">{{file.name}}</p><button type=\"button\" *ngIf=\"document.attachment\" (click)=\"previewPdf()\">{{t('download')}}</button><label>{{t('text')}}<textarea [(ngModel)]=\"document.text\" (ngModelChange)=\"reviewed=false\" maxlength=\"250000\"></textarea></label><details><summary>{{t('preview')}}</summary><pre>{{document.text}}</pre></details><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"reviewed\">{{t('reviewed')}}</label><button type=\"button\" (click)=\"save()\" [disabled]=\"!reviewed||!document.title||!document.version||!document.text||document.text.trim().length<20\">{{t('save')}}</button></fieldset><section *ngIf=\"data.problems.length\"><h2>{{t('problems')}}</h2><button class=\"pending\" *ngFor=\"let p of data.problems\" (click)=\"role=p.split('/')[0];lang=p.split('/')[1];select()\" [disabled]=\"busy\">{{t(p.split('/')[0])}} · {{p.split('/')[1]}}</button></section><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"confirmed\" [disabled]=\"busy\">{{t('confirm')}}</label><button type=\"button\" (click)=\"publish()\" [disabled]=\"busy||!confirmed||data.problems.length>0\">{{t('publish')}}</button></ng-container></ng-container></main></app-platform-layout>\n";

/***/ }),

/***/ 61690:
/*!************************************************!*\
  !*** ./src/app/legal/legal-admin.component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LegalAdminComponent: () => (/* binding */ LegalAdminComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _legal_admin_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./legal-admin.component.html?ngResource */ 52334);
/* harmony import */ var _legal_admin_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./legal-admin.component.scss?ngResource */ 81720);
/* harmony import */ var _legal_admin_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_legal_admin_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);













let LegalAdminComponent = class LegalAdminComponent {
  http;
  auth;
  language;
  data;
  role = 'customer';
  lang = 'fr';
  document = {};
  file;
  reviewed = false;
  confirmed = false;
  busy = false;
  error = '';
  message = '';
  roles = ['customer', 'assetOwner', 'concierge'];
  languages = ['fr', 'en', 'es', 'it', 'de', 'nl', 'ru'];
  sub;
  uid = '';
  sequence = 0;
  editor = 0;
  base = '/api/platform/admin/legal';
  constructor(http, auth, language) {
    this.http = http;
    this.auth = auth;
    this.language = language;
  }
  ngOnInit() {
    this.sub = this.language.language$.subscribe(() => void this.load());
  }
  ngOnDestroy() {
    this.sequence++;
    this.sub?.unsubscribe();
  }
  t(k) {
    return this.data?.labels?.[this.language.currentLanguage]?.[k] || this.data?.labels?.fr?.[k] || k;
  }
  load() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const n = ++_this.sequence;
      try {
        const uid = (yield _this.auth.user()).uid;
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this.http.get(_this.base, {
          headers: yield _this.auth.headers()
        }));
        if (n !== _this.sequence || uid !== (yield _this.auth.user()).uid) return;
        _this.uid = uid;
        _this.data = data;
        _this.select();
      } catch {
        _this.error = _this.t('error');
        _this.data = null;
        _this.document = {};
      }
    })();
  }
  select() {
    this.editor++;
    this.document = {
      ...(this.data?.draft?.documents?.[this.role]?.[this.lang] || {})
    };
    this.file = undefined;
    this.reviewed = false;
    this.confirmed = false;
  }
  run(fn, refresh = true) {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.busy) return;
      _this2.busy = true;
      _this2.error = '';
      _this2.message = '';
      try {
        if ((yield _this2.auth.user()).uid !== _this2.uid) throw Error('identity_changed');
        yield fn();
        if (refresh) {
          yield _this2.load();
          _this2.message = _this2.t('success');
        }
      } catch (e) {
        _this2.error = _this2.t(e.status === 409 ? 'changed' : 'error') + (e?.error?.error ? ' (' + e.error.error + ')' : '');
        if (e.status === 409) yield _this2.load();
      } finally {
        _this2.busy = false;
      }
    })();
  }
  resume() {
    var _this3 = this;
    void this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this3.http.post(_this3.base + '/resume-active', {
        revision: _this3.data.revision
      }, {
        headers: yield _this3.auth.headers()
      }));
    }));
  }
  create() {
    var _this4 = this;
    void this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this4.http.post(_this4.base + '/draft', {
        revision: _this4.data.revision
      }, {
        headers: yield _this4.auth.headers()
      }));
    }));
  }
  choose(event) {
    var _this5 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const input = event.target,
        f = input.files?.[0],
        editor = _this5.editor;
      input.value = '';
      if (!f) return;
      if (f.size > 6291456 || !/\.(pdf|txt|md)$/i.test(f.name)) {
        _this5.error = _this5.t('formats');
        return;
      }
      _this5.file = f;
      _this5.reviewed = false;
      if (/\.(txt|md)$/i.test(f.name)) {
        const text = yield f.text();
        if (editor === _this5.editor) _this5.document.text = text;
      }
    })();
  }
  save() {
    var _this6 = this;
    void this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const body = new FormData();
      for (const [k, v] of Object.entries({
        revision: _this6.data.revision,
        role: _this6.role,
        language: _this6.lang,
        title: _this6.document.title || '',
        version: _this6.document.version || '',
        text: _this6.document.text || '',
        reviewed: String(_this6.reviewed)
      })) body.append(k, v);
      if (_this6.file) body.append('file', _this6.file);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this6.http.post(_this6.base + '/document', body, {
        headers: yield _this6.auth.headers()
      }));
    }));
  }
  publish() {
    var _this7 = this;
    void this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this7.http.post(_this7.base + '/publish', {
        revision: _this7.data.revision,
        confirmed: _this7.confirmed
      }, {
        headers: yield _this7.auth.headers()
      }));
    }));
  }
  previewPdf() {
    var _this8 = this;
    void this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const blob = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this8.http.get(_this8.base + '/file/' + _this8.role + '/' + _this8.lang, {
        headers: yield _this8.auth.headers(),
        responseType: 'blob'
      }));
      if ((yield _this8.auth.user()).uid !== _this8.uid) throw Error('identity_changed');
      const url = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = url;
      a.download = _this8.document.attachment?.filename || 'conditions.pdf';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }), false);
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_4__.LanguageService
  }];
};
LegalAdminComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_9__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_5__.PlatformLayoutComponent],
  template: _legal_admin_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_legal_admin_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], LegalAdminComponent);


/***/ }),

/***/ 81720:
/*!*************************************************************!*\
  !*** ./src/app/legal/legal-admin.component.scss?ngResource ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.legal-admin {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1.5rem;
  color: #173642;
}

fieldset, section {
  border: 1px solid #d6e0e4;
  border-radius: 14px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

label {
  display: block;
  margin: 1rem 0;
}

input, select, textarea {
  display: block;
  padding: 0.7rem;
  margin-top: 0.4rem;
  max-width: 100%;
}

textarea {
  width: 100%;
  min-height: 24rem;
}

.check {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
}

.check input {
  margin: 0.2rem 0;
}

button {
  padding: 0.75rem 1rem;
  background: #16496a;
  color: white;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  margin: 0.3rem;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

.pending {
  background: #f4e7cf;
  color: #463714;
}

pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 30rem;
  overflow: auto;
}

[role=alert] {
  padding: 1rem;
  background: #fff0ed;
  color: #9d2923;
}`, "",{"version":3,"sources":["webpack://./src/app/legal/legal-admin.component.scss"],"names":[],"mappings":"AAAA;EAAa,iBAAA;EAAiB,iBAAA;EAAiB,eAAA;EAAe,cAAA;AAK9D;;AAL4E;EAAiB,yBAAA;EAAyB,mBAAA;EAAmB,eAAA;EAAe,gBAAA;AAYxJ;;AAZwK;EAAM,cAAA;EAAc,cAAA;AAiB5L;;AAjB0M;EAAsB,cAAA;EAAc,eAAA;EAAc,kBAAA;EAAiB,eAAA;AAwB7Q;;AAxB4R;EAAS,WAAA;EAAW,iBAAA;AA6BhT;;AA7BiU;EAAO,aAAA;EAAa,WAAA;EAAU,uBAAA;AAmC/V;;AAnCsX;EAAa,gBAAA;AAuCnY;;AAvCkZ;EAAO,qBAAA;EAAoB,mBAAA;EAAmB,YAAA;EAAY,SAAA;EAAS,kBAAA;EAAkB,eAAA;EAAe,cAAA;AAiDtf;;AAjDmgB;EAAgB,YAAA;EAAW,eAAA;AAsD9hB;;AAtD6iB;EAAS,mBAAA;EAAmB,cAAA;AA2DzkB;;AA3DulB;EAAI,qBAAA;EAAqB,uBAAA;EAAuB,iBAAA;EAAiB,cAAA;AAkExpB;;AAlEsqB;EAAa,aAAA;EAAa,mBAAA;EAAmB,cAAA;AAwEntB","sourcesContent":[".legal-admin{max-width:1000px;margin:2rem auto;padding:1.5rem;color:#173642}fieldset,section{border:1px solid #d6e0e4;border-radius:14px;padding:1.5rem;margin:1.5rem 0}label{display:block;margin:1rem 0}input,select,textarea{display:block;padding:.7rem;margin-top:.4rem;max-width:100%}textarea{width:100%;min-height:24rem}.check{display:flex;gap:.7rem;align-items:flex-start}.check input{margin:.2rem 0}button{padding:.75rem 1rem;background:#16496a;color:white;border:0;border-radius:9px;cursor:pointer;margin:.3rem}button:disabled{opacity:.5;cursor:default}.pending{background:#f4e7cf;color:#463714}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:30rem;overflow:auto}[role=alert]{padding:1rem;background:#fff0ed;color:#9d2923}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ })

}]);
//# sourceMappingURL=src_app_legal_legal-admin_component_ts.js.map