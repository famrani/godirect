(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_assets_car_car_module_ts"],{

/***/ 5523:
/*!******************************************!*\
  !*** ./src/app/assets/car/car.module.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarModule: () => (/* binding */ CarModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ionic/angular */ 21507);
/* harmony import */ var _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../layout/layout.module */ 48177);
/* harmony import */ var _car_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./car-routing.module */ 89866);
/* harmony import */ var _pages_home_car_home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/home/car-home.component */ 60283);
/* harmony import */ var _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/details/car-detail.component */ 71644);
/* harmony import */ var _pages_booking_car_booking_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/booking/car-booking.component */ 34445);
/* harmony import */ var _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/resource-route.pipe */ 19337);












let CarModule = class CarModule {};
CarModule = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.NgModule)({
  declarations: [_pages_home_car_home_component__WEBPACK_IMPORTED_MODULE_3__.CarHomeComponent, _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__.CarDetailComponent, _pages_booking_car_booking_component__WEBPACK_IMPORTED_MODULE_5__.CarBookingComponent],
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonicModule, _layout_layout_module__WEBPACK_IMPORTED_MODULE_1__.LayoutModule, _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_6__.ResourceRoutePipe, _car_routing_module__WEBPACK_IMPORTED_MODULE_2__.CarRoutingModule]
})], CarModule);


/***/ }),

/***/ 7501:
/*!**************************************************************************!*\
  !*** ./src/app/assets/car/pages/home/car-home.component.scss?ngResource ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
}

.car-landing {
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 24px 36px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: 52px;
  align-items: center;
}

.car-landing__media {
  min-width: 0;
}

.car-landing__image, .car-landing__placeholder {
  width: 100%;
  aspect-ratio: 16/10;
  border-radius: 22px;
}

.car-landing__image {
  display: block;
  object-fit: cover;
  box-shadow: 0 18px 48px rgba(8, 38, 58, 0.14);
}

.car-landing__placeholder {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #eef3f5, #fbf8f2);
  border: 1px solid rgba(8, 38, 58, 0.12);
  color: #08263a;
}

.car-landing__placeholder-icon {
  font-size: 4rem;
}

.car-landing__placeholder strong {
  font-size: 1.35rem;
}

.car-landing__placeholder span {
  opacity: 0.7;
}

.car-landing__thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.car-landing__thumbs button {
  width: 86px;
  height: 58px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  background: none;
  cursor: pointer;
  flex: 0 0 auto;
}

.car-landing__thumbs button.active {
  border-color: #f28c28;
}

.car-landing__thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0b6e8f;
}

.car-landing h1 {
  margin: 0;
  color: #08263a;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  line-height: 0.98;
}

.lead {
  margin: 18px 0 0;
  font-size: 1.25rem;
  line-height: 1.55;
  color: #44515c;
}

.car-landing__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}

.car-landing__facts span {
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(8, 38, 58, 0.13);
  font-size: 0.9rem;
}

.car-landing__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 22px 0;
  color: #667085;
}

.car-landing__price strong {
  font-size: 2rem;
  color: #08263a;
}

.car-landing__description {
  font-size: 1rem;
  line-height: 1.7;
  color: #2f3a45;
}

.car-landing__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.car-landing__actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  padding: 13px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
}

.car-landing__actions .btn-primary {
  background: #f28c28;
  color: #fff;
}

.car-landing__actions .btn-secondary {
  background: #e8f4f7;
  color: #08263a;
}

.car-landing__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 20px;
  font-size: 0.86rem;
  color: #667085;
}

.car-info {
  max-width: 1180px;
  margin: 0 auto 64px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.car-info article {
  padding: 24px;
  border: 1px solid rgba(8, 38, 58, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.55);
}

.car-info h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
  color: #08263a;
}

.car-info p, .car-info li {
  line-height: 1.6;
}

.car-info ul {
  padding-left: 18px;
  margin: 0;
}

.loading {
  padding: 80px 24px;
  text-align: center;
}

@media (max-width: 850px) {
  .car-landing {
    grid-template-columns: 1fr;
    padding-top: 30px;
    gap: 30px;
  }
  .car-info {
    grid-template-columns: 1fr;
  }
  .car-landing__content {
    order: -1;
  }
}
@media (max-width: 520px) {
  .car-landing {
    padding-left: 16px;
    padding-right: 16px;
  }
  .car-info {
    padding-left: 16px;
    padding-right: 16px;
  }
  .car-landing h1 {
    font-size: 2.6rem;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/assets/car/pages/home/car-home.component.scss"],"names":[],"mappings":"AAAA;EAAM,cAAA;AAEN;;AAFoB;EAAa,iBAAA;EAAiB,cAAA;EAAc,uBAAA;EAAuB,aAAA;EAAa,8DAAA;EAA2D,SAAA;EAAS,mBAAA;AAYxK;;AAZ2L;EAAoB,YAAA;AAgB/M;;AAhB2N;EAA8C,WAAA;EAAW,mBAAA;EAAmB,mBAAA;AAsBvS;;AAtB0T;EAAoB,cAAA;EAAc,iBAAA;EAAiB,6CAAA;AA4B7W;;AA5BsZ;EAA0B,sBAAA;EAAsB,aAAA;EAAa,sBAAA;EAAsB,mBAAA;EAAmB,uBAAA;EAAuB,QAAA;EAAQ,qDAAA;EAAmD,uCAAA;EAAmC,cAAA;AAwCjnB;;AAxC+nB;EAA+B,eAAA;AA4C9pB;;AA5C6qB;EAAiC,kBAAA;AAgD9sB;;AAhDguB;EAA+B,YAAA;AAoD/vB;;AApD0wB;EAAqB,aAAA;EAAa,SAAA;EAAS,gBAAA;EAAgB,gBAAA;EAAgB,mBAAA;AA4Dr1B;;AA5Dw2B;EAA4B,WAAA;EAAW,YAAA;EAAY,UAAA;EAAU,6BAAA;EAA6B,mBAAA;EAAmB,gBAAA;EAAgB,gBAAA;EAAgB,eAAA;EAAe,cAAA;AAwEpgC;;AAxEkhC;EAAmC,qBAAA;AA4ErjC;;AA5E0kC;EAAyB,WAAA;EAAW,YAAA;EAAY,iBAAA;AAkF1nC;;AAlF2oC;EAAS,eAAA;EAAe,yBAAA;EAAyB,sBAAA;EAAqB,kBAAA;EAAiB,gBAAA;EAAgB,cAAA;AA2FlvC;;AA3FgwC;EAAgB,SAAA;EAAS,cAAA;EAAc,qCAAA;EAAmC,iBAAA;AAkG10C;;AAlG01C;EAAM,gBAAA;EAAgB,kBAAA;EAAkB,iBAAA;EAAiB,cAAA;AAyGn5C;;AAzGi6C;EAAoB,aAAA;EAAa,eAAA;EAAe,QAAA;EAAQ,cAAA;AAgHz9C;;AAhHu+C;EAAyB,iBAAA;EAAiB,oBAAA;EAAoB,gBAAA;EAAgB,uCAAA;EAAmC,iBAAA;AAwHxlD;;AAxHwmD;EAAoB,aAAA;EAAa,qBAAA;EAAqB,QAAA;EAAQ,cAAA;EAAc,cAAA;AAgIprD;;AAhIksD;EAA2B,eAAA;EAAe,cAAA;AAqI5uD;;AArI0vD;EAA0B,eAAA;EAAe,gBAAA;EAAgB,cAAA;AA2InzD;;AA3Ii0D;EAAsB,aAAA;EAAa,SAAA;EAAS,eAAA;EAAe,gBAAA;AAkJ53D;;AAlJ44D;EAAwB,oBAAA;EAAoB,mBAAA;EAAmB,uBAAA;EAAuB,gBAAA;EAAgB,kBAAA;EAAkB,mBAAA;EAAmB,qBAAA;EAAqB,gBAAA;AA6J5iE;;AA7J4jE;EAAmC,mBAAA;EAAmB,WAAA;AAkKlnE;;AAlK6nE;EAAqC,mBAAA;EAAmB,cAAA;AAuKrrE;;AAvKmsE;EAAmB,aAAA;EAAa,eAAA;EAAe,SAAA;EAAS,gBAAA;EAAgB,kBAAA;EAAiB,cAAA;AAgL5xE;;AAhL0yE;EAAU,iBAAA;EAAiB,mBAAA;EAAmB,eAAA;EAAe,aAAA;EAAa,qCAAA;EAAoC,SAAA;AAyLx5E;;AAzLi6E;EAAkB,aAAA;EAAa,sCAAA;EAAkC,mBAAA;EAAmB,qCAAA;AAgMr/E;;AAhMshF;EAAa,gBAAA;EAAgB,iBAAA;EAAiB,cAAA;AAsMpkF;;AAtMklF;EAAyB,gBAAA;AA0M3mF;;AA1M2nF;EAAa,kBAAA;EAAkB,SAAA;AA+M1pF;;AA/MmqF;EAAS,kBAAA;EAAkB,kBAAA;AAoN9rF;;AApNgtF;EAAwB;IAAa,0BAAA;IAA0B,iBAAA;IAAiB,SAAA;EA2N9xF;EA3NuyF;IAAU,0BAAA;EA8NjzF;EA9N20F;IAAsB,SAAA;EAiOj2F;AACF;AAlO62F;EAAwB;IAAa,kBAAA;IAAkB,mBAAA;EAuOl6F;EAvOq7F;IAAU,kBAAA;IAAkB,mBAAA;EA2Oj9F;EA3Oo+F;IAAgB,iBAAA;EA8Op/F;AACF","sourcesContent":[":host{display:block}.car-landing{max-width:1180px;margin:0 auto;padding:48px 24px 36px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(340px,.85fr);gap:52px;align-items:center}.car-landing__media{min-width:0}.car-landing__image,.car-landing__placeholder{width:100%;aspect-ratio:16/10;border-radius:22px}.car-landing__image{display:block;object-fit:cover;box-shadow:0 18px 48px rgba(8,38,58,.14)}.car-landing__placeholder{box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#eef3f5,#fbf8f2);border:1px solid rgba(8,38,58,.12);color:#08263a}.car-landing__placeholder-icon{font-size:4rem}.car-landing__placeholder strong{font-size:1.35rem}.car-landing__placeholder span{opacity:.7}.car-landing__thumbs{display:flex;gap:10px;margin-top:12px;overflow-x:auto;padding-bottom:4px}.car-landing__thumbs button{width:86px;height:58px;padding:0;border:2px solid transparent;border-radius:10px;overflow:hidden;background:none;cursor:pointer;flex:0 0 auto}.car-landing__thumbs button.active{border-color:#f28c28}.car-landing__thumbs img{width:100%;height:100%;object-fit:cover}.eyebrow{margin:0 0 8px;text-transform:uppercase;letter-spacing:.14em;font-size:.75rem;font-weight:700;color:#0b6e8f}.car-landing h1{margin:0;color:#08263a;font-size:clamp(2.6rem,5vw,4.8rem);line-height:.98}.lead{margin:18px 0 0;font-size:1.25rem;line-height:1.55;color:#44515c}.car-landing__facts{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0}.car-landing__facts span{padding:8px 12px;border-radius:999px;background:#fff;border:1px solid rgba(8,38,58,.13);font-size:.9rem}.car-landing__price{display:flex;align-items:baseline;gap:8px;margin:22px 0;color:#667085}.car-landing__price strong{font-size:2rem;color:#08263a}.car-landing__description{font-size:1rem;line-height:1.7;color:#2f3a45}.car-landing__actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.car-landing__actions a{display:inline-flex;align-items:center;justify-content:center;min-width:130px;padding:13px 20px;border-radius:10px;text-decoration:none;font-weight:700}.car-landing__actions .btn-primary{background:#f28c28;color:#fff}.car-landing__actions .btn-secondary{background:#e8f4f7;color:#08263a}.car-landing__meta{display:flex;flex-wrap:wrap;gap:18px;margin-top:20px;font-size:.86rem;color:#667085}.car-info{max-width:1180px;margin:0 auto 64px;padding:0 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.car-info article{padding:24px;border:1px solid rgba(8,38,58,.1);border-radius:16px;background:rgba(255,255,255,.55)}.car-info h2{margin:0 0 12px;font-size:1.2rem;color:#08263a}.car-info p,.car-info li{line-height:1.6}.car-info ul{padding-left:18px;margin:0}.loading{padding:80px 24px;text-align:center}@media(max-width:850px){.car-landing{grid-template-columns:1fr;padding-top:30px;gap:30px}.car-info{grid-template-columns:1fr}.car-landing__content{order:-1}}@media(max-width:520px){.car-landing{padding-left:16px;padding-right:16px}.car-info{padding-left:16px;padding-right:16px}.car-landing h1{font-size:2.6rem}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 34445:
/*!*******************************************************************!*\
  !*** ./src/app/assets/car/pages/booking/car-booking.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarBookingComponent: () => (/* binding */ CarBookingComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _car_booking_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./car-booking.component.html?ngResource */ 87051);
