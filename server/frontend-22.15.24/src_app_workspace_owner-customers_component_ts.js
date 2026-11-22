(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_owner-customers_component_ts"],{

/***/ 21206:
/*!*********************************************************************!*\
  !*** ./src/app/workspace/owner-customers.component.html?ngResource ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"customers-shell\"><header><div><h1>{{t('title')}}</h1><p>{{t('intro')}}</p></div><button (click)=\"refresh()\" [disabled]=\"busy\">{{t('refresh')}}</button></header>\n<p *ngIf=\"error\" class=\"error\" role=\"alert\">{{error}}</p><p *ngIf=\"message\" class=\"notice\" role=\"status\">{{message}}</p><p *ngIf=\"busy\" role=\"status\">{{t('loading')}}</p>\n<ng-container *ngIf=\"uid && access.authenticatedUid===uid\"><label>{{t('search')}}<input [(ngModel)]=\"query\" type=\"search\"></label>\n<div class=\"table-scroll\"><table><thead><tr><th>{{t('name')}}</th><th>{{t('email')}}</th><th *ngIf=\"concierge\">{{t('owner')}}</th><th>{{t('bookings')}}</th><th>{{t('payments')}}</th><th>{{t('last')}}</th><th></th></tr></thead><tbody><tr *ngFor=\"let c of filtered\"><td>{{c.profile.name}}</td><td>{{c.profile.email}}</td><td *ngIf=\"concierge\">{{c.ownerName}}</td><td>{{c.bookingCount}}</td><td>{{c.paymentCount}}</td><td>{{c.lastTransactionAt|date:'dd/MM/yyyy HH:mm'}}</td><td><button (click)=\"select(c.id)\" [disabled]=\"busy\">{{t('open')}}</button></td></tr></tbody></table></div><p *ngIf=\"!rows.length && !busy\">{{t('empty')}}</p>\n<section class=\"panel\" *ngIf=\"selected\"><h2>{{selected.profile.name}}</h2><p *ngIf=\"concierge\">{{selected.ownerName}}</p><dl><dt>{{t('email')}}</dt><dd>{{selected.profile.email}}</dd><dt>{{t('phone')}}</dt><dd>{{selected.profile.phone||'—'}}</dd></dl>\n<h3>{{t('bookings')}}</h3><article class=\"booking\" *ngFor=\"let b of selected.bookings\"><div class=\"booking-head\"><div><strong>{{b.assetName}}</strong><p>{{b.startAt|date:'dd/MM/yyyy HH:mm'}} — {{b.endAt|date:'dd/MM/yyyy HH:mm'}}</p><small>{{b.id}} · {{b.stripeMode}}</small></div><a *ngIf=\"b.canManageBookings!==false\" [routerLink]=\"bookingLink(b)\" [queryParams]=\"{bookingId:b.id}\">{{t('openBooking')}}</a></div>\n<div class=\"metrics\" *ngIf=\"b.canViewPayments!==false\"><p>{{t('limit')}}<strong>{{b.warranty.limitMinor/100|number:'1.2-2'}} {{b.currency}}</strong></p><p>{{t('charged')}}<strong>{{b.warranty.chargedMinor/100|number:'1.2-2'}} {{b.currency}}</strong></p><p>{{t('reserved')}}<strong>{{b.warranty.reservedMinor/100|number:'1.2-2'}} {{b.currency}}</strong></p><p>{{t('remaining')}}<strong>{{b.warranty.remainingMinor/100|number:'1.2-2'}} {{b.currency}}</strong></p></div>\n<p *ngIf=\"!concierge && !b.warranty.hasCard\">{{t('noCard')}}</p><p *ngIf=\"!concierge && b.warranty.hasCard && !b.warranty.consent\">{{t('needsConsent')}}</p><button *ngIf=\"b.warranty.canCharge\" (click)=\"openCharge(b)\" [disabled]=\"busy\">{{t('charge')}}</button>\n<div *ngFor=\"let c of b.warranty.charges\" class=\"claim\"><strong>{{c.amountMinor/100|number:'1.2-2'}} {{b.currency}} · {{status(c.status)}}</strong><p>{{c.reason}}</p><small>{{c.createdAt|date:'dd/MM/yyyy HH:mm'}}</small><button *ngIf=\"c.status!=='succeeded' && c.status!=='canceled'\" (click)=\"reconcile(b,c)\" [disabled]=\"busy\">{{t('check')}}</button></div></article>\n<h3>{{t('payments')}}</h3><div class=\"table-scroll\"><table><thead><tr><th>{{t('date')}}</th><th>{{t('kind')}}</th><th>{{t('amount')}}</th><th>{{t('status')}}</th><th>{{t('reason')}}</th><th>{{t('reference')}}</th></tr></thead><tbody><tr *ngFor=\"let p of selected.payments\"><td>{{p.createdAt|date:'dd/MM/yyyy HH:mm'}}</td><td>{{t(p.kind)}}</td><td>{{p.kind==='security_deposit'?'—':(p.amount|number:'1.2-2')}} {{p.kind==='security_deposit'?'':p.currency}}</td><td>{{status(p.status)}}<small *ngIf=\"p.refundedMinor\">{{t('refunded')}} {{p.refundedMinor/100|number:'1.2-2'}} {{p.currency}}</small></td><td>{{p.reason||'—'}}</td><td>{{p.id}}<small>{{p.stripeMode}}</small></td></tr></tbody></table></div></section>\n<section *ngIf=\"draft\" class=\"charge-form\" aria-labelledby=\"charge-title\"><h2 id=\"charge-title\">{{t('charge')}}</h2><p>{{selected?.profile.name}} · {{draft.booking.assetName}}</p><p>{{t('remaining')}} : {{draft.booking.warranty.remainingMinor/100|number:'1.2-2'}} {{draft.booking.currency}}</p>\n<label>{{t('amount')}}<input type=\"number\" min=\"0.01\" step=\"0.01\" [max]=\"draft.booking.warranty.remainingMinor/100\" [(ngModel)]=\"draft.amount\" (ngModelChange)=\"draft.review=false\" [disabled]=\"busy\"></label><label>{{t('reason')}}<textarea [(ngModel)]=\"draft.reason\" (ngModelChange)=\"draft.review=false\" minlength=\"10\" maxlength=\"2000\" [disabled]=\"busy\"></textarea><small>{{t('reasonHint')}}</small></label>\n<p *ngIf=\"draft.review\" class=\"notice\">{{t('confirmHint')}} {{amountMinor/100|number:'1.2-2'}} {{draft.booking.currency}}.</p><button *ngIf=\"!draft.review\" (click)=\"review()\" [disabled]=\"busy\">{{t('review')}}</button><button *ngIf=\"draft.review\" (click)=\"charge()\" [disabled]=\"busy\">{{t('confirmCharge')}}</button><button class=\"secondary\" (click)=\"draft=null\" [disabled]=\"busy\">{{t('cancel')}}</button></section>\n</ng-container></main></app-platform-layout>\n";

/***/ }),

