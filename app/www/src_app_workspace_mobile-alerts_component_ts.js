(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_mobile-alerts_component_ts"],{

/***/ 72159:
/*!******************************************************!*\
  !*** ./src/app/workspace/mobile-alerts.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MobileAlertsComponent: () => (/* binding */ MobileAlertsComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/app/workspace/mobile-alerts.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ%3D%3D!./src/app/workspace/mobile-alerts.component.ts */ 96979);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/language.service */ 48756);











let MobileAlertsComponent = class MobileAlertsComponent {
  http;
  auth;
  language;
  url = '/api/me/mobile-alerts';
  phone = '';
  verifiedPhone = '';
  code = '';
  channel = 'off';
  consent = false;
  verified = false;
  pending = false;
  busy = false;
  error = '';
  message = '';
  available = {
    sms: false,
    whatsapp: false
  };
  constructor(http, auth, language) {
    this.http = http;
    this.auth = auth;
    this.language = language;
  }
  get fr() {
    return this.language.currentLanguage === 'fr';
  }
  ngOnInit() {
    void this.run(() => this.load());
  }
  load() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const p = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this.http.get(_this.url, {
        headers: yield _this.auth.headers()
      }));
      _this.phone = _this.verifiedPhone = p.phone;
      _this.verified = p.verified;
      _this.available = p.available;
      _this.channel = p.available[p.channel] ? p.channel : 'off';
      _this.consent = false;
    })();
  }
  run(action) {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.busy) return;
      _this2.busy = true;
      _this2.error = _this2.message = '';
      try {
        yield action();
      } catch (e) {
        const code = e?.error?.error;
        if (e.status === 429) _this2.error = _this2.fr ? 'Patientez avant de réessayer.' : 'Wait before trying again.';else if (code === 'invalid_mobile_code' || code === 'mobile_code_expired') _this2.error = _this2.fr ? 'Code incorrect ou expiré.' : 'Incorrect or expired code.';else if (code === 'invalid_mobile_number') _this2.error = _this2.fr ? 'Numéro invalide ou non autorisé.' : 'Invalid or unauthorized number.';else _this2.error = _this2.fr ? 'Action impossible. Vérifiez votre compte et réessayez.' : 'Could not complete the action. Check your account and try again.';
      } finally {
        _this2.busy = false;
      }
    })();
  }
  sendCode() {
    var _this3 = this;
    return this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this3.http.post(_this3.url + '/verify', {
        phone: _this3.phone
      }, {
        headers: yield _this3.auth.headers()
      }));
      _this3.pending = true;
      _this3.code = '';
      _this3.message = _this3.fr ? 'Code envoyé.' : 'Code sent.';
    }));
  }
  confirm() {
    var _this4 = this;
    return this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this4.http.post(_this4.url + '/confirm', {
        code: _this4.code
      }, {
        headers: yield _this4.auth.headers()
      }));
      _this4.pending = false;
      _this4.code = '';
      yield _this4.load();
      _this4.message = _this4.fr ? 'Numéro vérifié. Choisissez votre canal.' : 'Number verified. Choose your channel.';
    }));
  }
  save() {
    var _this5 = this;
    return this.run(/*#__PURE__*/(0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this5.http.put(_this5.url, {
        channel: _this5.channel,
        consent: _this5.consent
      }, {
        headers: yield _this5.auth.headers()
      }));
      yield _this5.load();
      _this5.message = _this5.fr ? 'Préférences enregistrées.' : 'Preferences saved.';
    }));
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_4__.LanguageService
  }];
};
MobileAlertsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_2__.PlatformLayoutComponent],
  template: `
<app-platform-layout><main class="settings">
<h1>{{fr?'Alertes SMS et WhatsApp':'SMS and WhatsApp alerts'}}</h1>
<p>{{fr?'Soyez averti des nouvelles demandes de renseignement et de réservation concernant vos biens ou les biens dont vous gérez les réservations.':'Get alerts about new enquiries and bookings for rentals you own or manage.'}}</p>
<p *ngIf="!available.sms&&!available.whatsapp&&!busy">{{fr?'Les alertes mobiles ne sont pas encore disponibles.':'Mobile alerts are not available yet.'}}</p>
<p *ngIf="verified">{{fr?'Numéro vérifié :':'Verified number:'}} {{verifiedPhone}}</p>
<form *ngIf="available.sms||available.whatsapp" (ngSubmit)="sendCode()">
<label>{{fr?'Numéro au format international':'International phone number'}} <input name="phone" type="tel" autocomplete="tel" [(ngModel)]="phone" placeholder="+33612345678" required></label>
<button type="submit" [disabled]="busy">{{fr?'Envoyer un code par SMS':'Send an SMS code'}}</button>
</form>
<form *ngIf="pending" (ngSubmit)="confirm()">
<label>{{fr?'Code reçu':'Verification code'}} <input name="code" autocomplete="one-time-code" inputmode="numeric" [(ngModel)]="code" required></label>
<button type="submit" [disabled]="busy">{{fr?'Vérifier le numéro':'Verify number'}}</button>
</form>
<form *ngIf="verified" (ngSubmit)="save()">
<label>{{fr?'Canal':'Channel'}} <select name="channel" [(ngModel)]="channel" (ngModelChange)="consent=false">
<option value="off">{{fr?'Désactivé':'Off'}}</option><option *ngIf="available.sms" value="sms">SMS</option><option *ngIf="available.whatsapp" value="whatsapp">WhatsApp</option>
</select></label>
<label *ngIf="channel!=='off'"><input name="consent" type="checkbox" [(ngModel)]="consent"> {{fr?'J’accepte de recevoir ces alertes GoDirect par':'I agree to receive these GoDirect alerts via'}} {{channel==='sms'?'SMS':'WhatsApp'}}.</label>
<button type="submit" [disabled]="busy||(channel!=='off'&&!consent)">{{fr?'Enregistrer':'Save'}}</button>
</form>
<p role="status">{{message}}</p><p role="alert" *ngIf="error">{{error}}</p>
</main></app-platform-layout>
`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_mobile_alerts_component_ts__WEBPACK_IMPORTED_MODULE_1___default())]
})], MobileAlertsComponent);