/* harmony import */ var _car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./car-booking.component.scss?ngResource */ 63603);
/* harmony import */ var _car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _services_ui_text_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/ui-text.service */ 16272);
/* harmony import */ var _services_discovery_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/discovery-search */ 74918);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var godigital_lib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! godigital-lib */ 22464);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 93262);












let CarBookingComponent = class CarBookingComponent {
  route;
  router;
  http;
  storeDb;
  uiText = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_services_ui_text_service__WEBPACK_IMPORTED_MODULE_3__.UiTextService);
  assetId = '';
  adminMode = false;
  authRequired = false;
  asset = null;
  quote = null;
  quotedPayload = '';
  saving = false;
  calculating = false;
  message = '';
  error = '';
  quoteRequestId = 0;
  hasCalculated = false;
  form = {
    customerId: 'guest',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
    pickupLocation: '',
    returnLocation: '',
    driverAge: 25,
    licenseCountry: 'FR',
    additionalDriver: false,
    childSeat: false,
    comments: ''
  };
  constructor(route, router, http, storeDb) {
    this.route = route;
    this.router = router;
    this.http = http;
    this.storeDb = storeDb;
  }
  get authUser() {
    const db = this.storeDb;
    return db.firebaseauth?.currentUser || db.firebaseAuth?.currentUser || db.auth?.currentUser || null;
  }
  syncCustomer() {
    const u = this.authUser;
    if (!u) return;
    if (!this.adminMode) {
      this.form.customerId = u.uid;
      this.form.customerEmail = u.email || '';
      this.form.customerName = this.form.customerName || u.displayName || '';
    }
    this.authRequired = false;
  }
  login() {
    const returnUrl = this.router.url;
    this.router.navigate(['/car', this.assetId, 'login'], {
      queryParams: {
        returnUrl
      }
    });
  }
  signup() {
    const returnUrl = this.router.url;
    this.router.navigate(['/car', this.assetId, 'signup'], {
      queryParams: {
        returnUrl
      }
    });
  }
  bookingHeaders() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const u = _this.authUser;
      if (!u?.getIdToken) throw new Error('Veuillez vous connecter pour réserver.');
      return new _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpHeaders({
        Authorization: 'Bearer ' + (yield u.getIdToken())
      });
    })();
  }
  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    const start = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_4__.localDateTime)(q.get('startAt') || ''),
      end = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_4__.localDateTime)(q.get('endAt') || '');
    if (start && end && Date.parse(q.get('endAt') || '') > Date.parse(q.get('startAt') || '')) {
      this.form.startDate = start.slice(0, 10);
      this.form.startTime = start.slice(11, 16);
      this.form.endDate = end.slice(0, 10);
      this.form.endTime = end.slice(11, 16);
    }
    this.adminMode = this.route.snapshot.queryParamMap.get('admin') === '1';
    this.syncCustomer();
    this.authRequired = !this.authUser;
    this.assetId = String(this.route.parent?.snapshot.paramMap.get('assetId') || '');
    this.http.get(`/api/assets/${encodeURIComponent(this.assetId)}`).subscribe({
      next: a => {
        this.asset = a;
        this.form.pickupLocation = a?.location?.city || '';
        this.form.returnLocation = this.form.pickupLocation;
      },
      error: () => this.error = 'Voiture introuvable.'
    });
  }
  get quoteIsCurrent() {
    return !!this.quote && this.quotedPayload === this.pricingSignature();
  }
  pricingSignature() {
    const p = this.payload();
    return JSON.stringify({
      assetId: p.assetId,
      startAt: p.startAt,
      endAt: p.endAt,
      additionalDriver: p.additionalDriver,
      childSeat: p.childSeat
    });
  }
  onBookingChanged() {
    this.quoteRequestId++;
    this.quote = null;
    this.quotedPayload = '';
    this.message = '';
    this.error = '';
    this.calculating = false;
  }
  onCustomerChanged() {
    this.message = '';
    this.error = '';
  }
  onOptionChanged() {
    const shouldRecalculate = this.hasCalculated;
    this.onBookingChanged();
    if (shouldRecalculate) this.calculate();
  }
  payload() {
    return {
      assetId: this.assetId,
      customerId: this.adminMode ? this.form.customerId || 'external' : this.authUser?.uid || '',
      customerName: this.form.customerName,
      customerEmail: this.form.customerEmail,
      customerPhone: this.form.customerPhone,
      startAt: new Date(`${this.form.startDate}T${this.form.startTime}:00`).toISOString(),
      endAt: new Date(`${this.form.endDate}T${this.form.endTime}:00`).toISOString(),
      pickupLocation: this.form.pickupLocation,
      returnLocation: this.form.returnLocation,
      driverAge: Number(this.form.driverAge),
      licenseCountry: this.form.licenseCountry,
      additionalDriver: !!this.form.additionalDriver,
      childSeat: !!this.form.childSeat,
      comments: this.form.comments
    };
  }
  datesValid() {
    const start = String(this.form.startDate || '');
    const end = String(this.form.endDate || '');
    const timeStart = String(this.form.startTime || '');
    const timeEnd = String(this.form.endTime || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || !/^\d{2}:\d{2}$/.test(timeStart) || !/^\d{2}:\d{2}$/.test(timeEnd)) return false;
    const a = new Date(`${start}T${timeStart}:00`),
      b = new Date(`${end}T${timeEnd}:00`);
    return Number.isFinite(a.getTime()) && Number.isFinite(b.getTime()) && b.getTime() > a.getTime();
  }
  calculate() {
    this.error = '';
    this.quote = null;
    this.quotedPayload = '';
    if (!this.datesValid()) {
      this.calculating = false;
      this.error = 'Sélectionnez des dates et heures valides : la restitution doit être après la prise en charge.';
      return;
    }
    const p = this.payload();
    const signature = this.pricingSignature();
    const requestId = ++this.quoteRequestId;
    this.calculating = true;
    this.http.post('/api/car-bookings/quote', p).subscribe({
      next: q => {
        if (requestId !== this.quoteRequestId || signature !== this.pricingSignature()) return;
        this.quote = q;
        this.quotedPayload = signature;
        this.calculating = false;
        this.hasCalculated = true;
      },
      error: e => {
        if (requestId !== this.quoteRequestId) return;
        this.calculating = false;
        this.error = e?.error?.error === 'asset_unavailable' ? this.uiText.text('Indisponible pour cette période.') : this.uiText.text('Impossible de calculer le prix') + (e?.error?.error ? ' : ' + this.uiText.text(e.error.error) : '');
      }
    });
  }
  book() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.error = '';
      _this2.message = '';
      if (!_this2.authUser) {
        _this2.authRequired = true;
        _this2.error = 'Connectez-vous ou créez un compte pour réserver.';
        return;
      }
      _this2.syncCustomer();
      if (!_this2.datesValid()) {
        _this2.error = 'Dates de réservation invalides.';
        return;
      }
      if (!_this2.form.customerName?.trim() || !/^\S+@\S+\.\S+$/.test(String(_this2.form.customerEmail || ''))) {
        _this2.error = 'Renseignez le nom du conducteur et une adresse e-mail valide.';
        return;
      }
      if (!_this2.quoteIsCurrent) {
        _this2.error = 'Calculez le prix avant de demander la réservation.';
        return;
      }
      _this2.saving = true;
      const p = _this2.payload();
      const signature = _this2.pricingSignature();
      let headers;
      try {
        headers = yield _this2.bookingHeaders();
      } catch (e) {
        _this2.saving = false;
        _this2.error = e.message;
        return;
      }
      _this2.http.post('/api/car-bookings' + (_this2.adminMode ? '?admin=1' : ''), p, {
        headers
      }).subscribe({
        next: b => {
          _this2.saving = false;
          _this2.message = _this2.uiText.text('Demande de réservation créée : {id}').replace('{id}', String(b.id));
          _this2.quote = b.pricing;
          _this2.quotedPayload = signature;
        },
        error: e => {
          _this2.saving = false;
          _this2.error = e?.error?.error === 'asset_unavailable' ? _this2.uiText.text('Indisponible pour cette période.') : _this2.uiText.text('Impossible de créer la réservation') + (e?.error?.error ? ' : ' + _this2.uiText.text(e.error.error) : '');
        }
      });
    })();
  }
  static ctorParameters = () => [{
    type: _angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_7__.Router
  }, {
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient
  }, {
    type: godigital_lib__WEBPACK_IMPORTED_MODULE_8__.StoreDbService
  }];
};
CarBookingComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_9__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.Component)({
  selector: 'app-car-booking',
  template: _car_booking_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: false,
  styles: [(_car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], CarBookingComponent);


/***/ }),