/***/ 37668:
/*!*********************************************************************!*\
  !*** ./src/app/workspace/owner-customers.component.scss?ngResource ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.customers-shell {
  max-width: 1200px;
  margin: auto;
  padding: 2rem 1.2rem;
  color: #153b46;
}

header, .booking-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

header p {
  max-width: 48rem;
}

.panel, .charge-form {
  background: white;
  border: 1px solid #cbdde1;
  border-radius: 16px;
  padding: 1.4rem;
  margin: 1.5rem 0;
}

.booking {
  padding: 1rem 0;
  border-bottom: 1px solid #d9e3e6;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metrics strong, small {
  display: block;
}

.claim {
  padding: 1rem;
  border: 1px solid #d9e3e6;
  border-radius: 10px;
  margin: 0.8rem 0;
}

.claim p {
  white-space: pre-wrap;
}

button {
  background: #12566a;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  margin: 0.3rem 0.4rem 0.3rem 0;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}

.secondary {
  background: #e7eff1;
  color: #173a43;
}

label {
  display: block;
  margin: 0.8rem 0;
}

input, textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #b8cdd3;
  border-radius: 8px;
  padding: 0.7rem;
  margin-top: 0.4rem;
}

textarea {
  min-height: 100px;
}

.error {
  color: #b42318;
}

.notice {
  background: #eef6f7;
  padding: 1rem;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

td, th {
  padding: 0.8rem;
  border-bottom: 1px solid #d9e3e6;
  vertical-align: top;
}

.table-scroll {
  overflow: auto;
}

dl {
  display: grid;
  grid-template-columns: 7rem 1fr;
}

dd {
  margin: 0 0 0.5rem;
}

h3 {
  margin-top: 2rem;
}

@media (max-width: 650px) {
  .metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  header, .booking-head {
    flex-direction: column;
  }
  .customers-shell {
    padding: 1rem;
  }
  .panel, .charge-form {
    padding: 1rem;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/workspace/owner-customers.component.scss"],"names":[],"mappings":"AAAA;EAAiB,iBAAA;EAAiB,YAAA;EAAY,oBAAA;EAAoB,cAAA;AAKlE;;AALgF;EAAqB,aAAA;EAAa,8BAAA;EAA8B,SAAA;EAAS,kBAAA;AAYzJ;;AAZ2K;EAAS,gBAAA;AAgBpL;;AAhBoM;EAAoB,iBAAA;EAAiB,yBAAA;EAAyB,mBAAA;EAAmB,eAAA;EAAe,gBAAA;AAwBpS;;AAxBoT;EAAS,eAAA;EAAe,gCAAA;AA6B5U;;AA7B4W;EAAS,aAAA;EAAa,qCAAA;EAAoC,SAAA;AAmCta;;AAnC+a;EAAsB,cAAA;AAuCrc;;AAvCmd;EAAO,aAAA;EAAa,yBAAA;EAAyB,mBAAA;EAAmB,gBAAA;AA8CnhB;;AA9CkiB;EAAS,qBAAA;AAkD3iB;;AAlDgkB;EAAO,mBAAA;EAAmB,YAAA;EAAY,SAAA;EAAS,kBAAA;EAAkB,oBAAA;EAAmB,eAAA;EAAe,8BAAA;AA4DnqB;;AA5D8rB;EAAgB,YAAA;EAAW,eAAA;AAiEztB;;AAjEwuB;EAAW,mBAAA;EAAmB,cAAA;AAsEtwB;;AAtEoxB;EAAM,cAAA;EAAc,gBAAA;AA2ExyB;;AA3EuzB;EAAe,cAAA;EAAc,WAAA;EAAW,sBAAA;EAAsB,yBAAA;EAAyB,kBAAA;EAAkB,eAAA;EAAc,kBAAA;AAqF96B;;AArF+7B;EAAS,iBAAA;AAyFx8B;;AAzFy9B;EAAO,cAAA;AA6Fh+B;;AA7F8+B;EAAQ,mBAAA;EAAmB,aAAA;EAAa,kBAAA;AAmGthC;;AAnGwiC;EAAM,WAAA;EAAW,yBAAA;EAAyB,gBAAA;AAyGllC;;AAzGkmC;EAAM,eAAA;EAAc,gCAAA;EAAgC,mBAAA;AA+GtpC;;AA/GyqC;EAAc,cAAA;AAmHvrC;;AAnHqsC;EAAG,aAAA;EAAa,+BAAA;AAwHrtC;;AAxHovC;EAAG,kBAAA;AA4HvvC;;AA5HwwC;EAAG,gBAAA;AAgI3wC;;AAhI2xC;EAAwB;IAAS,qCAAA;EAqI1zC;EArI81C;IAAqB,sBAAA;EAwIn3C;EAxIy4C;IAAiB,aAAA;EA2I15C;EA3Iu6C;IAAoB,aAAA;EA8I37C;AACF","sourcesContent":[".customers-shell{max-width:1200px;margin:auto;padding:2rem 1.2rem;color:#153b46}header,.booking-head{display:flex;justify-content:space-between;gap:1rem;align-items:start}header p{max-width:48rem}.panel,.charge-form{background:white;border:1px solid #cbdde1;border-radius:16px;padding:1.4rem;margin:1.5rem 0}.booking{padding:1rem 0;border-bottom:1px solid #d9e3e6}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.metrics strong,small{display:block}.claim{padding:1rem;border:1px solid #d9e3e6;border-radius:10px;margin:.8rem 0}.claim p{white-space:pre-wrap}button{background:#12566a;color:white;border:0;border-radius:8px;padding:.7rem 1rem;cursor:pointer;margin:.3rem .4rem .3rem 0}button:disabled{opacity:.5;cursor:default}.secondary{background:#e7eff1;color:#173a43}label{display:block;margin:.8rem 0}input,textarea{display:block;width:100%;box-sizing:border-box;border:1px solid #b8cdd3;border-radius:8px;padding:.7rem;margin-top:.4rem}textarea{min-height:100px}.error{color:#b42318}.notice{background:#eef6f7;padding:1rem;border-radius:8px}table{width:100%;border-collapse:collapse;text-align:left}td,th{padding:.8rem;border-bottom:1px solid #d9e3e6;vertical-align:top}.table-scroll{overflow:auto}dl{display:grid;grid-template-columns:7rem 1fr}dd{margin:0 0 .5rem}h3{margin-top:2rem}@media(max-width:650px){.metrics{grid-template-columns:repeat(2,1fr)}header,.booking-head{flex-direction:column}.customers-shell{padding:1rem}.panel,.charge-form{padding:1rem}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 67690:
/*!********************************************************!*\
  !*** ./src/app/workspace/owner-customers.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OwnerCustomersComponent: () => (/* binding */ OwnerCustomersComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _owner_customers_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./owner-customers.component.html?ngResource */ 21206);
