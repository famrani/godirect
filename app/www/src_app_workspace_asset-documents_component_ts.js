"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_asset-documents_component_ts"],{

/***/ 52278:
/*!*********************************************************************!*\
  !*** ./src/app/workspace/asset-documents.component.html?ngResource ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = "<app-platform-layout><main class=\"document-shell\"><a [routerLink]=\"data?.canReview?'/platform/admin/documents':'/owner/listings'\">← {{t('back')}}</a><h1>{{t('title')}} <span *ngIf=\"data\">— {{data.assetName}}</span></h1><p *ngIf=\"error\" role=\"alert\">{{error}}</p><ng-container *ngIf=\"data\"><p>{{t('intro')}}</p><p class=\"notice\">{{t('privateNotice')}}</p><p>{{t('formats')}}</p><p><strong>{{t('status_'+data.summary.status)}}</strong> · {{data.summary.validated}} / {{data.summary.total}}</p><p class=\"notice\">{{t('blocked')}}</p><p *ngIf=\"data.summary.reason\">{{data.summary.reason}}</p><button *ngIf=\"data.canUpload && !data.readOnly\" [disabled]=\"busy||!data.summary.provided\" (click)=\"submit()\">{{t('submit')}}</button><p>{{t('policyNote')}}</p><section *ngIf=\"data.summary.exempted\" class=\"notice\"><h2>{{t('adminExemptionActive')}}</h2><p class=\"waiver-reason\">{{data.summary.adminExemption.reason}}</p><p *ngIf=\"data.summary.adminExemption.expiresOn\">{{t('expires')}} : {{data.summary.adminExemption.expiresOn}}</p></section><section *ngIf=\"data.canReview && !data.readOnly\"><h2>{{t('adminExemptionTitle')}}</h2><p>{{t('adminExemptionIntro')}}</p><label>{{t('reason')}}<textarea [(ngModel)]=\"exemptionReason\" maxlength=\"2000\" [disabled]=\"busy\"></textarea></label><label>{{t('expires')}}<input type=\"date\" [(ngModel)]=\"exemptionExpires\" [disabled]=\"busy\"></label><div class=\"actions\"><button [disabled]=\"busy||exemptionReason.trim().length<10\" (click)=\"exempt(true)\">{{t('adminExemptionGrant')}}</button><button *ngIf=\"data.summary.exempted\" [disabled]=\"busy||exemptionReason.trim().length<10\" (click)=\"exempt(false)\">{{t('adminExemptionRevoke')}}</button></div></section><section *ngFor=\"let r of data.requirements\"><h2>{{r.title}}</h2><p>{{t(r.policy==='required'?'mandatory':r.policy)}} · {{t('status_'+r.status)}}</p><article *ngFor=\"let d of r.files\"><strong>{{d.filename}}</strong><p>{{t('status_'+d.status)}} <span *ngIf=\"d.expiresOn\">· {{t('expires')}} : {{d.expiresOn}}</span></p><p *ngIf=\"d.reviewReason\">{{d.reviewReason}}</p><div class=\"actions\"><button type=\"button\" [disabled]=\"busy\" (click)=\"download(d)\" *ngIf=\"d.status!=='removed'\">{{t('download')}}</button><button type=\"button\" *ngIf=\"!data.readOnly\" [disabled]=\"busy\" (click)=\"remove(d)\">{{t('remove')}}</button></div><p *ngIf=\"data.canReview && !d.readForReview\">{{t('readFirst')}}</p><div *ngIf=\"data.canReview && !data.readOnly\"><label><input type=\"checkbox\" [(ngModel)]=\"readChecks[d.id]\" [disabled]=\"busy||!d.readForReview\">{{t('reviewConfirmed')}}</label><label>{{t('reason')}}<textarea [(ngModel)]=\"reasons['files'+d.id]\" maxlength=\"2000\"></textarea></label><div class=\"actions\"><button [disabled]=\"busy||!d.readForReview||!readChecks[d.id]\" (click)=\"review('files',d.id,d,'approved')\">{{t('approve')}}</button><button [disabled]=\"busy\" (click)=\"review('files',d.id,d,'rejected')\">{{t('reject')}}</button></div></div></article><fieldset [disabled]=\"busy\" *ngIf=\"data.canUpload && !data.readOnly\"><legend>{{t('upload')}}</legend><label>{{t('file')}}<input type=\"file\" accept=\"application/pdf,image/jpeg,image/png\" (change)=\"select(r.id,$event)\"></label><p *ngIf=\"files[r.id]\">{{files[r.id].name}}</p><label>{{t('expires')}} <span *ngIf=\"r.expiryRequired\">*</span><input type=\"date\" [(ngModel)]=\"expires[r.id]\" [required]=\"r.expiryRequired\"></label><button type=\"button\" [disabled]=\"!files[r.id] || (r.expiryRequired && !expires[r.id])\" (click)=\"upload(r)\">{{t('upload')}}</button></fieldset><details *ngIf=\"r.policy==='conditional' && (r.waiver || data.canUpload)\" [open]=\"!!r.waiver\"><summary>{{t('waiver')}}</summary><p>{{t('waiverIntro')}}</p><article *ngIf=\"r.waiver\"><p><strong>{{t('reason')}}</strong></p><p class=\"waiver-reason\">{{r.waiver.reason}}</p><p>{{t('status_'+r.waiver.status)}} · {{r.waiver.reviewReason}}</p><div *ngIf=\"data.canReview && !data.readOnly\"><label>{{t('reason')}}<textarea [(ngModel)]=\"reasons['waivers'+r.id]\" maxlength=\"2000\"></textarea></label><label>{{t('expires')}}<input type=\"date\" [(ngModel)]=\"expires['waivers'+r.id]\"></label><div class=\"actions\"><button [disabled]=\"busy\" (click)=\"review('waivers',r.id,r.waiver,'approved')\">{{t('approve')}}</button><button [disabled]=\"busy\" (click)=\"review('waivers',r.id,r.waiver,'rejected')\">{{t('reject')}}</button></div></div></article><label *ngIf=\"data.canUpload && !data.readOnly\">{{t('reason')}}<textarea [(ngModel)]=\"reasons[r.id]\" maxlength=\"2000\"></textarea></label><button *ngIf=\"data.canUpload && !data.readOnly\" [disabled]=\"busy\" (click)=\"waiver(r)\">{{t('submitWaiver')}}</button></details></section><section *ngIf=\"data.canReview && !data.readOnly\"><h2>{{t('adminTitle')}}</h2><p>{{t('reviewIntro')}}</p><label>{{t('dossierReason')}}<textarea [(ngModel)]=\"dossierReason\" maxlength=\"2000\"></textarea></label><div class=\"actions\"><button [disabled]=\"busy||!data.summary.submittedAt||!data.summary.complete||data.summary.pendingFiles>0||data.summary.pendingWaivers>0\" (click)=\"decision('approved')\">{{t('approveDossier')}}</button><button [disabled]=\"busy||!data.summary.submittedAt\" (click)=\"decision('rejected')\">{{t('rejectDossier')}}</button></div></section></ng-container></main></app-platform-layout>\n";

/***/ }),