/***/ 60283:
/*!*************************************************************!*\
  !*** ./src/app/assets/car/pages/home/car-home.component.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarHomeComponent: () => (/* binding */ CarHomeComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _car_home_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./car-home.component.html?ngResource */ 60361);
/* harmony import */ var _car_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./car-home.component.scss?ngResource */ 7501);
/* harmony import */ var _car_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_car_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_asset_photos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/asset-photos */ 19009);
/* harmony import */ var _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../home/site-content-service/site-content.service */ 73196);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/language.service */ 48756);
/* harmony import */ var _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/asset-page-i18n */ 94700);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _services_resource_context_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/resource-context.service */ 54560);
/* harmony import */ var _services_private_media_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/private-media.service */ 71260);












let CarHomeComponent = class CarHomeComponent {
  http;
  ctx;
  media;
  language;
  contentService;
  uiContent = null;
  t(key) {
    const fallback = _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_6__.ASSET_PAGE_I18N[this.language.currentLanguage]?.[key] || _services_asset_page_i18n__WEBPACK_IMPORTED_MODULE_6__.ASSET_PAGE_I18N.fr[key] || key;
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
  imageFailed = false;
  selectedImage = '';
  failedGalleryImages = new Set();
  constructor(http, ctx, media, language, contentService) {
    this.http = http;
    this.ctx = ctx;
    this.media = media;
    this.language = language;
    this.contentService = contentService;
  }
  ngOnInit() {
    var _this = this;
    const assetId = this.ctx.resourceId;
    this.http.get(`/api/assets/${encodeURIComponent(assetId)}`).subscribe({
      next: function () {
        var _ref = (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (asset) {
          _this.asset = yield _this.media.resolveFirebaseTree(asset);
          _this.imageFailed = false;
          _this.selectedImage = '';
        });
        return function next(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      error: err => {
        console.error(`Unable to load car asset ${assetId}`, err);
        this.error = 'Voiture introuvable.';
      }
    });
  }
  get p() {
    return this.asset?.properties || {};
  }
  get price() {
    return this.asset?.pricing || {};
  }
  get vehiclePage() {
    return this.asset?.vehiclePage || {};
  }
  get title() {
    return this.vehiclePage.title || this.asset?.name || [this.p.brand, this.p.model].filter(Boolean).join(' ') || 'Voiture';
  }
  get intro() {
    return this.localized.intro || this.vehiclePage.intro || this.localizedHeadline;
  }
  get description() {
    return this.localized.description || this.vehiclePage.description || this.localizedDescription || this.localizedHeadline;
  }
  get features() {
    if (Array.isArray(this.localized.features) && this.localized.features.length) return this.localized.features;
    if (this.language.currentLanguage === 'fr' && Array.isArray(this.vehiclePage.features) && this.vehiclePage.features.length) return this.vehiclePage.features;
    return [this.p.seats ? `${this.p.seats} ${this.t('seats')}` : '', this.p.transmission ? this.t('automatic') : '', this.p.fuel || this.p.energy ? this.t('electric') : '', this.p.rangeKm ? `${this.t('range')} ${this.p.rangeKm} km` : ''].filter(Boolean);
  }
  get galleryImages() {
    const raw = (0,_services_asset_photos__WEBPACK_IMPORTED_MODULE_3__.assetPhotoPaths)(this.asset, this.ctx.resourceType, this.ctx.resourceId);
    return [...new Set(raw.map(value => this.media.objectUrl(value)))].filter(value => !this.failedGalleryImages.has(value));
  }
  get heroImage() {
    if (this.selectedImage && !this.failedGalleryImages.has(this.selectedImage)) return this.selectedImage;
    return this.galleryImages[0] || '';
  }
  selectImage(image) {
    this.selectedImage = image;
    this.imageFailed = false;
  }
  onImageError() {
    const failed = this.heroImage;
    if (failed) this.failedGalleryImages.add(failed);
    this.selectedImage = '';
    this.imageFailed = this.galleryImages.length === 0;
    console.error('Car hero image could not be loaded:', failed);
  }
  onGalleryImageError(image) {
    this.failedGalleryImages.add(image);
    if (this.selectedImage === image) this.selectedImage = '';
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClient
  }, {
    type: _services_resource_context_service__WEBPACK_IMPORTED_MODULE_7__.ResourceContextService
  }, {
    type: _services_private_media_service__WEBPACK_IMPORTED_MODULE_8__.PrivateMediaService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_5__.LanguageService
  }, {
    type: _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_4__.SiteContentService
  }];
};
CarHomeComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_10__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_11__.Component)({
  selector: 'app-car-home',
  template: _car_home_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: false,
  styles: [(_car_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], CarHomeComponent);


/***/ }),

/***/ 60361:
/*!**************************************************************************!*\
  !*** ./src/app/assets/car/pages/home/car-home.component.html?ngResource ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<ng-container *ngIf=\"asset; else loading\">\n  <section class=\"car-landing\">\n    <div class=\"car-landing__media\">\n      <img\n        *ngIf=\"heroImage && !imageFailed\"\n        class=\"car-landing__image no-image-zoom\"\n        [src]=\"heroImage\"\n        [alt]=\"title\"\n        (error)=\"onImageError()\"\n      >\n      <div class=\"car-landing__placeholder\" *ngIf=\"!heroImage || imageFailed\">\n        <div class=\"car-landing__placeholder-icon\">🚗</div>\n        <strong>{{ title }}</strong>\n        <span>{{t('photo')}}</span>\n      </div>\n\n      <div class=\"car-landing__thumbs\" *ngIf=\"galleryImages.length > 1\">\n        <button\n          type=\"button\"\n          *ngFor=\"let image of galleryImages; let i = index\"\n          [class.active]=\"image === heroImage\"\n          (click)=\"selectImage(image)\"\n          [attr.aria-label]=\"'Afficher la photo ' + (i + 1)\"\n        >\n          <img class=\"no-image-zoom\" [src]=\"image\" [alt]=\"title + ' - photo ' + (i + 1)\" (error)=\"onGalleryImageError(image)\">\n        </button>\n      </div>\n    </div>\n\n    <div class=\"car-landing__content\">\n      <p class=\"eyebrow\">{{t('car')}}</p>\n      <h1>{{ title }}</h1>\n      <p class=\"lead\" *ngIf=\"intro\">{{ intro }}</p>\n\n      <div class=\"car-landing__facts\" *ngIf=\"features.length\">\n        <span *ngFor=\"let feature of features\">{{ feature }}</span>\n      </div>\n\n      <div class=\"car-landing__price\" *ngIf=\"price.basePrice\">\n        <span>{{t('from')}}</span>\n        <strong>{{ price.basePrice }} {{ price.currency || 'EUR' }}</strong>\n        <span>/ {{t('day')}}</span>\n      </div>\n\n      <p class=\"car-landing__description\" *ngIf=\"description\">{{ description }}</p>\n\n      <div class=\"car-landing__actions\">\n        <a class=\"btn-primary\" [routerLink]=\"'/reserver' | resourceRoute\" queryParamsHandling=\"preserve\">{{t('book')}}</a>\n        <a class=\"btn-secondary\" [routerLink]=\"'/vehicle' | resourceRoute\">{{t('details')}}</a>\n      </div>\n\n      <div class=\"car-landing__meta\">\n        <span *ngIf=\"asset.location?.city\">📍 {{ asset.location.city }}</span>\n        <span *ngIf=\"asset.paymentPolicy?.securityDeposit?.value\">{{t('deposit')}}: {{ asset.paymentPolicy.securityDeposit.value }} {{ price.currency || 'EUR' }}</span>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"car-info\">\n    <article>\n      <h2>{{ localized.descriptionTitle || t('about') }}</h2>\n      <p>{{ description }}</p>\n    </article>\n    <article>\n      <h2>{{ localized.rentalTitle || t('rental') }}</h2>\n      <p>{{ localized.rentalText || t('rentalText') }}</p>\n    </article>\n    <article>\n      <h2>{{t('features')}}</h2>\n      <ul *ngIf=\"features.length\">\n        <li *ngFor=\"let feature of features\">{{ feature }}</li>\n      </ul>\n    </article>\n  </section>\n</ng-container>\n\n<ng-template #loading>\n  <div class=\"loading\">\n    <p *ngIf=\"!error\">{{t('loading')}}</p>\n    <p *ngIf=\"error\">{{ error | siteText }}</p>\n  </div>\n</ng-template>\n";

/***/ }),