/***/ }),

/***/ 96979:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/workspace/mobile-alerts.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LnNldHRpbmdze21heC13aWR0aDo3NjBweDttYXJnaW46MzZweCBhdXRvO3BhZGRpbmc6MjRweH1mb3Jte2Rpc3BsYXk6Z3JpZDtnYXA6MTJweDttYXJnaW46MjBweCAwO3BhZGRpbmc6MjBweDtib3JkZXI6MXB4IHNvbGlkICNjYWQ3ZDE7Ym9yZGVyLXJhZGl1czoxMnB4fWlucHV0LHNlbGVjdCxidXR0b257cGFkZGluZzo4cHg7bWFyZ2luOjVweH1idXR0b257anVzdGlmeS1zZWxmOnN0YXJ0fQ%3D%3D!./src/app/workspace/mobile-alerts.component.ts ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.settings{max-width:760px;margin:36px auto;padding:24px}form{display:grid;gap:12px;margin:20px 0;padding:20px;border:1px solid #cad7d1;border-radius:12px}input,select,button{padding:8px;margin:5px}button{justify-self:start}`, "",{"version":3,"sources":["webpack://./src/app/workspace/mobile-alerts.component.ts"],"names":[],"mappings":"AAAA,UAAU,eAAe,CAAC,gBAAgB,CAAC,YAAY,CAAC,KAAK,YAAY,CAAC,QAAQ,CAAC,aAAa,CAAC,YAAY,CAAC,wBAAwB,CAAC,kBAAkB,CAAC,oBAAoB,WAAW,CAAC,UAAU,CAAC,OAAO,kBAAkB","sourcesContent":[".settings{max-width:760px;margin:36px auto;padding:24px}form{display:grid;gap:12px;margin:20px 0;padding:20px;border:1px solid #cad7d1;border-radius:12px}input,select,button{padding:8px;margin:5px}button{justify-self:start}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_mobile-alerts_component_ts.js.map