(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_messaging_messaging_component_ts"],{

/***/ 8320:
/*!***************************************************************!*\
  !*** ./src/app/messaging/messaging.component.html?ngResource ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"messaging-shell\"><header><div><p class=\"eyebrow\">GoDirect</p><h1>{{t(0)}}</h1></div><span class=\"connection\" [class.online]=\"live==='live'\" role=\"status\">{{t(live==='live'?13:live==='connecting'?15:14)}}</span><button type=\"button\" (click)=\"reload()\" [disabled]=\"loading||!!deleting\">{{t(22)}}</button></header><p class=\"error\" *ngIf=\"error\" role=\"alert\">{{error}}</p><section class=\"new-thread\" *ngIf=\"!contactMode\"><h2>{{t(2)}}</h2><label>{{pt(10)}}<select [(ngModel)]=\"contextIndex\"><option value=\"\">—</option><option *ngFor=\"let c of contexts;let i=index\" [value]=\"contextKey(c)\">{{label(c)}}</option></select></label><button type=\"button\" (click)=\"start()\" [disabled]=\"contextIndex===''||loading||sending||!!deleting\">{{t(4)}}</button></section><section class=\"direct-contact\" *ngIf=\"contactMode\"><h2>{{contactInfo?.assetName}}</h2><label *ngIf=\"contactInfo\">{{ct(1)}}<select [(ngModel)]=\"recipientId\" (ngModelChange)=\"inquiryChanged()\" [disabled]=\"contactLoading||sending||!!deleting\"><option *ngFor=\"let person of contactInfo.contacts\" [value]=\"person.id\">{{person.name}} · {{ct(person.role==='concierge'?3:2)}}</option></select></label><div class=\"project-dates\" *ngIf=\"contactInfo\"><p>{{bt(14)}}</p><label>{{bt(2)}}<input type=\"date\" [(ngModel)]=\"prebookingForm.startDate\" (ngModelChange)=\"inquiryChanged()\"><input type=\"time\" [(ngModel)]=\"prebookingForm.startTime\" (ngModelChange)=\"inquiryChanged()\"></label><label>{{bt(3)}}<input type=\"date\" [(ngModel)]=\"prebookingForm.endDate\" (ngModelChange)=\"inquiryChanged()\"><input type=\"time\" [(ngModel)]=\"prebookingForm.endTime\" (ngModelChange)=\"inquiryChanged()\"></label><label *ngIf=\"['boat','property','pool'].includes(contactInfo.type)\">{{bt(8)}}<input type=\"number\" min=\"1\" [(ngModel)]=\"prebookingForm.guests\" (ngModelChange)=\"inquiryChanged()\"></label><div class=\"project-actions\"><button type=\"button\" (click)=\"changeContact()\" [disabled]=\"contactLoading||sending||!!deleting\">{{bt(0)}}</button><a *ngIf=\"inquiryValid&&!selected?.linkedBookingId\" [routerLink]=\"['/',contactInfo.type,contactInfo.assetId,'reserver']\" [queryParams]=\"bookingQuery()\">{{bt(4)}}</a></div><p>{{bt(5)}}</p></div><p *ngIf=\"contactLoading\" role=\"status\">{{ct(6)}}</p><a routerLink=\"/messages\">{{ct(4)}}</a></section><div class=\"chat-layout\" [class.direct-layout]=\"contactMode\"><aside *ngIf=\"!contactMode\"><h2>{{t(1)}}</h2><input type=\"search\" [(ngModel)]=\"search\" [placeholder]=\"pt(9)\" [attr.aria-label]=\"pt(9)\"><button class=\"thread\" type=\"button\" *ngFor=\"let thread of filtered\" (click)=\"open(thread)\" [class.selected]=\"selected?.id===thread.id\" [disabled]=\"sending||!!deleting\"><strong>{{thread.assetName}}</strong><span>{{label(thread)}}</span><small>{{thread.updatedAt|date:'dd/MM/yyyy HH:mm'}} <b *ngIf=\"thread.unread\"> · {{t(17)}}</b></small><span class=\"preview\">{{thread.previewDeleted?dt(4):thread.preview}}</span></button><p *ngIf=\"!filtered.length&&!loading\">{{t(8)}}</p></aside><section class=\"conversation\" *ngIf=\"selected;else choose\"><div class=\"conversation-heading\"><h2>{{label(selected)}}</h2><button type=\"button\" class=\"delete-action\" (click)=\"deleteConversation()\" [disabled]=\"!!deleting||sending\">{{deleting==='conversation'?dt(5):dt(0)}}</button></div><app-prebooking-summary [thread]=\"selected\" [uid]=\"uid\"></app-prebooking-summary><p class=\"audience\">{{audience(selected)}}</p><button type=\"button\" *ngIf=\"hasMore\" (click)=\"older()\" [disabled]=\"!!deleting||sending\">{{t(12)}}</button><div #messageStream (scroll)=\"readVisible()\" class=\"messages\" aria-live=\"polite\" aria-relevant=\"additions\"><article *ngFor=\"let m of messages\" [class.mine]=\"m.senderId===uid\"><div><strong>{{m.senderName}}</strong><time>{{m.createdAt|date:'dd/MM/yyyy HH:mm'}}</time></div><p [class.deleted-message]=\"!!m.deletedAt\">{{m.deletedAt?dt(4):m.text}}</p><button type=\"button\" class=\"delete-message\" *ngIf=\"!m.deletedAt\" (click)=\"deleteMessage(m)\" [disabled]=\"!!deleting||sending\">{{deleting===m.id?dt(5):dt(m.senderId===uid?7:2)}}</button></article></div><form (ngSubmit)=\"send()\"><label class=\"sr-only\" for=\"message-draft\">{{t(9)}}</label><textarea id=\"message-draft\" [(ngModel)]=\"draft\" name=\"draft\" maxlength=\"4000\" rows=\"4\" [placeholder]=\"t(9)\" [disabled]=\"sending||!!deleting\"></textarea><div class=\"compose-actions\"><small>{{draft.length}} / 4 000</small><button type=\"submit\" [disabled]=\"!!deleting||contactLoading||sending||!draft.trim()\">{{t(sending?11:10)}}</button></div></form></section><ng-template #choose><section class=\"conversation empty\">{{t(23)}}</section></ng-template></div></main></app-platform-layout>\n";

/***/ }),