/***/ 60758:
/*!*******************************************************************************!*\
  !*** ./src/app/assets/car/pages/details/car-detail.component.scss?ngResource ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.vehicle {
  max-width: 1180px;
  margin: auto;
  padding: 48px 24px 80px;
}

.back {
  text-decoration: none;
}

.intro {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  align-items: end;
  margin: 24px 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  font-size: 0.78rem;
}

.intro h1 {
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  margin: 0.1em 0;
}

.lead {
  max-width: 760px;
  font-size: 1.2rem;
  line-height: 1.6;
}

.price {
  min-width: 170px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 16px;
}

.price strong, .price small {
  display: block;
}

.price strong {
  font-size: 2rem;
  margin: 4px 0;
}

.gallery {
  margin: 34px 0;
}

.main {
  width: 100%;
  height: min(62vw, 620px);
  object-fit: cover;
  border-radius: 22px;
  display: block;
}

.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  overflow: auto;
}

.thumbs button {
  border: 2px solid transparent;
  padding: 0;
  border-radius: 10px;
  background: none;
}

.thumbs button.active {
  border-color: #111;
}

.thumbs img {
  width: 110px;
  height: 75px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.photo-placeholder {
  padding: 90px 30px;
  border: 1px dashed #aaa;
  border-radius: 20px;
  text-align: center;
  margin: 34px 0;
}

.specs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin: 30px 0;
}

.specs div {
  padding: 18px;
  border: 1px solid #e3e3e3;
  border-radius: 14px;
}

.specs b, .specs span {
  display: block;
}

.specs span {
  font-size: 0.8rem;
  margin-top: 5px;
  opacity: 0.7;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.content-grid article {
  padding: 26px;
  border: 1px solid #e3e3e3;
  border-radius: 16px;
  line-height: 1.6;
}

.cta {
  text-align: center;
  margin-top: 38px;
}

.cta a {
  display: inline-block;
  padding: 15px 26px;
  border-radius: 999px;
  background: #111;
  color: #fff;
  text-decoration: none;
}

.loading {
  text-align: center;
  padding: 80px;
}

@media (max-width: 800px) {
  .intro {
    display: block;
  }
  .price {
    margin-top: 20px;
  }
  .specs {
    grid-template-columns: repeat(2, 1fr);
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/assets/car/pages/details/car-detail.component.scss"],"names":[],"mappings":"AAAA;EAAS,iBAAA;EAAiB,YAAA;EAAY,uBAAA;AAItC;;AAJ6D;EAAM,qBAAA;AAQnE;;AARwF;EAAO,aAAA;EAAa,8BAAA;EAA8B,SAAA;EAAS,gBAAA;EAAgB,cAAA;AAgBnK;;AAhBiL;EAAS,yBAAA;EAAyB,sBAAA;EAAqB,gBAAA;EAAgB,kBAAA;AAuBxP;;AAvByQ;EAAU,qCAAA;EAAmC,eAAA;AA4BtT;;AA5BoU;EAAM,gBAAA;EAAgB,iBAAA;EAAiB,gBAAA;AAkC3W;;AAlC2X;EAAO,gBAAA;EAAgB,aAAA;EAAa,sBAAA;EAAsB,mBAAA;AAyCrb;;AAzCwc;EAA2B,cAAA;AA6Cne;;AA7Cif;EAAc,eAAA;EAAe,aAAA;AAkD9gB;;AAlD2hB;EAAS,cAAA;AAsDpiB;;AAtDkjB;EAAM,WAAA;EAAW,wBAAA;EAAuB,iBAAA;EAAiB,mBAAA;EAAmB,cAAA;AA8D9nB;;AA9D4oB;EAAQ,aAAA;EAAa,SAAA;EAAS,gBAAA;EAAgB,cAAA;AAqE1rB;;AArEwsB;EAAe,6BAAA;EAA6B,UAAA;EAAU,mBAAA;EAAmB,gBAAA;AA4EjxB;;AA5EiyB;EAAsB,kBAAA;AAgFvzB;;AAhFy0B;EAAY,YAAA;EAAY,YAAA;EAAY,iBAAA;EAAiB,kBAAA;EAAkB,cAAA;AAwFh5B;;AAxF85B;EAAmB,kBAAA;EAAkB,uBAAA;EAAuB,mBAAA;EAAmB,kBAAA;EAAkB,cAAA;AAgG//B;;AAhG6gC;EAAO,aAAA;EAAa,qCAAA;EAAoC,SAAA;EAAS,cAAA;AAuG9kC;;AAvG4lC;EAAW,aAAA;EAAa,yBAAA;EAAyB,mBAAA;AA6G7oC;;AA7GgqC;EAAqB,cAAA;AAiHrrC;;AAjHmsC;EAAY,iBAAA;EAAgB,eAAA;EAAe,YAAA;AAuH9uC;;AAvHyvC;EAAc,aAAA;EAAa,qCAAA;EAAoC,SAAA;AA6HxzC;;AA7Hi0C;EAAsB,aAAA;EAAa,yBAAA;EAAyB,mBAAA;EAAmB,gBAAA;AAoIh5C;;AApIg6C;EAAK,kBAAA;EAAkB,gBAAA;AAyIv7C;;AAzIu8C;EAAO,qBAAA;EAAqB,kBAAA;EAAkB,oBAAA;EAAoB,gBAAA;EAAgB,WAAA;EAAW,qBAAA;AAkJpiD;;AAlJyjD;EAAS,kBAAA;EAAkB,aAAA;AAuJplD;;AAvJimD;EAAwB;IAAO,cAAA;EA4J9nD;EA5J4oD;IAAO,gBAAA;EA+JnpD;EA/JmqD;IAAO,qCAAA;EAkK1qD;EAlK8sD;IAAc,0BAAA;EAqK5tD;AACF","sourcesContent":[".vehicle{max-width:1180px;margin:auto;padding:48px 24px 80px}.back{text-decoration:none}.intro{display:flex;justify-content:space-between;gap:32px;align-items:end;margin:24px 0}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-weight:700;font-size:.78rem}.intro h1{font-size:clamp(2.5rem,6vw,4.8rem);margin:.1em 0}.lead{max-width:760px;font-size:1.2rem;line-height:1.6}.price{min-width:170px;padding:20px;border:1px solid #ddd;border-radius:16px}.price strong,.price small{display:block}.price strong{font-size:2rem;margin:4px 0}.gallery{margin:34px 0}.main{width:100%;height:min(62vw,620px);object-fit:cover;border-radius:22px;display:block}.thumbs{display:flex;gap:10px;margin-top:12px;overflow:auto}.thumbs button{border:2px solid transparent;padding:0;border-radius:10px;background:none}.thumbs button.active{border-color:#111}.thumbs img{width:110px;height:75px;object-fit:cover;border-radius:8px;display:block}.photo-placeholder{padding:90px 30px;border:1px dashed #aaa;border-radius:20px;text-align:center;margin:34px 0}.specs{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:30px 0}.specs div{padding:18px;border:1px solid #e3e3e3;border-radius:14px}.specs b,.specs span{display:block}.specs span{font-size:.8rem;margin-top:5px;opacity:.7}.content-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.content-grid article{padding:26px;border:1px solid #e3e3e3;border-radius:16px;line-height:1.6}.cta{text-align:center;margin-top:38px}.cta a{display:inline-block;padding:15px 26px;border-radius:999px;background:#111;color:#fff;text-decoration:none}.loading{text-align:center;padding:80px}@media(max-width:800px){.intro{display:block}.price{margin-top:20px}.specs{grid-template-columns:repeat(2,1fr)}.content-grid{grid-template-columns:1fr}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 63603:
/*!********************************************************************************!*\
  !*** ./src/app/assets/car/pages/booking/car-booking.component.scss?ngResource ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.car-booking {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0;
}

input, textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.check {
  display: inline-flex;
  flex-direction: row;
  margin-right: 24px;
}

.actions {
  display: flex;
  gap: 12px;
  margin: 24px 0;
}

button {
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #aaa;
}

.primary {
  font-weight: 700;
}

.quote {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 18px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.ok {
  font-weight: 700;
}

.err {
  font-weight: 700;
}

.quote {
  display: block;
}

.quote-heading {
  font-weight: 700;
  margin-bottom: 12px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e5e5;
}

.price-row.total {
  font-weight: 700;
  border-top: 2px solid #aaa;
  margin-top: 8px;
}

.quote small {
  display: block;
  margin-top: 10px;
  color: #666;
}`, "",{"version":3,"sources":["webpack://./src/app/assets/car/pages/booking/car-booking.component.scss"],"names":[],"mappings":"AAAA;EAAa,gBAAA;EAAgB,cAAA;EAAc,kBAAA;AAI3C;;AAJ6D;EAAM,aAAA;EAAa,2DAAA;EAAyD,SAAA;AAUzI;;AAVkJ;EAAM,aAAA;EAAa,sBAAA;EAAsB,QAAA;EAAQ,cAAA;AAiBnM;;AAjBiN;EAAe,aAAA;EAAa,sBAAA;EAAsB,kBAAA;AAuBnQ;;AAvBqR;EAAO,oBAAA;EAAoB,mBAAA;EAAmB,kBAAA;AA6BnU;;AA7BqV;EAAS,aAAA;EAAa,SAAA;EAAS,cAAA;AAmCpX;;AAnCkY;EAAO,kBAAA;EAAkB,kBAAA;EAAkB,sBAAA;AAyC7a;;AAzCmc;EAAS,gBAAA;AA6C5c;;AA7C4d;EAAO,aAAA;EAAa,SAAA;EAAS,eAAA;EAAe,aAAA;EAAa,sBAAA;EAAsB,mBAAA;AAsD3iB;;AAtD8jB;EAAI,gBAAA;AA0DlkB;;AA1DklB;EAAK,gBAAA;AA8DvlB;;AA5DA;EAAO,cAAA;AAgEP;;AAhEqB;EAAe,gBAAA;EAAgB,mBAAA;AAqEpD;;AArEuE;EAAW,aAAA;EAAa,8BAAA;EAA8B,SAAA;EAAS,cAAA;EAAc,gCAAA;AA6EpJ;;AA7EoL;EAAiB,gBAAA;EAAgB,0BAAA;EAA0B,eAAA;AAmF/O;;AAnF8P;EAAa,cAAA;EAAc,gBAAA;EAAgB,WAAA;AAyFzS","sourcesContent":[".car-booking{max-width:900px;margin:0 auto;padding:32px 20px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}label{display:flex;flex-direction:column;gap:6px;margin:12px 0}input,textarea{padding:12px;border:1px solid #ccc;border-radius:8px}.check{display:inline-flex;flex-direction:row;margin-right:24px}.actions{display:flex;gap:12px;margin:24px 0}button{padding:12px 18px;border-radius:8px;border:1px solid #aaa}.primary{font-weight:700}.quote{display:flex;gap:20px;flex-wrap:wrap;padding:18px;border:1px solid #ddd;border-radius:10px}.ok{font-weight:700}.err{font-weight:700}\n\n.quote{display:block}.quote-heading{font-weight:700;margin-bottom:12px}.price-row{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid #e5e5e5}.price-row.total{font-weight:700;border-top:2px solid #aaa;margin-top:8px}.quote small{display:block;margin-top:10px;color:#666}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 71644:
/*!******************************************************************!*\
  !*** ./src/app/assets/car/pages/details/car-detail.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarDetailComponent: () => (/* binding */ CarDetailComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _car_detail_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./car-detail.component.html?ngResource */ 76856);
