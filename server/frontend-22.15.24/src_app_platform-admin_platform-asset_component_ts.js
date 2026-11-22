(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_platform-admin_platform-asset_component_ts"],{

/***/ 27231:
/*!************************************************************!*\
  !*** ./src/app/platform-admin/platform-asset.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlatformAssetComponent: () => (/* binding */ PlatformAssetComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _platform_asset_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./platform-asset.component.html?ngResource */ 84205);
/* harmony import */ var _platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./platform-asset.component.scss?ngResource */ 81251);
/* harmony import */ var _platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 72354);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _platform_asset_text__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./platform-asset.text */ 82957);














let PlatformAssetComponent = class PlatformAssetComponent {
  http;
  auth;
  access;
  language;
  route;
  data = null;
  loading = false;
  error = '';
  uid = '';
  sequence = 0;
  subscription;
  constructor(http, auth, access, language, route) {
    this.http = http;
    this.auth = auth;
    this.access = access;
    this.language = language;
    this.route = route;
  }
  t(key) {
    return _platform_asset_text__WEBPACK_IMPORTED_MODULE_7__.PLATFORM_ASSET_TEXT[this.language.currentLanguage]?.[key] || _platform_asset_text__WEBPACK_IMPORTED_MODULE_7__.PLATFORM_ASSET_TEXT.en[key] || key;
  }
  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(() => {
      void this.refresh();
    });
  }
  ngOnDestroy() {
    this.sequence++;
    this.subscription?.unsubscribe();
    this.data = null;
  }
  link(tail = 'home') {
    const a = this.data?.asset;
    return a ? ['/', a.assetType, a.id, ...tail.split('/')] : ['/platform/admin'];
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sequence = ++_this.sequence;
      _this.loading = true;
      _this.data = null;
      _this.error = '';
      try {
        const type = String(_this.route.snapshot.paramMap.get('type') || ''),
          id = String(_this.route.snapshot.paramMap.get('id') || '');
        if (!['boat', 'car', 'property', 'parking', 'pool'].includes(type) || !/^[a-zA-Z0-9_-]+$/.test(id)) throw Error('invalid_scope');
        const uid = (yield _this.auth.user()).uid;
        _this.uid = uid;
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this.http.get('/api/platform/admin/assets/' + [type, id].map(encodeURIComponent).join('/'), {
          headers: yield _this.auth.headers()
        }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_9__.timeout)(20000)));
        if (sequence !== _this.sequence || (yield _this.auth.user()).uid !== uid) return;
        _this.data = data;
      } catch (e) {
        if (sequence === _this.sequence) _this.error = _this.t(e.status === 403 ? 'forbidden' : e.status === 404 ? 'notFound' : 'error');
      } finally {
        if (sequence === _this.sequence) _this.loading = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_4__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_6__.LanguageService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_11__.ActivatedRoute
  }];
};
PlatformAssetComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_12__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.Component)({
  selector: 'app-platform-asset',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_15__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_3__.PlatformLayoutComponent],
  template: _platform_asset_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], PlatformAssetComponent);


/***/ }),