/***/ 10845:
/*!***********************************************************!*\
  !*** ./src/app/messaging/prebooking-summary.component.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrebookingSummaryComponent: () => (/* binding */ PrebookingSummaryComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/app/messaging/prebooking-summary.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0%3D!./src/app/messaging/prebooking-summary.component.ts */ 69036);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _booking_inquiry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./booking-inquiry */ 36838);
/* harmony import */ var _prebooking_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prebooking-text */ 20141);








let PrebookingSummaryComponent = class PrebookingSummaryComponent {
  language;
  thread;
  uid = '';
  constructor(language) {
    this.language = language;
  }
  t(i) {
    return (0,_prebooking_text__WEBPACK_IMPORTED_MODULE_3__.prebookingText)(this.language.currentLanguage, i);
  }
  get details() {
    return this.thread?.bookingContext || this.thread?.prebooking;
  }
  get client() {
    return this.thread?.customerId === this.uid;
  }
  get bookingId() {
    return this.thread?.bookingContext?.id || this.thread?.linkedBookingId;
  }
  unitLabel(unit) {
    const copy = {
      fr: ['heure', 'jour', 'nuit'],
      en: ['hour', 'day', 'night'],
      es: ['hora', 'día', 'noche'],
      it: ['ora', 'giorno', 'notte'],
      de: ['Stunde', 'Tag', 'Nacht'],
      nl: ['uur', 'dag', 'nacht'],
      ru: ['час', 'день', 'ночь']
    };
    return (copy[this.language.currentLanguage] || copy.en)[unit === 'hour' ? 0 : unit === 'night' ? 2 : 1];
  }
  query() {
    return (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_2__.bookingQuery)(this.thread);
  }
  bookingPath() {
    return '/' + this.thread.type + '/' + this.thread.assetId + '/' + (this.client ? 'bookings/' : 'admin/reservations/') + this.bookingId;
  }
  static ctorParameters = () => [{
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_1__.LanguageService
  }];
  static propDecorators = {
    thread: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_4__.Input
    }],
    uid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_4__.Input
    }]
  };
};
PrebookingSummaryComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Component)({
  selector: 'app-prebooking-summary',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule],
  template: `<section class="summary" *ngIf="details as p"><h3>{{t(thread.bookingContext?16:1)}}</h3><dl><div><dt>{{t(2)}}</dt><dd>{{p.startAt|date:'dd/MM/yyyy HH:mm'}}</dd></div><div><dt>{{t(3)}}</dt><dd>{{p.endAt|date:'dd/MM/yyyy HH:mm'}}</dd></div><div *ngIf="p.guests"><dt>{{t(8)}}</dt><dd>{{p.guests}}</dd></div><div *ngIf="p.pickupLocation"><dt>{{t(9)}}</dt><dd>{{p.pickupLocation}}</dd></div><div *ngIf="p.returnLocation"><dt>{{t(10)}}</dt><dd>{{p.returnLocation}}</dd></div><div *ngIf="p.vehiclePlate"><dt>{{t(13)}}</dt><dd>{{p.vehiclePlate}}</dd></div></dl><p *ngIf="p.additionalDriver">✓ {{t(11)}}</p><p *ngIf="p.childSeat">✓ {{t(12)}}</p><p *ngIf="p.rentalAmount">{{p.rentalAmount}} {{p.currency}}</p><p *ngIf="!thread.bookingContext&&thread.prebookingRate?.basePrice">{{t(18)}} : {{thread.prebookingRate.basePrice}} {{thread.prebookingRate.currency}} / {{unitLabel(thread.prebookingRate.pricingUnit)}}</p><p *ngIf="!thread.bookingContext">{{t(5)}}</p><a *ngIf="thread.prebooking&&client&&!thread.linkedBookingId" [routerLink]="['/',thread.type,thread.assetId,'reserver']" [queryParams]="query()">{{t(4)}}</a><a *ngIf="bookingId" [routerLink]="bookingPath()">{{t(7)}}</a></section>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_prebooking_summary_component_ts__WEBPACK_IMPORTED_MODULE_0___default())]
})], PrebookingSummaryComponent);


/***/ }),

/***/ 36838:
/*!**********************************************!*\
  !*** ./src/app/messaging/booking-inquiry.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyInquiryForm: () => (/* binding */ applyInquiryForm),
/* harmony export */   bookingQuery: () => (/* binding */ bookingQuery),
/* harmony export */   inquiryFromForm: () => (/* binding */ inquiryFromForm),
/* harmony export */   inquiryFromQuery: () => (/* binding */ inquiryFromQuery),
/* harmony export */   inquiryQuery: () => (/* binding */ inquiryQuery),
/* harmony export */   prebookingRelation: () => (/* binding */ prebookingRelation)
/* harmony export */ });
/* harmony import */ var _services_discovery_search__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/discovery-search */ 74918);

const FIELDS = ['guests', 'pickupLocation', 'returnLocation', 'additionalDriver', 'childSeat', 'driverAge', 'licenseCountry', 'vehiclePlate'];
function inquiryFromForm(type, form) {
  const date = (day, time) => {
    const s = `${day}T${time}`;
    const d = new Date(s + ':00');
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s) || !Number.isFinite(d.getTime()) || (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_0__.localDateTime)(d.toISOString()) !== s) throw Error('invalid_prebooking_dates');
    return d.toISOString();
  };
  const startAt = date(form.startDate, form.startTime),
    endAt = date(form.endDate, form.endTime);
  if (Date.parse(endAt) <= Date.parse(startAt)) throw Error('invalid_prebooking_dates');
  const p = {
    startAt,
    endAt
  };
  const fields = type === 'car' ? ['pickupLocation', 'returnLocation', 'additionalDriver', 'childSeat', 'driverAge', 'licenseCountry'] : type === 'parking' ? ['vehiclePlate'] : ['guests'];
  for (const key of fields) if (form[key] !== undefined) p[key] = form[key];
  return p;
}
function inquiryQuery(type, assetId, p) {
  return {
    contactType: type,
    contactAsset: assetId,
    prebooking: JSON.stringify(p)
  };
}
function inquiryFromQuery(q) {
  const raw = q.get('prebooking');
  if (!raw) return null;
  if (raw.length > 4096) throw Error('invalid_prebooking_details');
  const p = JSON.parse(raw),
    a = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_0__.localDateTime)(p?.startAt || ''),
    b = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_0__.localDateTime)(p?.endAt || '');
  if (!a || !b || Date.parse(p.endAt) <= Date.parse(p.startAt)) throw Error('invalid_prebooking_dates');
  return {
    startAt: new Date(p.startAt).toISOString(),
    endAt: new Date(p.endAt).toISOString(),
    ...Object.fromEntries(FIELDS.filter(k => p[k] !== undefined).map(k => [k, p[k]]))
  };
}
function applyInquiryForm(form, q) {
  try {
    const p = inquiryFromQuery(q);
    if (!p) return;
    for (const k of FIELDS) if (p[k] !== undefined) form[k] = p[k];
  } catch {/* Server validates the eventual request; ignore malformed optional prefills. */}
}
function prebookingRelation(q, startAt, endAt) {
  const id = q.get('prebookingThreadId');
  return id && /^[a-f0-9]{64}$/.test(id) && Date.parse(q.get('startAt') || '') === Date.parse(startAt) && Date.parse(q.get('endAt') || '') === Date.parse(endAt) ? {
    prebookingThreadId: id
  } : {};
}
function bookingQuery(thread) {
  const p = thread.prebooking;
  return p ? {
    startAt: p.startAt,
    endAt: p.endAt,
    prebooking: JSON.stringify(p),
    prebookingThreadId: thread.id
  } : {};
}

/***/ }),

/***/ 42342:
/*!***************************************************************!*\
  !*** ./src/app/messaging/messaging.component.scss?ngResource ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
  background: #f8f6f1;
  color: #123e59;
}

.messaging-shell {
  max-width: 1240px;
  padding: 32px 24px 64px;
  margin: auto;
}

header {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

header > div {
  flex: 1;
}

h1 {
  font-size: 32px;
  margin: 6px 0 24px;
}

h2 {
  font-size: 19px;
  line-height: 1.5;
  margin: 0 0 16px;
}

.eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.connection {
  font-size: 13px;
  color: #8a4a20;
}

.connection.online {
  color: #246342;
}

button {
  cursor: pointer;
  border: 1px solid #b8cdd5;
  border-radius: 9px;
  padding: 11px 16px;
  background: #fff;
  color: #123e59;
  font: inherit;
}

button:disabled {
  cursor: default;
  opacity: 0.55;
}

button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible {
  outline: 3px solid #438ba3;
  outline-offset: 2px;
}

.new-thread {
  background: white;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #d9e2e6;
  margin-bottom: 22px;
}

.new-thread label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 14px;
}

select, input, textarea {
  box-sizing: border-box;
  max-width: 100%;
  width: 100%;
  font: inherit;
  border: 1px solid #b8cdd5;
  border-radius: 9px;
  padding: 12px;
  background: #fff;
  color: #123e59;
}

.chat-layout {
  display: grid;
  grid-template-columns: minmax(260px, 330px) minmax(0, 1fr);
  gap: 22px;
}

aside, .conversation {
  min-width: 0;
  background: white;
  border: 1px solid #d9e2e6;
  border-radius: 16px;
  padding: 22px;
}

aside input {
  margin-bottom: 14px;
}

.thread {
  display: block;
  text-align: left;
  width: 100%;
  margin: 0 0 10px;
  overflow-wrap: anywhere;
}

.thread > span, .thread > strong, .thread > small {
  display: block;
}

.thread > span {
  font-size: 13px;
  margin: 6px 0;
}

.thread.selected {
  background: #edf5f6;
  border-color: #17576c;
}

.preview {
  color: #647887;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.audience {
  font-size: 13px;
  color: #647887;
}

.messages {
  max-height: 520px;
  overflow: auto;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.messages article {
  max-width: 88%;
  padding: 14px 18px;
  background: #f0f4f6;
  border-radius: 13px;
  align-self: flex-start;
}

.messages article.mine {
  align-self: flex-end;
  background: #e8f2e8;
}

.messages article > div {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 13px;
}

.messages time {
  font-size: 11px;
  color: #647887;
}

.messages p {
  font-size: 16px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 9px 0 0;
}

.compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.compose-actions button, .new-thread > button {
  background: #124f63;
  color: white;
}

.error {
  background: #fff0ee;
  color: #9b3428;
  padding: 14px;
  border-radius: 9px;
}

.empty {
  min-height: 220px;
  display: grid;
  place-items: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (max-width: 760px) {
  .messaging-shell {
    padding: 24px 14px;
  }
  .chat-layout {
    grid-template-columns: 1fr;
  }
  aside {
    max-height: 320px;
    overflow: auto;
  }
  .messages article {
    max-width: 94%;
  }
  .conversation {
    padding: 18px;
  }
}
.direct-contact {
  background: #eff7f8;
  padding: 18px;
  border: 1px solid #c9dce2;
  border-radius: 14px;
  margin-bottom: 18px;
}

.direct-contact label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

.direct-contact select {
  max-width: 100%;
  padding: 12px;
  border: 1px solid #b5cbd4;
  border-radius: 8px;
  background: white;
  color: #143d4d;
}

.direct-contact a {
  display: inline-block;
  margin-top: 12px;
}

.chat-layout.direct-layout {
  grid-template-columns: minmax(0, 1fr);
}

.project-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 16px 0;
}

.project-dates > p, .project-actions {
  flex-basis: 100%;
}

.project-dates input {
  padding: 10px;
  border: 1px solid #b5cbd4;
  border-radius: 8px;
  max-width: 100%;
  background: white;
  color: #143d4d;
}

.project-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.project-actions a {
  padding: 10px 14px;
  background: #14556a;
  color: white;
  border-radius: 8px;
  text-decoration: none;
}

.conversation-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.conversation-heading h2 {
  flex: 1;
  min-width: 200px;
}

.delete-action, .delete-message {
  background: transparent !important;
  color: #a42d2d !important;
  border: 1px solid #dcbaba !important;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
}

.delete-message {
  font-size: 12px;
  margin-top: 6px;
  min-height: 32px;
}

.deleted-message {
  font-style: italic;
  opacity: 0.75;
}

.delete-action:disabled, .delete-message:disabled {
  opacity: 0.5;
  cursor: default;
}`, "",{"version":3,"sources":["webpack://./src/app/messaging/messaging.component.scss"],"names":[],"mappings":"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","sourcesContent":[":host{display:block;background:#f8f6f1;color:#123e59}.messaging-shell{max-width:1240px;padding:32px 24px 64px;margin:auto}header{display:flex;align-items:center;gap:18px;flex-wrap:wrap}header>div{flex:1}h1{font-size:32px;margin:6px 0 24px}h2{font-size:19px;line-height:1.5;margin:0 0 16px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.12em}.connection{font-size:13px;color:#8a4a20}.connection.online{color:#246342}button{cursor:pointer;border:1px solid #b8cdd5;border-radius:9px;padding:11px 16px;background:#fff;color:#123e59;font:inherit}button:disabled{cursor:default;opacity:.55}button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #438ba3;outline-offset:2px}.new-thread{background:white;padding:22px;border-radius:16px;border:1px solid #d9e2e6;margin-bottom:22px}.new-thread label{display:flex;flex-direction:column;gap:8px;font-size:14px;margin-bottom:14px}select,input,textarea{box-sizing:border-box;max-width:100%;width:100%;font:inherit;border:1px solid #b8cdd5;border-radius:9px;padding:12px;background:#fff;color:#123e59}.chat-layout{display:grid;grid-template-columns:minmax(260px,330px) minmax(0,1fr);gap:22px}aside,.conversation{min-width:0;background:white;border:1px solid #d9e2e6;border-radius:16px;padding:22px}aside input{margin-bottom:14px}.thread{display:block;text-align:left;width:100%;margin:0 0 10px;overflow-wrap:anywhere}.thread>span,.thread>strong,.thread>small{display:block}.thread>span{font-size:13px;margin:6px 0}.thread.selected{background:#edf5f6;border-color:#17576c}.preview{color:#647887;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.audience{font-size:13px;color:#647887}.messages{max-height:520px;overflow:auto;padding:10px 0;display:flex;flex-direction:column;gap:14px}.messages article{max-width:88%;padding:14px 18px;background:#f0f4f6;border-radius:13px;align-self:flex-start}.messages article.mine{align-self:flex-end;background:#e8f2e8}.messages article>div{display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:13px}.messages time{font-size:11px;color:#647887}.messages p{font-size:16px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;margin:9px 0 0}.compose-actions{display:flex;justify-content:space-between;align-items:center;margin-top:10px}.compose-actions button,.new-thread>button{background:#124f63;color:white}.error{background:#fff0ee;color:#9b3428;padding:14px;border-radius:9px}.empty{min-height:220px;display:grid;place-items:center}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}@media(max-width:760px){.messaging-shell{padding:24px 14px}.chat-layout{grid-template-columns:1fr}aside{max-height:320px;overflow:auto}.messages article{max-width:94%}.conversation{padding:18px}}\n\n.direct-contact{background:#eff7f8;padding:18px;border:1px solid #c9dce2;border-radius:14px;margin-bottom:18px}.direct-contact label{display:flex;flex-direction:column;gap:8px;font-weight:600}.direct-contact select{max-width:100%;padding:12px;border:1px solid #b5cbd4;border-radius:8px;background:white;color:#143d4d}.direct-contact a{display:inline-block;margin-top:12px}\n\n.chat-layout.direct-layout{grid-template-columns:minmax(0,1fr)}\n\n.project-dates{display:flex;flex-wrap:wrap;gap:14px;margin:16px 0}.project-dates>p,.project-actions{flex-basis:100%}.project-dates input{padding:10px;border:1px solid #b5cbd4;border-radius:8px;max-width:100%;background:white;color:#143d4d}.project-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.project-actions a{padding:10px 14px;background:#14556a;color:white;border-radius:8px;text-decoration:none}\n\n.conversation-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}.conversation-heading h2{flex:1;min-width:200px}.delete-action,.delete-message{background:transparent!important;color:#a42d2d!important;border:1px solid #dcbaba!important;border-radius:8px;padding:8px 10px;cursor:pointer}.delete-message{font-size:12px;margin-top:6px;min-height:32px}.deleted-message{font-style:italic;opacity:.75}.delete-action:disabled,.delete-message:disabled{opacity:.5;cursor:default}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 69036:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/messaging/prebooking-summary.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=LnN1bW1hcnl7cGFkZGluZzoxNnB4O2JvcmRlcjoxcHggc29saWQgI2JkZDdkZjtiYWNrZ3JvdW5kOiNmMGY3Zjk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjoxMnB4IDB9LnN1bW1hcnkgaDN7Zm9udC1zaXplOjE4cHg7bWFyZ2luOjAgMCAxMHB4fS5zdW1tYXJ5IGRse2Rpc3BsYXk6ZmxleDtnYXA6MTRweCAyNHB4O2ZsZXgtd3JhcDp3cmFwO21hcmdpbjowfS5zdW1tYXJ5IGR0e2ZvbnQtc2l6ZToxM3B4O2NvbG9yOiM1Nzc0ODB9LnN1bW1hcnkgZGR7Zm9udC13ZWlnaHQ6NjAwO21hcmdpbjo0cHggMH0uc3VtbWFyeSBwe2ZvbnQtc2l6ZToxNHB4O2xpbmUtaGVpZ2h0OjEuNX0uc3VtbWFyeSBhe2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MTBweCAxNHB4O2JhY2tncm91bmQ6IzE0NTU2YTtjb2xvcjp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDt0ZXh0LWRlY29yYXRpb246bm9uZX0%3D!./src/app/messaging/prebooking-summary.component.ts ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.summary{padding:16px;border:1px solid #bdd7df;background:#f0f7f9;border-radius:12px;margin:12px 0}.summary h3{font-size:18px;margin:0 0 10px}.summary dl{display:flex;gap:14px 24px;flex-wrap:wrap;margin:0}.summary dt{font-size:13px;color:#577480}.summary dd{font-weight:600;margin:4px 0}.summary p{font-size:14px;line-height:1.5}.summary a{display:inline-block;padding:10px 14px;background:#14556a;color:white;border-radius:8px;text-decoration:none}`, "",{"version":3,"sources":["webpack://./src/app/messaging/prebooking-summary.component.ts"],"names":[],"mappings":"AAAA,SAAS,YAAY,CAAC,wBAAwB,CAAC,kBAAkB,CAAC,kBAAkB,CAAC,aAAa,CAAC,YAAY,cAAc,CAAC,eAAe,CAAC,YAAY,YAAY,CAAC,aAAa,CAAC,cAAc,CAAC,QAAQ,CAAC,YAAY,cAAc,CAAC,aAAa,CAAC,YAAY,eAAe,CAAC,YAAY,CAAC,WAAW,cAAc,CAAC,eAAe,CAAC,WAAW,oBAAoB,CAAC,iBAAiB,CAAC,kBAAkB,CAAC,WAAW,CAAC,iBAAiB,CAAC,oBAAoB","sourcesContent":[".summary{padding:16px;border:1px solid #bdd7df;background:#f0f7f9;border-radius:12px;margin:12px 0}.summary h3{font-size:18px;margin:0 0 10px}.summary dl{display:flex;gap:14px 24px;flex-wrap:wrap;margin:0}.summary dt{font-size:13px;color:#577480}.summary dd{font-weight:600;margin:4px 0}.summary p{font-size:14px;line-height:1.5}.summary a{display:inline-block;padding:10px 14px;background:#14556a;color:white;border-radius:8px;text-decoration:none}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 71976:
/*!**************************************************!*\
  !*** ./src/app/messaging/messaging.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessagingComponent: () => (/* binding */ MessagingComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _messaging_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./messaging.component.html?ngResource */ 8320);
/* harmony import */ var _messaging_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./messaging.component.scss?ngResource */ 42342);
/* harmony import */ var _messaging_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_messaging_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _message_deletion_text__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./message-deletion-text */ 73457);
/* harmony import */ var _message_unread__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./message-unread */ 87516);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _prebooking_summary_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./prebooking-summary.component */ 10845);
/* harmony import */ var _booking_inquiry__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./booking-inquiry */ 36838);
/* harmony import */ var _prebooking_text__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./prebooking-text */ 20141);
/* harmony import */ var _services_discovery_search__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/discovery-search */ 74918);
/* harmony import */ var _message_presentation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./message-presentation */ 34795);
/* harmony import */ var _asset_contact_text__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./asset-contact-text */ 78194);
/* harmony import */ var _message_notifications_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./message-notifications.service */ 54230);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 2510);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _messaging_text__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./messaging-text */ 17289);

