/* harmony import */ var _car_detail_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./car-detail.component.scss?ngResource */ 60758);
/* harmony import */ var _car_detail_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_car_detail_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_asset_photos__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../services/asset-photos */ 19009);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _services_resource_context_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/resource-context.service */ 54560);
/* harmony import */ var _services_private_media_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/private-media.service */ 71260);









let CarDetailComponent = class CarDetailComponent {
  http;
  ctx;
  media;
  asset = null;
  error = '';
  selectedImage = '';
  constructor(http, ctx, media) {
    this.http = http;
    this.ctx = ctx;
    this.media = media;
  }
  ngOnInit() {
    var _this = this;
    this.http.get(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({
      next: function () {
        var _ref = (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (asset) {
          _this.asset = yield _this.media.resolveFirebaseTree(asset);
          _this.selectedImage = _this.images[0] || '';
        });
        return function next(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      error: () => this.error = 'Voiture introuvable.'
    });
  }
  get p() {
    return this.asset?.properties || {};
  }
  get price() {
    return this.asset?.pricing || {};
  }
  get details() {
    return this.asset?.vehiclePage || {};
  }
  get images() {
    const values = (0,_services_asset_photos__WEBPACK_IMPORTED_MODULE_3__.assetPhotoPaths)(this.asset, this.ctx.resourceType, this.ctx.resourceId).map(v => this.media.objectUrl(v));
    return [...new Set(values)];
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient
  }, {
    type: _services_resource_context_service__WEBPACK_IMPORTED_MODULE_4__.ResourceContextService
  }, {
    type: _services_private_media_service__WEBPACK_IMPORTED_MODULE_5__.PrivateMediaService
  }];
};
CarDetailComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
  selector: 'app-car-detail',
  template: _car_detail_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: false,
  styles: [(_car_detail_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], CarDetailComponent);


/***/ }),