/***/ 81251:
/*!*************************************************************************!*\
  !*** ./src/app/platform-admin/platform-asset.component.scss?ngResource ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.asset-admin-shell {
  max-width: 1100px;
  margin: auto;
  padding: 2rem 1rem;
  color: #153b46;
}

header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.panel {
  background: white;
  border: 1px solid #cbdde1;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.notice {
  padding: 1rem;
  background: #edf5f6;
  border-radius: 8px;
}

.error {
  color: #b42318;
}

dl {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.7rem;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
}

small {
  display: block;
  color: #567078;
}

.metrics {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.metrics strong {
  display: block;
  font-size: 1.8rem;
}

button, nav a {
  display: inline-block;
  background: #12566a;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  margin: 0.4rem 0.5rem 0.4rem 0;
  text-decoration: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}

nav {
  margin-top: 1rem;
}

@media (max-width: 650px) {
  header {
    flex-direction: column;
  }
  dl {
    grid-template-columns: 1fr;
    gap: 0.3rem;
  }
  dd {
    margin-bottom: 0.8rem;
  }
  .panel {
    padding: 1rem;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/platform-admin/platform-asset.component.scss"],"names":[],"mappings":"AAAA;EAAmB,iBAAA;EAAiB,YAAA;EAAY,kBAAA;EAAkB,cAAA;AAKlE;;AALgF;EAAO,aAAA;EAAa,8BAAA;EAA8B,SAAA;AAWlI;;AAX2I;EAAO,iBAAA;EAAiB,yBAAA;EAAyB,mBAAA;EAAmB,eAAA;EAAe,cAAA;AAmB9N;;AAnB4O;EAAQ,aAAA;EAAa,mBAAA;EAAmB,kBAAA;AAyBpR;;AAzBsS;EAAO,cAAA;AA6B7S;;AA7B2T;EAAG,aAAA;EAAa,gCAAA;EAAgC,WAAA;AAmC3W;;AAnCqX;EAAG,SAAA;EAAS,uBAAA;AAwCjY;;AAxCwZ;EAAM,cAAA;EAAc,cAAA;AA6C5a;;AA7C0b;EAAS,aAAA;EAAa,SAAA;EAAS,eAAA;AAmDzd;;AAnDwe;EAAgB,cAAA;EAAc,iBAAA;AAwDtgB;;AAxDuhB;EAAa,qBAAA;EAAqB,mBAAA;EAAmB,WAAA;EAAW,SAAA;EAAS,kBAAA;EAAkB,oBAAA;EAAmB,8BAAA;EAA2B,qBAAA;EAAqB,eAAA;AAoErrB;;AApEosB;EAAgB,YAAA;AAwEptB;;AAxE+tB;EAAI,gBAAA;AA4EnuB;;AA5EmvB;EAAwB;IAAO,sBAAA;EAiFhxB;EAjFsyB;IAAG,0BAAA;IAA0B,WAAA;EAqFn0B;EArF60B;IAAG,qBAAA;EAwFh1B;EAxFo2B;IAAO,aAAA;EA2F32B;AACF","sourcesContent":[".asset-admin-shell{max-width:1100px;margin:auto;padding:2rem 1rem;color:#153b46}header{display:flex;justify-content:space-between;gap:1rem}.panel{background:white;border:1px solid #cbdde1;border-radius:16px;padding:1.5rem;margin:1rem 0}.notice{padding:1rem;background:#edf5f6;border-radius:8px}.error{color:#b42318}dl{display:grid;grid-template-columns:10rem 1fr;gap:.7rem}dd{margin:0;overflow-wrap:anywhere}small{display:block;color:#567078}.metrics{display:flex;gap:2rem;flex-wrap:wrap}.metrics strong{display:block;font-size:1.8rem}button,nav a{display:inline-block;background:#12566a;color:#fff;border:0;border-radius:8px;padding:.7rem 1rem;margin:.4rem .5rem .4rem 0;text-decoration:none;cursor:pointer}button:disabled{opacity:.5}nav{margin-top:1rem}@media(max-width:650px){header{flex-direction:column}dl{grid-template-columns:1fr;gap:.3rem}dd{margin-bottom:.8rem}.panel{padding:1rem}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 82957:
/*!*******************************************************!*\
  !*** ./src/app/platform-admin/platform-asset.text.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PLATFORM_ASSET_TEXT: () => (/* binding */ PLATFORM_ASSET_TEXT)