/* harmony import */ var _owner_customers_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./owner-customers.component.scss?ngResource */ 37668);
/* harmony import */ var _owner_customers_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_owner_customers_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _services_owner_customers_text__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/owner-customers-text */ 80550);















let OwnerCustomersComponent = class OwnerCustomersComponent {
  http;
  auth;
  access;
  language;
  route;
  rows = [];
  selected = null;
  query = '';
  uid = '';
  busy = false;
  error = '';
  message = '';
  draft = null;
  request = 0;
  constructor(http, auth, access, language, route) {
    this.http = http;
    this.auth = auth;
    this.access = access;
    this.language = language;
    this.route = route;
  }
  delegatedRows = [];
  get concierge() {
    return this.route?.snapshot?.data?.['concierge'] === true;
  }
  t(key) {
    return _services_owner_customers_text__WEBPACK_IMPORTED_MODULE_7__.OWNER_CUSTOMERS_TEXT[this.language.currentLanguage]?.[key] || _services_owner_customers_text__WEBPACK_IMPORTED_MODULE_7__.OWNER_CUSTOMERS_TEXT.en[key] || key;
  }
  status(value) {
    return this.t('status_' + value);
  }
  get filtered() {
    const q = this.query.trim().toLowerCase();
    return this.rows.filter(r => (r.profile.name + ' ' + r.profile.email).toLowerCase().includes(q));
  }
  ngOnInit() {
    void this.refresh();
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.busy) return;
      _this.busy = true;
      _this.error = '';
      const request = ++_this.request;
      try {
        const u = yield _this.auth.user();
        _this.uid = u.uid;
        const rows = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this.http.get(_this.concierge ? '/api/concierge/customers' : '/api/owner/customers', {
          headers: yield _this.auth.headers()
        }));
        if (request !== _this.request || (yield _this.auth.user()).uid !== _this.uid) return;
        _this.delegatedRows = _this.concierge ? rows : [];
        _this.rows = _this.concierge ? rows.map(r => ({
          ...r,
          bookingCount: r.bookings.length,
          paymentCount: r.payments.length,
          lastTransactionAt: r.payments.map(p => p.createdAt || '').sort().at(-1) || null
        })) : rows;
        if (_this.selected) {
          const id = _this.selected.id;
          _this.selected = null;
          yield _this.detail(id);
        }
      } catch {
        _this.error = _this.t('error');
        _this.rows = [];
        _this.selected = null;
      } finally {
        _this.busy = false;
      }
    })();
  }
  detail(id) {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.concierge) {
        _this2.selected = _this2.delegatedRows.find(r => r.id === id) || null;
        return;
      }
      const uid = (yield _this2.auth.user()).uid;
      const row = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this2.http.get('/api/owner/customers/' + encodeURIComponent(id), {
        headers: yield _this2.auth.headers()
      }));
      if (uid === (yield _this2.auth.user()).uid && uid === _this2.uid) _this2.selected = row;
    })();
  }
  select(id) {
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.busy) return;
      _this3.busy = true;
      _this3.error = '';
      _this3.draft = null;
      try {
        yield _this3.detail(id);
      } catch {
        _this3.error = _this3.t('error');
      } finally {
        _this3.busy = false;
      }
    })();
  }
  bookingLink(b) {
    return ['/', b.assetType, b.assetId, 'admin', 'reservations'];
  }
  endpoint(b) {
    return '/api/owner/bookings/' + [b.assetType, b.assetId, b.id].map(encodeURIComponent).join('/') + '/warranty-charges';
  }
  openCharge(b) {
    this.error = '';
    this.message = '';
    this.draft = {
      booking: b,
      amount: '',
      reason: '',
      requestId: crypto.randomUUID(),
      review: false
    };
  }
  get amountMinor() {
    const n = Number(this.draft?.amount);
    return Number.isFinite(n) ? Math.round(n * 100) : 0;
  }
  review() {
    if (!this.draft || this.amountMinor <= 0 || this.amountMinor > this.draft.booking.warranty.remainingMinor || this.draft.reason.trim().length < 10) {
      this.error = this.t('invalid');
      return;
    }
    this.error = '';
    this.draft.review = true;
  }
  charge() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this4.concierge || _this4.busy || !_this4.draft?.review) return;
      _this4.busy = true;
      _this4.error = '';
      const d = _this4.draft;
      try {
        if ((yield _this4.auth.user()).uid !== _this4.uid) throw Error('auth');
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this4.http.post(_this4.endpoint(d.booking), {
          requestId: d.requestId,
          amountMinor: _this4.amountMinor,
          reason: d.reason.trim(),
          acknowledged: true
        }, {
          headers: yield _this4.auth.headers()
        }));
        _this4.message = _this4.status(result.status);
        _this4.draft = null;
        yield _this4.detail(_this4.selected.id);
      } catch (e) {
        _this4.error = _this4.problem(e);
      } finally {
        _this4.busy = false;
      }
    })();
  }
  reconcile(b, c) {
    var _this5 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this5.busy) return;
      _this5.busy = true;
      _this5.error = '';
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this5.http.post(_this5.endpoint(b) + '/' + encodeURIComponent(c.id) + '/reconcile', {}, {
          headers: yield _this5.auth.headers()
        }));
        _this5.message = _this5.status(result.status);
        yield _this5.detail(_this5.selected.id);
      } catch (e) {
        _this5.error = _this5.problem(e);
      } finally {
        _this5.busy = false;
      }
    })();
  }
  problem(e) {
    const code = e?.error?.error || '';
    return code === 'warranty_limit_exceeded' ? this.t('limitChanged') : code === 'warranty_consent_required' ? this.t('needsConsent') : code === 'warranty_request_changed' ? this.t('requestChanged') : this.t('error');
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_6__.LanguageService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute
  }];
};
OwnerCustomersComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_11__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_12__.Component)({
  selector: 'app-owner-customers',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_15__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__.PlatformLayoutComponent],
  template: _owner_customers_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_owner_customers_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], OwnerCustomersComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_owner-customers_component_ts.js.map