/***/ 76856:
/*!*******************************************************************************!*\
  !*** ./src/app/assets/car/pages/details/car-detail.component.html?ngResource ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<section class=\"vehicle\" *ngIf=\"asset; else loading\">\n  <a class=\"back\" [routerLink]=\"'/home' | resourceRoute\">{{ \"ui.pages.tca5f444ee7c8\" | siteText }}</a>\n  <div class=\"intro\">\n    <div>\n      <span class=\"eyebrow\">{{details.eyebrow || ('ui.messages.t10b31fcfff37' | siteText)}}</span>\n      <h1>{{details.title || (p.brand + ' ' + p.model)}}</h1>\n      <p class=\"lead\">{{details.intro || asset.description}}</p>\n    </div>\n    <div class=\"price\"><small>{{ \"ui.pages.tc0fd7660f17d\" | siteText }}</small><strong>{{price.basePrice}} {{price.currency}}</strong><small>{{ \"ui.pages.t156b9eb38835\" | siteText }}</small></div>\n  </div>\n\n  <div class=\"gallery\" *ngIf=\"images.length; else noPhotos\">\n    <img class=\"main\" [src]=\"selectedImage || images[0]\" [alt]=\"p.brand + ' ' + p.model\">\n    <div class=\"thumbs\" *ngIf=\"images.length > 1\">\n      <button type=\"button\" *ngFor=\"let image of images\" (click)=\"selectedImage=image\" [class.active]=\"selectedImage===image\"><img [src]=\"image\" alt=\"\"></button>\n    </div>\n  </div>\n  <ng-template #noPhotos><div class=\"photo-placeholder\">{{ \"ui.pages.tca8941199edb\" | siteText }} </div></ng-template>\n\n  <div class=\"specs\">\n    <div><b>{{p.brand}}</b><span>{{ \"ui.pages.tb539addf71ad\" | siteText }}</span></div><div><b>{{p.model}}</b><span>{{ \"ui.pages.t9853170f16b4\" | siteText }}</span></div><div><b>{{p.year}}</b><span>{{ \"ui.pages.t1f910d98d7d2\" | siteText }}</span></div>\n    <div><b>{{p.seats}}</b><span>{{ \"ui.pages.t0cd3597453ab\" | siteText }}</span></div><div><b>{{p.transmission}}</b><span>{{ \"ui.pages.tace17e480781\" | siteText }}</span></div><div><b>{{p.rangeKm}} km</b><span>{{ \"ui.pages.ta138c5cf681a\" | siteText }}</span></div>\n  </div>\n\n  <div class=\"content-grid\">\n    <article><h2>{{details.descriptionTitle || ('ui.messages.t27e518f76490' | siteText)}}</h2><p>{{details.description || asset.description}}</p></article>\n    <article><h2>{{details.featuresTitle || ('ui.messages.t6d93dfc44200' | siteText)}}</h2><ul><li *ngFor=\"let item of details.features || []\">{{item}}</li></ul></article>\n    <article><h2>{{details.rentalTitle || ('ui.pages.td219c68101f5' | siteText)}}</h2><p>{{details.rentalText || ('ui.messages.t25fba3860c7b' | siteText)}}</p></article>\n  </div>\n  <div class=\"cta\"><a [routerLink]=\"'/reserver' | resourceRoute\">{{ \"ui.pages.t12f8e8d83303\" | siteText }}</a></div>\n</section>\n<ng-template #loading><div class=\"loading\">{{error || ('ui.pages.tb3bbf87d635d' | siteText)}}</div></ng-template>\n";

/***/ }),