let MessagingComponent = class MessagingComponent {
  http;
  auth;
  language;
  route;
  notifications;
  router;
  stream;
  prebookingForm = {
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
    guests: 1
  };
  deleting = '';
  contactMode = false;
  contactLoading = false;
  contactInfo = null;
  recipientId = '';
  contactKey = '';
  contactRequest = 0;
  threads = [];
  contexts = [];
  messages = [];
  selected = null;
  contextIndex = '';
  search = '';
  draft = '';
  error = '';
  loading = false;
  sending = false;
  hasMore = false;
  live = 'connecting';
  uid = '';
  readTimer;
  readCursors = new Map();
  reading = '';
  subscriptions = new rxjs__WEBPACK_IMPORTED_MODULE_16__.Subscription();
  destroyed = false;
  debounce;
  selection = 0;
  loadSequence = 0;
  pendingNonce = '';
  pendingText = '';
  constructor(http, auth, language, route, notifications, router) {
    this.http = http;
    this.auth = auth;
    this.language = language;
    this.route = route;
    this.notifications = notifications;
    this.router = router;
  }
  dt(i) {
    return (0,_message_deletion_text__WEBPACK_IMPORTED_MODULE_3__.messageDeletionText)(this.language.currentLanguage, i);
  }
  bt(i) {
    return (0,_prebooking_text__WEBPACK_IMPORTED_MODULE_7__.prebookingText)(this.language.currentLanguage, i);
  }
  inquiryChanged() {
    this.contactRequest++;
    this.contactLoading = false;
    this.selected = null;
    this.messages = [];
    this.selection++;
  }
  get inquiryValid() {
    try {
      (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_6__.inquiryFromForm)(this.contactInfo?.type, this.prebookingForm);
      return true;
    } catch {
      return false;
    }
  }
  bookingQuery() {
    const p = (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_6__.inquiryFromForm)(this.contactInfo.type, this.prebookingForm);
    return (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_6__.bookingQuery)({
      prebooking: p,
      id: this.selected?.id
    });
  }
  ct(i) {
    return (0,_asset_contact_text__WEBPACK_IMPORTED_MODULE_10__.assetContactText)(this.language.currentLanguage, i);
  }
  t(i) {
    return (0,_messaging_text__WEBPACK_IMPORTED_MODULE_15__.messagingText)(this.language.currentLanguage, i);
  }
  get filtered() {
    const q = this.search.toLocaleLowerCase();
    return this.threads.filter(t => (t.assetName + ' ' + t.title + ' ' + (t.bookingId || '')).toLocaleLowerCase().includes(q));
  }
  contextKey(c) {
    return [c.kind, c.type, c.assetId, c.bookingId || '', c.audience].join('|');
  }
  label(t) {
    return (0,_message_presentation__WEBPACK_IMPORTED_MODULE_9__.conversationLabel)(t, this.uid, this.language.currentLanguage);
  }
  audience(t) {
    return (0,_message_presentation__WEBPACK_IMPORTED_MODULE_9__.conversationAudience)(t, this.uid, this.language.currentLanguage);
  }
  pt(i) {
    return (0,_message_presentation__WEBPACK_IMPORTED_MODULE_9__.presentationText)(this.language.currentLanguage, i);
  }
  options() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const u = yield _this.auth.user();
      if (_this.uid && u.uid !== _this.uid) {
        _this.threads = [];
        _this.contexts = [];
        _this.messages = [];
        _this.selected = null;
        _this.readCursors.clear();
        throw Error('session_changed');
      }
      return {
        headers: yield _this.auth.headers()
      };
    })();
  }
  ngOnInit() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        _this2.uid = (yield _this2.auth.user()).uid;
        yield _this2.reload();
        const q = _this2.route.snapshot.queryParamMap;
        yield _this2.contactRoute(q);
        if (q.get('kind')) {
          const i = _this2.contexts.findIndex(c => c.kind === q.get('kind') && c.type === q.get('type') && c.assetId === q.get('assetId') && (c.bookingId || '') === (q.get('bookingId') || '') && c.audience === (q.get('audience') || 'management'));
          if (i >= 0) {
            _this2.contextIndex = _this2.contextKey(_this2.contexts[i]);
            if (q.get('open') === 'moderation' && q.get('kind') === 'subscription') yield _this2.start();
          } else if (q.get('open') === 'moderation') {
            _this2.error = _this2.t(16);
          }
        }
        const threadId = q.get('threadId');
        if (threadId) yield _this2.openRequested(threadId);
        _this2.subscriptions.add(_this2.route.queryParamMap.subscribe(params => {
          void _this2.contactRoute(params);
          const id = params.get('threadId');
          if (id && id !== _this2.selected?.id) void _this2.openRequested(id);
        }));
        _this2.subscriptions.add(_this2.notifications.connection.subscribe(value => _this2.live = value));
        _this2.subscriptions.add(_this2.notifications.changes.subscribe(() => {
          if (!_this2.foreground()) return;
          clearTimeout(_this2.debounce);
          _this2.debounce = setTimeout(() => void _this2.sync(), 100);
        }));
        window.addEventListener('focus', _this2.onForeground);
        window.addEventListener('scroll', _this2.onViewport, {
          capture: true,
          passive: true
        });
        window.addEventListener('resize', _this2.onViewport);
        document.addEventListener('visibilitychange', _this2.onForeground);
        if (_this2.router?.events) _this2.subscriptions.add(_this2.router.events.subscribe(event => {
          if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_17__.NavigationEnd) _this2.onForeground();
        }));
      } catch {
        _this2.error = _this2.t(26);
      }
    })();
  }
  ngOnDestroy() {
    clearTimeout(this.readTimer);
    window.removeEventListener('focus', this.onForeground);
    window.removeEventListener('scroll', this.onViewport, true);
    window.removeEventListener('resize', this.onViewport);
    document.removeEventListener('visibilitychange', this.onForeground);
    this.readCursors.clear();
    this.subscriptions.unsubscribe();
    this.destroyed = true;
    this.contactRequest++;
    this.selection++;
    this.loadSequence++;
    clearTimeout(this.debounce);
  }
  contactRoute(q) {
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const type = q.get('contactType'),
        assetId = q.get('contactAsset'),
        key = type && assetId ? type + '|' + assetId + '|' + (q.get('prebooking') || '') : '';
      if (key === _this3.contactKey) return;
      _this3.contactKey = key;
      _this3.contactMode = !!key;
      _this3.contactInfo = null;
      const request = ++_this3.contactRequest;
      if (!key) {
        _this3.contactLoading = false;
        return;
      }
      _this3.contactLoading = true;
      _this3.error = '';
      _this3.selected = null;
      _this3.messages = [];
      _this3.selection++;
      try {
        const info = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this3.http.get('/api/messaging/contact', {
          ...(yield _this3.options()),
          params: {
            type: type,
            assetId: assetId
          }
        }));
        if (_this3.destroyed || request !== _this3.contactRequest) return;
        yield _this3.options();
        _this3.contactInfo = {
          ...info,
          type,
          assetId
        };
        _this3.recipientId = info.defaultRecipientId;
        _this3.prebookingForm = {
          startDate: '',
          startTime: '09:00',
          endDate: '',
          endTime: '18:00',
          guests: 1
        };
        const p = (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_6__.inquiryFromQuery)(q);
        if (p) {
          const a = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_8__.localDateTime)(p.startAt),
            b = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_8__.localDateTime)(p.endAt);
          _this3.prebookingForm = {
            ..._this3.prebookingForm,
            ...p,
            startDate: a.slice(0, 10),
            startTime: a.slice(11, 16),
            endDate: b.slice(0, 10),
            endTime: b.slice(11, 16)
          };
          yield _this3.changeContact();
        }
      } catch (e) {
        if (request === _this3.contactRequest) _this3.error = _this3.t(e.status === 503 ? 27 : 16);
      } finally {
        if (request === _this3.contactRequest) _this3.contactLoading = false;
      }
    })();
  }
  changeContact() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.contactInfo || _this4.sending || _this4.deleting) return;
      const request = ++_this4.contactRequest;
      _this4.contactLoading = true;
      _this4.error = '';
      try {
        const thread = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this4.http.post('/api/messaging/contact', {
          type: _this4.contactInfo.type,
          assetId: _this4.contactInfo.assetId,
          recipientId: _this4.recipientId,
          prebooking: (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_6__.inquiryFromForm)(_this4.contactInfo.type, _this4.prebookingForm)
        }, yield _this4.options()));
        if (_this4.destroyed || request !== _this4.contactRequest) return;
        yield _this4.options();
        yield _this4.reload();
        if (request === _this4.contactRequest) yield _this4.open(_this4.threads.find(t => t.id === thread.id) || thread);
      } catch (e) {
        if (request === _this4.contactRequest) {
          _this4.error = e.message === 'invalid_prebooking_dates' || e.error?.error?.startsWith('invalid_prebooking') ? _this4.bt(6) : _this4.t(e.status === 503 ? 27 : 16);
          _this4.selected = null;
          _this4.messages = [];
        }
      } finally {
        if (request === _this4.contactRequest) _this4.contactLoading = false;
      }
    })();
  }
  reload() {
    var _this5 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this5.loading = true;
      _this5.error = '';
      try {
        const opts = yield _this5.options();
        const [threads, contexts] = yield Promise.all([(0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this5.http.get('/api/messaging/threads', opts)), (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this5.http.get('/api/messaging/contexts', opts))]);
        if (_this5.destroyed) return;
        yield _this5.options();
        _this5.threads = threads;
        _this5.contexts = contexts;
        if (_this5.selected) {
          const fresh = threads.find(t => t.id === _this5.selected.id);
          if (fresh) _this5.selected = fresh;else {
            _this5.selected = null;
            _this5.messages = [];
            _this5.draft = '';
          }
        }
      } catch (e) {
        _this5.error = _this5.t(e.status === 503 ? 27 : 16);
      } finally {
        _this5.loading = false;
      }
    })();
  }
  start() {
    var _this6 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const c = _this6.contexts.find(c => _this6.contextKey(c) === _this6.contextIndex);
      if (_this6.contextIndex === '' || !c) return;
      _this6.error = '';
      try {
        const t = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this6.http.post('/api/messaging/threads', c, yield _this6.options()));
        if (_this6.destroyed) return;
        yield _this6.reload();
        yield _this6.open(_this6.threads.find(x => x.id === t.id) || t);
      } catch {
        _this6.error = _this6.t(16);
      }
    })();
  }
  openRequested(id) {
    var _this7 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this7.deleting || _this7.sending) return;
      const existing = _this7.threads.find(t => t.id === id);
      if (existing) {
        yield _this7.open(existing);
        return;
      }
      try {
        const thread = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this7.http.post(`/api/messaging/threads/${id}/open`, {}, yield _this7.options()));
        if (_this7.destroyed) return;
        yield _this7.options();
        yield _this7.reload();
        yield _this7.open(_this7.threads.find(t => t.id === id) || thread);
      } catch {
        _this7.error = _this7.t(16);
      }
    })();
  }
  deleteConversation() {
    var _this8 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const thread = _this8.selected;
      if (!thread || _this8.deleting || _this8.sending || !window.confirm(_this8.dt(1))) return;
      _this8.deleting = 'conversation';
      _this8.error = '';
      _this8.selection++;
      _this8.loadSequence++;
      clearTimeout(_this8.readTimer);
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this8.http.delete(`/api/messaging/threads/${thread.id}`, yield _this8.options()));
        if (_this8.destroyed) return;
        yield _this8.options();
        if (_this8.selected?.id === thread.id) {
          _this8.selected = null;
          _this8.messages = [];
          _this8.draft = '';
          _this8.hasMore = false;
        }
        _this8.threads = _this8.threads.filter(t => t.id !== thread.id);
        yield _this8.reload();
        void _this8.notifications.refresh();
      } catch {
        if (!_this8.destroyed) _this8.error = _this8.dt(6);
      } finally {
        _this8.deleting = '';
      }
    })();
  }
  deleteMessage(message) {
    var _this9 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const thread = _this9.selected;
      if (!thread || message.deletedAt || _this9.deleting || _this9.sending || !window.confirm(_this9.dt(message.senderId === _this9.uid ? 8 : 3))) return;
      _this9.deleting = message.id;
      _this9.error = '';
      _this9.loadSequence++;
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this9.http.delete(`/api/messaging/threads/${thread.id}/messages/${message.id}`, yield _this9.options()));
        if (_this9.destroyed) return;
        yield _this9.options();
        _this9.messages = _this9.messages.filter(m => m.id !== message.id);
        yield _this9.reload();
        if (_this9.selected?.id === thread.id) yield _this9.history();
        void _this9.notifications.refresh();
      } catch {
        if (!_this9.destroyed) _this9.error = _this9.dt(6);
      } finally {
        _this9.deleting = '';
      }
    })();
  }
  open(thread) {
    var _this10 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this10.sending || _this10.deleting) return;
      _this10.selected = thread;
      _this10.messages = [];
      _this10.draft = '';
      _this10.pendingNonce = '';
      _this10.pendingText = '';
      _this10.error = '';
      _this10.hasMore = false;
      _this10.selection++;
      yield _this10.history();
    })();
  }
  history(older = false) {
    var _this11 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const t = _this11.selected;
      if (!t) return;
      const seq = _this11.selection,
        n = ++_this11.loadSequence,
        el = _this11.stream?.nativeElement,
        oldHeight = el?.scrollHeight || 0,
        nearBottom = !_this11.messages.length || !el || el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      try {
        const opts = yield _this11.options();
        const params = older && _this11.messages[0] ? {
          before: String(_this11.messages[0].id)
        } : {};
        const r = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this11.http.get(`/api/messaging/threads/${t.id}/messages`, {
          ...opts,
          params
        }));
        if (_this11.destroyed || seq !== _this11.selection || n !== _this11.loadSequence) return;
        yield _this11.options();
        _this11.messages = older ? [...r.messages, ..._this11.messages] : r.messages;
        _this11.hasMore = r.hasMore;
        requestAnimationFrame(() => {
          const e = _this11.stream?.nativeElement;
          if (e && seq === _this11.selection) {
            if (older) e.scrollTop += e.scrollHeight - oldHeight;else if (nearBottom) e.scrollTop = e.scrollHeight;
            if (!older) _this11.scheduleRead(seq);
          }
        });
      } catch {
        if (seq === _this11.selection) {
          _this11.error = _this11.t(16);
          _this11.selected = null;
          _this11.messages = [];
        }
      }
    })();
  }
  pageUrl() {
    return this.router?.url || (typeof location === 'undefined' ? '' : location.pathname);
  }
  foreground() {
    return !this.destroyed && (0,_message_unread__WEBPACK_IMPORTED_MODULE_4__.messagesPage)(this.pageUrl()) && typeof document !== 'undefined' && document.visibilityState === 'visible' && document.hasFocus();
  }
  onViewport = () => {
    if (this.foreground()) this.scheduleRead();
  };
  onForeground = () => {
    if (this.foreground()) void this.sync();
  };
  scheduleRead(seq = this.selection) {
    clearTimeout(this.readTimer);
    this.readTimer = setTimeout(() => {
      if (seq === this.selection) void this.markVisibleRead();
    }, 0);
  }
  readVisible() {
    this.scheduleRead();
  }
  mayRead(threadId) {
    if (this.deleting) return false;
    const e = this.stream?.nativeElement,
      rect = e?.getBoundingClientRect();
    return (0,_message_unread__WEBPACK_IMPORTED_MODULE_4__.readAllowed)({
      url: this.pageUrl(),
      visible: typeof document !== 'undefined' && document.visibilityState === 'visible',
      focused: typeof document !== 'undefined' && document.hasFocus(),
      threadId,
      selectedId: this.selected?.id || '',
      streamVisible: !!e && e.getClientRects().length > 0 && !!rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth,
      atBottom: !!e && e.scrollHeight - e.scrollTop - e.clientHeight < 100
    });
  }
  markVisibleRead() {
    var _this12 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const t = _this12.selected,
        last = _this12.messages[_this12.messages.length - 1],
        seq = _this12.selection;
      if (!t || !last || !_this12.mayRead(t.id)) return;
      const key = _this12.uid + '|' + t.id;
      if (_this12.readCursors.get(key) === last.id || _this12.reading === key + '|' + last.id) return;
      _this12.reading = key + '|' + last.id;
      try {
        const opts = yield _this12.options();
        if (_this12.destroyed || seq !== _this12.selection || !_this12.mayRead(t.id)) return;
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this12.http.post(`/api/messaging/threads/${t.id}/read`, {
          lastMessageId: last.id
        }, opts));
        if (_this12.destroyed || seq !== _this12.selection) return;
        _this12.readCursors.set(key, last.id);
        const item = _this12.threads.find(x => x.id === t.id);
        if (item) item.unread = false;
        void _this12.notifications.refresh();
      } catch {/* Keep unread badge when acknowledgement fails. */} finally {
        if (_this12.reading === key + '|' + last.id) _this12.reading = '';
      }
    })();
  }
  older() {
    if (!this.deleting) void this.history(true);
  }
  send() {
    var _this13 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this13.deleting || _this13.contactLoading || _this13.sending || !_this13.selected || !_this13.draft.trim() || _this13.draft.trim().length > 4000) return;
      const t = _this13.selected,
        seq = _this13.selection,
        text = _this13.draft.trim();
      _this13.sending = true;
      _this13.error = '';
      if (_this13.pendingText !== text || !_this13.pendingNonce) {
        _this13.pendingText = text;
        _this13.pendingNonce = crypto.randomUUID();
      }
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.firstValueFrom)(_this13.http.post(`/api/messaging/threads/${t.id}/messages`, {
          text,
          nonce: _this13.pendingNonce
        }, yield _this13.options()));
        if (_this13.destroyed || seq !== _this13.selection) return;
        _this13.draft = '';
        _this13.pendingNonce = '';
        _this13.pendingText = '';
        yield _this13.history();
        yield _this13.reload();
        void _this13.notifications.refresh();
      } catch (e) {
        _this13.error = _this13.t(e.status === 429 ? 25 : 18);
      } finally {
        _this13.sending = false;
      }
    })();
  }
  sync() {
    var _this14 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this14.deleting) return;
      yield _this14.reload();
      if (_this14.selected) yield _this14.history();
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_19__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_13__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_14__.LanguageService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_17__.ActivatedRoute
  }, {
    type: _message_notifications_service__WEBPACK_IMPORTED_MODULE_11__.MessageNotificationsService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_17__.Router
  }];
  static propDecorators = {
    stream: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_20__.ViewChild,
      args: ['messageStream']
    }]
  };
};
MessagingComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_21__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_20__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_22__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_23__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_24__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_12__.PlatformLayoutComponent, _prebooking_summary_component__WEBPACK_IMPORTED_MODULE_5__.PrebookingSummaryComponent],
  template: _messaging_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_messaging_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], MessagingComponent);