/* harmony export */ });
const PLATFORM_ASSET_TEXT = {
  fr: {
    title: 'Gestion du bien',
    back: 'Tous les biens',
    refresh: 'Actualiser',
    owner: 'Propriétaire',
    type: 'Type',
    prefix: 'Préfixe',
    location: 'Localisation',
    price: 'Prix de location',
    bookings: 'Réservations',
    pending: 'En attente',
    confirmed: 'Confirmées',
    subscription: 'Abonnement',
    expiry: 'Échéance',
    moderation: 'Modération',
    view: 'Voir la page du bien',
    content: 'Contenu, photos et tarifs',
    manageBookings: 'Gérer les réservations',
    delegations: 'Gérer les concierges',
    archived: 'Bien archivé — historique des réservations accessible',
    notice: 'Vous intervenez en tant qu’administrateur GoDirect. Le propriétaire et ses comptes de paiement sont conservés. Vos modifications sont tracées.',
    financial: 'Les opérations Stripe, remboursements et débits de caution restent réservés au propriétaire.',
    error: 'Impossible de charger ce bien. Actualisez puis réessayez.',
    forbidden: 'Cet accès est réservé à un administrateur GoDirect authentifié.',
    notFound: 'Bien introuvable.'
  },
  en: {
    title: 'Asset management',
    back: 'All assets',
    refresh: 'Refresh',
    owner: 'Owner',
    type: 'Type',
    prefix: 'Prefix',
    location: 'Location',
    price: 'Rental price',
    bookings: 'Bookings',
    pending: 'Pending',
    confirmed: 'Confirmed',
    subscription: 'Subscription',
    expiry: 'Expiry',
    moderation: 'Moderation',
    view: 'View asset homepage',
    content: 'Content, photos and pricing',
    manageBookings: 'Manage bookings',
    delegations: 'Manage concierges',
    archived: 'Archived asset — booking history remains available',
    notice: 'You are acting as a GoDirect administrator. Ownership and payment accounts remain unchanged. Changes are audited.',
    financial: 'Stripe operations, refunds and warranty charges remain owner-only.',
    error: 'Could not load this asset. Refresh and retry.',
    forbidden: 'A signed-in GoDirect administrator is required.',
    notFound: 'Asset not found.'
  }
};

/***/ }),

/***/ 84205:
/*!*************************************************************************!*\
  !*** ./src/app/platform-admin/platform-asset.component.html?ngResource ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"asset-admin-shell\"><header><div><a routerLink=\"/platform/admin\" [queryParams]=\"{tab:'assets'}\">← {{t('back')}}</a><h1>{{t('title')}}</h1></div><button (click)=\"refresh()\" [disabled]=\"loading\">{{t('refresh')}}</button></header><p *ngIf=\"error\" role=\"alert\" class=\"error\">{{error}}</p>\n<section *ngIf=\"data && access.authenticatedUid===uid && access.isPlatformAdmin\" class=\"panel\"><h2>{{data.asset.name}}</h2><p class=\"notice\">{{t('notice')}}</p><p *ngIf=\"data.asset.archived\" class=\"notice\">{{t('archived')}}</p><dl><dt>{{t('owner')}}</dt><dd><strong>{{data.owner.name}}</strong><small>{{data.owner.email}}</small></dd><dt>{{t('type')}}</dt><dd>{{data.asset.assetType}}</dd><dt>{{t('prefix')}}</dt><dd>{{data.asset.prefix}}.godirect.fr</dd><dt>{{t('location')}}</dt><dd>{{data.asset.location?.city}} {{data.asset.location?.country}}</dd><dt>{{t('price')}}</dt><dd>{{data.asset.pricing?.basePrice|number:'1.2-2'}} {{data.asset.pricing?.currency}} / {{data.asset.pricing?.pricingUnit}}</dd><dt>{{t('moderation')}}</dt><dd>{{data.moderation.status}}</dd><dt>{{t('subscription')}}</dt><dd>{{data.subscription.status}}<small>{{t('expiry')}} : {{data.subscription.paidUntil?(data.subscription.paidUntil*1000|date:'dd/MM/yyyy'):'—'}}</small></dd></dl>\n<div class=\"metrics\"><p>{{t('bookings')}}<strong>{{data.reservations.total}}</strong></p><p>{{t('pending')}}<strong>{{data.reservations.pending}}</strong></p><p>{{t('confirmed')}}<strong>{{data.reservations.confirmed}}</strong></p></div>\n<nav><a *ngIf=\"!data.asset.archived\" [routerLink]=\"link()\">{{t('view')}}</a><a *ngIf=\"data.permissions.content\" [routerLink]=\"link('admin/site-content')\">{{t('content')}}</a><a *ngIf=\"data.permissions.bookings\" [routerLink]=\"link('admin/reservations')\">{{t('manageBookings')}}</a><a *ngIf=\"data.permissions.delegations\" routerLink=\"/owner/delegations\" [queryParams]=\"{type:data.asset.assetType,id:data.asset.id}\">{{t('delegations')}}</a></nav><p>{{t('financial')}}</p></section></main></app-platform-layout>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_platform-admin_platform-asset_component_ts.js.map