/***/ 87051:
/*!********************************************************************************!*\
  !*** ./src/app/assets/car/pages/booking/car-booking.component.html?ngResource ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"car-booking\"><div *ngIf=\"authRequired\" class=\"err\">{{ \"ui.pages.t3d216c51f30c\" | siteText }} <button type=\"button\" (click)=\"login()\">{{ \"ui.pages.tfedf2439f275\" | siteText }}</button> <button type=\"button\" (click)=\"signup()\">{{ \"ui.pages.tdd9f915122c5\" | siteText }}</button></div><h1>{{ \"ui.pages.t254b0ae17097\" | siteText }} {{asset?.name || 'la voiture'}}</h1><p *ngIf=\"asset\">{{asset.properties?.brand}} {{asset.properties?.model}} · {{asset.pricing?.basePrice}} {{ \"ui.pages.t1a9f6db73c34\" | siteText }}</p>\n<div class=\"grid\"><label>{{ \"ui.pages.t95fc0a53e33a\" | siteText }}<input type=\"date\" [(ngModel)]=\"form.startDate\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t5073129fadb8\" | siteText }}<input type=\"time\" [(ngModel)]=\"form.startTime\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t955cdde93864\" | siteText }}<input type=\"date\" [(ngModel)]=\"form.endDate\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t5073129fadb8\" | siteText }}<input type=\"time\" [(ngModel)]=\"form.endTime\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t4786ef9c6b0f\" | siteText }}<input [(ngModel)]=\"form.pickupLocation\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t23f397112f95\" | siteText }}<input [(ngModel)]=\"form.returnLocation\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.ta75c5068eaa4\" | siteText }}<input [(ngModel)]=\"form.customerName\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t84add5b29527\" | siteText }}<input type=\"email\" [readonly]=\"!adminMode && !!authUser\" [(ngModel)]=\"form.customerEmail\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.td3b023eabc9c\" | siteText }}<input [(ngModel)]=\"form.customerPhone\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t2a7b83a2f65a\" | siteText }}<input type=\"number\" min=\"18\" [(ngModel)]=\"form.driverAge\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.td6f6988fb061\" | siteText }}<input maxlength=\"3\" [(ngModel)]=\"form.licenseCountry\" (ngModelChange)=\"onCustomerChanged()\"></label></div>\n<label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"form.additionalDriver\" (ngModelChange)=\"onOptionChanged()\"> {{ \"ui.pages.tbd4c429c692e\" | siteText }}</label><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"form.childSeat\" (ngModelChange)=\"onOptionChanged()\"> {{ \"ui.pages.t247c1e5ced94\" | siteText }}</label><label>{{ \"ui.pages.tdbdeccaf80ad\" | siteText }}<textarea [(ngModel)]=\"form.comments\" (ngModelChange)=\"onCustomerChanged()\"></textarea></label>\n<div class=\"actions\"><button type=\"button\" (click)=\"calculate()\" [disabled]=\"calculating\">{{calculating ? ('ui.messages.t62de1b588c87' | siteText) : ('ui.pages.t865b10c19fe0' | siteText)}}</button><button type=\"button\" class=\"primary\" (click)=\"book()\" [disabled]=\"saving || calculating || !quoteIsCurrent\">{{saving?('ui.messages.t987c4d94bbbe' | siteText):('ui.messages.t3fa843c945b9' | siteText)}}</button></div>\n<div class=\"quote\" *ngIf=\"quote\">\n  <div class=\"quote-heading\">{{ \"ui.pages.t28469cb42deb\" | siteText }}</div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.tebbcf17b6528\" | siteText }}{{quote.quantity}} {{ \"ui.pages.t986f4785a113\" | siteText }} {{quote.basePrice}} {{quote.currency}})</span><strong>{{quote.baseAmount !== undefined ? quote.baseAmount : (quote.quantity * quote.basePrice)}} {{quote.currency}}</strong></div>\n  <div class=\"price-row\" *ngIf=\"form.additionalDriver\"><span>{{ \"ui.pages.tbd4c429c692e\" | siteText }}</span><span>{{quote.additionalDriverAmount !== undefined ? quote.additionalDriverAmount : '—'}} {{quote.additionalDriverAmount !== undefined ? quote.currency : ''}}</span></div>\n  <div class=\"price-row\" *ngIf=\"form.childSeat\"><span>{{ \"ui.pages.t247c1e5ced94\" | siteText }}</span><span>{{quote.childSeatAmount !== undefined ? quote.childSeatAmount : '—'}} {{quote.childSeatAmount !== undefined ? quote.currency : ''}}</span></div>\n  <div class=\"price-row total\"><span>{{ \"ui.pages.tfd7698f20c64\" | siteText }}</span><strong>{{quote.rentalAmount}} {{quote.currency}}</strong></div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.t54f0b0d51c9f\" | siteText }}</span><span>{{quote.bookingDeposit}} {{quote.currency}}</span></div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.tb9e063d73168\" | siteText }}</span><span>{{quote.securityDeposit}} {{quote.currency}}</span></div>\n  <p>{{ \"ui.pages.t374deeed96a8\" | siteText }}</p>\n  <small *ngIf=\"quote.additionalDriverAmount === undefined || quote.childSeatAmount === undefined\">{{ \"ui.pages.t993dac20dea3\" | siteText }}</small>\n</div><p class=\"ok\" *ngIf=\"message\">{{ message | siteText }}</p><p class=\"err\" *ngIf=\"error\">{{ error | siteText }}</p></div>\n";

/***/ }),

/***/ 89866:
/*!**************************************************!*\
  !*** ./src/app/assets/car/car-routing.module.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarRoutingModule: () => (/* binding */ CarRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../home/site-text.pipe */ 99343);
/* harmony import */ var _services_listing_publication_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/listing-publication.guard */ 60087);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _layout_home_homelayout_homelayout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../layout/home/homelayout/homelayout.component */ 14211);
/* harmony import */ var _pages_home_car_home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/home/car-home.component */ 60283);
/* harmony import */ var _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/details/car-detail.component */ 71644);
/* harmony import */ var _pages_booking_car_booking_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/booking/car-booking.component */ 34445);









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
    component: _pages_home_car_home_component__WEBPACK_IMPORTED_MODULE_3__.CarHomeComponent
  }, {
    path: 'details',
    component: _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__.CarDetailComponent
  }, {
    path: 'vehicle',
    component: _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__.CarDetailComponent
  }, {
    path: 'voiture',
    component: _pages_details_car_detail_component__WEBPACK_IMPORTED_MODULE_4__.CarDetailComponent
  }, {
    path: 'book',
    component: _pages_booking_car_booking_component__WEBPACK_IMPORTED_MODULE_5__.CarBookingComponent
  }, {
    path: 'reserver',
    component: _pages_booking_car_booking_component__WEBPACK_IMPORTED_MODULE_5__.CarBookingComponent
  }, {
    path: '',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_services_owner-customers-text_ts"), __webpack_require__.e("default-src_app_home_home_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../../home/home.module */ 45055)).then(m => m.HomeModule)
  }, {
    path: '',
    loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_login_login_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../../login/login.module */ 91307)).then(m => m.LoginModule)
  }]
}];
let CarRoutingModule = class CarRoutingModule {};
CarRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.NgModule)({
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule.forChild(routes)],
  exports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule]
})], CarRoutingModule);


/***/ }),

/***/ 94700:
/*!*********************************************!*\
  !*** ./src/app/services/asset-page-i18n.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSET_PAGE_I18N: () => (/* binding */ ASSET_PAGE_I18N)