/***/ 88246:
/*!********************************************************!*\
  !*** ./src/app/workspace/asset-documents.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetDocumentsComponent: () => (/* binding */ AssetDocumentsComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _asset_documents_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asset-documents.component.html?ngResource */ 52278);
/* harmony import */ var _asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./asset-documents.component.scss?ngResource */ 88052);
/* harmony import */ var _asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/language.service */ 48756);













let AssetDocumentsComponent = class AssetDocumentsComponent {
  http;
  auth;
  route;
  language;
  exemptionReason = '';
  exemptionExpires = '';
  data = null;
  busy = false;
  dossierReason = '';
  error = '';
  files = {};
  expires = {};
  reasons = {};
  readChecks = {};
  sub;
  generation = 0;
  uid = '';
  constructor(http, auth, route, language) {
    this.http = http;
    this.auth = auth;
    this.route = route;
    this.language = language;
  }
  get base() {
    return '/api/manage/assets/' + ['type', 'id'].map(k => encodeURIComponent(this.route.snapshot.paramMap.get(k) || '')).join('/') + '/documents';
  }
  t(k) {
    return this.data?.labels?.[k] || {
      title: 'Documents',
      error: 'Impossible de charger le dossier. Réessayez.',
      back: 'Retour'
    }[k] || k;
  }
  ngOnInit() {
    this.sub = this.language.language$.subscribe(() => void this.refresh());
  }
  ngOnDestroy() {
    this.generation++;
    this.sub?.unsubscribe();
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const n = ++_this.generation;
      _this.error = '';
      try {
        const uid = (yield _this.auth.user()).uid;
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this.http.get(_this.base, {
          headers: yield _this.auth.headers(),
          params: {
            language: _this.language.currentLanguage
          }
        }));
        if (n !== _this.generation || uid !== (yield _this.auth.user()).uid) return;
        _this.uid = uid;
        _this.data = data;
      } catch {
        if (n === _this.generation) {
          _this.error = _this.t('error');
          _this.data = null;
        }
      }
    })();
  }
  select(id, event) {
    const input = event.target,
      file = input.files?.[0];
    input.value = '';
    if (file && file.size <= 10485760 && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      this.files[id] = file;
      this.error = '';
    } else {
      delete this.files[id];
      this.error = this.t('formats');
    }
  }
  run(work) {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.busy) return;
      _this2.busy = true;
      _this2.error = '';
      try {
        if ((yield _this2.auth.user()).uid !== _this2.uid) throw Error('identity_changed');
        yield work();
        yield _this2.refresh();
      } catch (e) {
        const message = _this2.t(e?.error?.error === 'document_read_required' ? 'readFirst' : e?.error?.error === 'document_dossier_incomplete' ? 'incomplete' : e?.error?.error === 'invalid_expiry' ? 'expiryRequired' : e?.error?.error === 'private_document_bucket_required' ? 'storageError' : 'error');
        yield _this2.refresh();
        _this2.error = message;
      } finally {
        _this2.busy = false;
      }
    })();
  }
  exempt(active) {
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.data?.canReview || _this3.exemptionReason.trim().length < 10) {
        _this3.error = _this3.t('requiredReason');
        return;
      }
      yield _this3.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this3.http.post(_this3.base + '/admin-exemption', {
          active,
          reason: _this3.exemptionReason,
          expiresOn: _this3.exemptionExpires,
          fingerprint: _this3.data.summary.fingerprint
        }, {
          headers: yield _this3.auth.headers()
        }));
      }));
    })();
  }
  submit() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this4.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this4.http.post(_this4.base + '/submit', {}, {
          headers: yield _this4.auth.headers()
        }));
      }));
    })();
  }
  decision(status) {
    var _this5 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (status === 'rejected' && _this5.dossierReason.trim().length < 10) {
        _this5.error = _this5.t('requiredReason');
        return;
      }
      yield _this5.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this5.http.post(_this5.base + '/decision', {
          status,
          reason: _this5.dossierReason,
          fingerprint: _this5.data.summary.fingerprint
        }, {
          headers: yield _this5.auth.headers()
        }));
      }));
    })();
  }
  upload(r) {
    var _this6 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this6.files[r.id]) return;
      yield _this6.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        const body = new FormData();
        body.append('requirementId', r.id);
        body.append('expiresOn', _this6.expires[r.id] || '');
        body.append('file', _this6.files[r.id]);
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this6.http.post(_this6.base, body, {
          headers: yield _this6.auth.headers()
        }));
        delete _this6.files[r.id];
      }));
    })();
  }
  download(d) {
    var _this7 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this7.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        const blob = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this7.http.get(_this7.base + '/' + d.id + '/download', {
          headers: yield _this7.auth.headers(),
          responseType: 'blob'
        }));
        const url = URL.createObjectURL(blob),
          a = document.createElement('a');
        a.href = url;
        a.download = d.filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }));
    })();
  }
  remove(d) {
    var _this8 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!confirm(_this8.t('deleteConfirm'))) return;
      yield _this8.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this8.http.delete(_this8.base + '/' + d.id, {
          headers: yield _this8.auth.headers(),
          params: {
            revision: d.revision
          }
        }));
      }));
    })();
  }
  waiver(r) {
    var _this9 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if ((_this9.reasons[r.id] || '').trim().length < 10) {
        _this9.error = _this9.t('requiredReason');
        return;
      }
      yield _this9.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this9.http.post(_this9.base + '/waivers/' + r.id, {
          reason: _this9.reasons[r.id]
        }, {
          headers: yield _this9.auth.headers()
        }));
      }));
    })();
  }
  review(kind, id, d, status) {
    var _this10 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const reason = _this10.reasons[kind + id] || '';
      if (status === 'rejected' && reason.trim().length < 10) {
        _this10.error = _this10.t('requiredReason');
        return;
      }
      yield _this10.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this10.http.post(_this10.base + '/' + kind + '/' + id + '/review', {
          status,
          reason,
          readConfirmed: _this10.readChecks[id] === true,
          revision: d.revision,
          expiresOn: _this10.expires[kind + id] || ''
        }, {
          headers: yield _this10.auth.headers()
        }));
      }));
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_7__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__.ReservationAuthService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_8__.ActivatedRoute
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_5__.LanguageService
  }];
};
AssetDocumentsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_9__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.Component)({
  selector: 'app-asset-documents',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__.PlatformLayoutComponent],
  template: _asset_documents_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_asset_documents_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], AssetDocumentsComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_asset-documents_component_ts.js.map