/***/ }),

/***/ 73457:
/*!****************************************************!*\
  !*** ./src/app/messaging/message-deletion-text.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   messageDeletionText: () => (/* binding */ messageDeletionText)
/* harmony export */ });
const COPY = {
  fr: ['Supprimer la conversation', 'Supprimer cette conversation et son historique de votre côté ? Les autres participants conserveront leurs messages.', 'Supprimer pour moi', 'Supprimer ce message uniquement de votre côté ? Les autres participants le conserveront.', 'Message supprimé', 'Suppression…', 'Impossible de supprimer. Vérifiez vos accès et réessayez.', "Supprimer pour tous", "Supprimer votre message pour tous les participants ? Son texte sera remplacé par « Message supprimé »."],
  en: ['Delete conversation', 'Delete this conversation and its history for you? Other participants will keep their messages.', 'Delete for me', 'Delete this message only for you? Other participants will keep it.', 'Message deleted', 'Deleting…', 'Could not delete. Check your access and try again.', "Delete for everyone", "Delete your message for every participant? Its text will be replaced with “Message deleted”."],
  es: ['Eliminar conversación', '¿Eliminar esta conversación y su historial solo para usted? Los demás participantes conservarán sus mensajes.', 'Eliminar para mí', '¿Eliminar este mensaje solo para usted? Los demás participantes lo conservarán.', 'Mensaje eliminado', 'Eliminando…', 'No se pudo eliminar. Compruebe sus permisos e inténtelo de nuevo.', "Eliminar para todos", "¿Eliminar su mensaje para todos? Se sustituirá por «Mensaje eliminado»."],
  it: ['Elimina conversazione', 'Eliminare la conversazione e la cronologia solo per te? Gli altri partecipanti conserveranno i messaggi.', 'Elimina per me', 'Eliminare il messaggio solo per te? Gli altri partecipanti lo conserveranno.', 'Messaggio eliminato', 'Eliminazione…', 'Impossibile eliminare. Verifica gli accessi e riprova.', "Elimina per tutti", "Eliminare il tuo messaggio per tutti? Sarà sostituito da «Messaggio eliminato»."],
  de: ['Gespräch löschen', 'Gespräch und Verlauf nur für Sie löschen? Andere Teilnehmer behalten ihre Nachrichten.', 'Für mich löschen', 'Nachricht nur für Sie löschen? Andere Teilnehmer behalten sie.', 'Nachricht gelöscht', 'Wird gelöscht…', 'Löschen fehlgeschlagen. Prüfen Sie Ihren Zugriff.', "Für alle löschen", "Ihre Nachricht für alle löschen? Sie wird durch „Nachricht gelöscht“ ersetzt."],
  nl: ['Gesprek verwijderen', 'Dit gesprek en de geschiedenis alleen voor u verwijderen? Andere deelnemers behouden hun berichten.', 'Voor mij verwijderen', 'Dit bericht alleen voor u verwijderen? Andere deelnemers behouden het.', 'Bericht verwijderd', 'Verwijderen…', 'Verwijderen mislukt. Controleer uw toegang en probeer opnieuw.', "Voor iedereen verwijderen", "Uw bericht voor iedereen verwijderen? Het wordt vervangen door “Bericht verwijderd”."],
  ru: ['Удалить переписку', 'Удалить переписку и историю только для вас? У других участников сообщения сохранятся.', 'Удалить у меня', 'Удалить сообщение только у вас? У других участников оно сохранится.', 'Сообщение удалено', 'Удаление…', 'Не удалось удалить. Проверьте права доступа и повторите попытку.', "Удалить у всех", "Удалить ваше сообщение у всех? Оно будет заменено на «Сообщение удалено»."]
};
const messageDeletionText = (language, index) => (COPY[language] || COPY.en)[index];

/***/ })

}]);
//# sourceMappingURL=src_app_messaging_messaging_component_ts.js.map