/* harmony export */ });
const ASSET_PAGE_I18N = {
  "fr": {
    "from": "À partir de",
    "day": "jour",
    "night": "nuit",
    "book": "Réserver",
    "details": "Voir les détails",
    "property": "Le logement",
    "parking": "Le parking",
    "pool": "La piscine",
    "car": "La voiture",
    "bedrooms": "chambres",
    "beds": "lits",
    "bathrooms": "salles de bain",
    "guests": "voyageurs",
    "people": "personnes",
    "heated": "Chauffée",
    "unheated": "Non chauffée",
    "indoor": "Intérieure",
    "outdoor": "Extérieure",
    "secured": "Sécurisé",
    "standard": "Accès standard",
    "cctv": "Vidéosurveillance",
    "noCctv": "Sans vidéosurveillance",
    "charging": "Recharge électrique",
    "noCharging": "Sans recharge",
    "seats": "places",
    "automatic": "Transmission automatique",
    "electric": "Motorisation électrique",
    "range": "Autonomie",
    "deposit": "Caution",
    "about": "À propos de cette voiture",
    "rental": "Votre location",
    "features": "Caractéristiques",
    "rentalText": "Choisissez vos dates, heures et lieux de prise en charge et de restitution.",
    "photo": "Photo bientôt disponible",
    "loading": "Chargement…",
    "notFound": "Ressource introuvable."
  },
  "en": {
    "from": "From",
    "day": "day",
    "night": "night",
    "book": "Book",
    "details": "View details",
    "property": "The property",
    "parking": "The parking space",
    "pool": "The pool",
    "car": "The car",
    "bedrooms": "bedrooms",
    "beds": "beds",
    "bathrooms": "bathrooms",
    "guests": "guests",
    "people": "people",
    "heated": "Heated",
    "unheated": "Not heated",
    "indoor": "Indoor",
    "outdoor": "Outdoor",
    "secured": "Secure",
    "standard": "Standard access",
    "cctv": "CCTV",
    "noCctv": "No CCTV",
    "charging": "EV charging",
    "noCharging": "No charging",
    "seats": "seats",
    "automatic": "Automatic transmission",
    "electric": "Electric",
    "range": "Range",
    "deposit": "Deposit",
    "about": "About this car",
    "rental": "Your rental",
    "features": "Features",
    "rentalText": "Choose your dates, times, pickup and return locations.",
    "photo": "Photo coming soon",
    "loading": "Loading…",
    "notFound": "Asset not found."
  },
  "es": {
    "from": "Desde",
    "day": "día",
    "night": "noche",
    "book": "Reservar",
    "details": "Ver detalles",
    "property": "El alojamiento",
    "parking": "El aparcamiento",
    "pool": "La piscina",
    "car": "El coche",
    "bedrooms": "habitaciones",
    "beds": "camas",
    "bathrooms": "baños",
    "guests": "huéspedes",
    "people": "personas",
    "heated": "Climatizada",
    "unheated": "Sin climatizar",
    "indoor": "Interior",
    "outdoor": "Exterior",
    "secured": "Seguro",
    "standard": "Acceso estándar",
    "cctv": "Videovigilancia",
    "noCctv": "Sin videovigilancia",
    "charging": "Carga eléctrica",
    "noCharging": "Sin carga",
    "seats": "plazas",
    "automatic": "Cambio automático",
    "electric": "Eléctrico",
    "range": "Autonomía",
    "deposit": "Fianza",
    "about": "Sobre este coche",
    "rental": "Tu alquiler",
    "features": "Características",
    "rentalText": "Elige fechas, horarios y lugares de recogida y devolución.",
    "photo": "Foto próximamente",
    "loading": "Cargando…",
    "notFound": "Recurso no encontrado."
  },
  "de": {
    "from": "Ab",
    "day": "Tag",
    "night": "Nacht",
    "book": "Buchen",
    "details": "Details ansehen",
    "property": "Die Unterkunft",
    "parking": "Der Parkplatz",
    "pool": "Der Pool",
    "car": "Das Auto",
    "bedrooms": "Schlafzimmer",
    "beds": "Betten",
    "bathrooms": "Badezimmer",
    "guests": "Gäste",
    "people": "Personen",
    "heated": "Beheizt",
    "unheated": "Unbeheizt",
    "indoor": "Innenpool",
    "outdoor": "Außenpool",
    "secured": "Gesichert",
    "standard": "Standardzugang",
    "cctv": "Videoüberwachung",
    "noCctv": "Keine Videoüberwachung",
    "charging": "E-Auto-Ladestation",
    "noCharging": "Keine Ladestation",
    "seats": "Sitzplätze",
    "automatic": "Automatikgetriebe",
    "electric": "Elektroantrieb",
    "range": "Reichweite",
    "deposit": "Kaution",
    "about": "Über dieses Auto",
    "rental": "Ihre Miete",
    "features": "Ausstattung",
    "rentalText": "Wählen Sie Datum, Uhrzeit sowie Abhol- und Rückgabeort.",
    "photo": "Foto folgt",
    "loading": "Wird geladen…",
    "notFound": "Objekt nicht gefunden."
  },
  "it": {
    "from": "A partire da",
    "day": "giorno",
    "night": "notte",
    "book": "Prenota",
    "details": "Vedi dettagli",
    "property": "L’alloggio",
    "parking": "Il parcheggio",
    "pool": "La piscina",
    "car": "L’auto",
    "bedrooms": "camere",
    "beds": "letti",
    "bathrooms": "bagni",
    "guests": "ospiti",
    "people": "persone",
    "heated": "Riscaldata",
    "unheated": "Non riscaldata",
    "indoor": "Interna",
    "outdoor": "Esterna",
    "secured": "Sicuro",
    "standard": "Accesso standard",
    "cctv": "Videosorveglianza",
    "noCctv": "Senza videosorveglianza",
    "charging": "Ricarica elettrica",
    "noCharging": "Senza ricarica",
    "seats": "posti",
    "automatic": "Cambio automatico",
    "electric": "Elettrica",
    "range": "Autonomia",
    "deposit": "Cauzione",
    "about": "Informazioni sull’auto",
    "rental": "Il tuo noleggio",
    "features": "Caratteristiche",
    "rentalText": "Scegli date, orari e luoghi di ritiro e riconsegna.",
    "photo": "Foto in arrivo",
    "loading": "Caricamento…",
    "notFound": "Risorsa non trovata."
  },
  "nl": {
    "from": "Vanaf",
    "day": "dag",
    "night": "nacht",
    "book": "Boeken",
    "details": "Details bekijken",
    "property": "De accommodatie",
    "parking": "De parkeerplaats",
    "pool": "Het zwembad",
    "car": "De auto",
    "bedrooms": "slaapkamers",
    "beds": "bedden",
    "bathrooms": "badkamers",
    "guests": "gasten",
    "people": "personen",
    "heated": "Verwarmd",
    "unheated": "Onverwarmd",
    "indoor": "Binnen",
    "outdoor": "Buiten",
    "secured": "Beveiligd",
    "standard": "Standaard toegang",
    "cctv": "Camerabewaking",
    "noCctv": "Geen camerabewaking",
    "charging": "Elektrisch laden",
    "noCharging": "Geen laadpunt",
    "seats": "zitplaatsen",
    "automatic": "Automatische transmissie",
    "electric": "Elektrisch",
    "range": "Actieradius",
    "deposit": "Borg",
    "about": "Over deze auto",
    "rental": "Uw huur",
    "features": "Kenmerken",
    "rentalText": "Kies datums, tijden en ophaal- en inleverlocaties.",
    "photo": "Foto volgt",
    "loading": "Laden…",
    "notFound": "Object niet gevonden."
  },
  "ru": {
    "from": "От",
    "day": "день",
    "night": "ночь",
    "book": "Забронировать",
    "details": "Подробнее",
    "property": "Жильё",
    "parking": "Парковка",
    "pool": "Бассейн",
    "car": "Автомобиль",
    "bedrooms": "спальни",
    "beds": "кровати",
    "bathrooms": "ванные комнаты",
    "guests": "гости",
    "people": "человек",
    "heated": "С подогревом",
    "unheated": "Без подогрева",
    "indoor": "В помещении",
    "outdoor": "На улице",
    "secured": "Охраняемая",
    "standard": "Обычный доступ",
    "cctv": "Видеонаблюдение",
    "noCctv": "Без видеонаблюдения",
    "charging": "Зарядка электромобиля",
    "noCharging": "Без зарядки",
    "seats": "мест",
    "automatic": "Автоматическая коробка",
    "electric": "Электромобиль",
    "range": "Запас хода",
    "deposit": "Залог",
    "about": "Об автомобиле",
    "rental": "Ваша аренда",
    "features": "Характеристики",
    "rentalText": "Выберите даты, время и места получения и возврата.",
    "photo": "Фото скоро появится",
    "loading": "Загрузка…",
    "notFound": "Объект не найден."
  }
};

/***/ })

}]);
//# sourceMappingURL=src_app_assets_car_car_module_ts.js.map