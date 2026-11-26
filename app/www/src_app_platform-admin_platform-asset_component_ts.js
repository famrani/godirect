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
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _platform_asset_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./platform-asset.component.html?ngResource */ 84205);
/* harmony import */ var _platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./platform-asset.component.scss?ngResource */ 81251);
/* harmony import */ var _platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_platform_asset_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_admin_success_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/admin-success.component */ 62834);
/* harmony import */ var _calendar_asset_calendar_link_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../calendar/asset-calendar-link.component */ 84168);
/* harmony import */ var _shared_listing_description_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/listing-description.component */ 41644);
/* harmony import */ var _owner_listings_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../owner-listings.component */ 22314);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _services_media_routes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/media-routes */ 79906);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../home/site-text.pipe */ 99343);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 72354);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _platform_asset_text__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./platform-asset.text */ 82957);





















let PlatformAssetComponent = class PlatformAssetComponent {
  http;
  auth;
  access;
  language;
  route;
  success = '';
  panel = 'summary';
  imageErrors = new Set();
  priceUnitKey() {
    return {
      hour: 'ui.labels.t5073129fadb8',
      day: 'ui.labels.t240ce85d68f5',
      night: 'ui.labels.t3359902f0d42'
    }[this.data?.asset?.pricing?.pricingUnit] || '';
  }
  priceUnitFallback() {
    const unit = this.data?.asset?.pricing?.pricingUnit;
    return {
      hour: this.x('heure', 'hour'),
      day: this.x('jour', 'day'),
      night: this.x('nuit', 'night')
    }[unit] || unit || '';
  }
  review() {
    this.panel = 'summary';
    setTimeout(() => {
      if (typeof document !== 'undefined') document.getElementById('listing-review')?.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });
    });
  }
  get editScope() {
    const a = this.data?.asset;
    return a ? {
      type: a.assetType,
      id: a.id
    } : null;
  }
  onListingSaved() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.panel = 'summary';
      yield _this.refresh();
      _this.message = _this.x('Annonce enregistrée. Vous pouvez la valider.', 'Listing saved. You can now approve it.');
    })();
  }
  form = {};
  photos = [];
  files = [];
  working = false;
  reason = '';
  publish = false;
  message = '';
  data = null;
  loading = false;
  error = '';
  uid = '';
  initialAction = true;
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
    return _platform_asset_text__WEBPACK_IMPORTED_MODULE_13__.PLATFORM_ASSET_TEXT[this.language.currentLanguage]?.[key] || _platform_asset_text__WEBPACK_IMPORTED_MODULE_13__.PLATFORM_ASSET_TEXT.en[key] || key;
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
  x(fr, en) {
    return this.language.currentLanguage === 'fr' ? fr : en;
  }
  propertyType(value) {
    return typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'checkbox' : 'text';
  }
  image(path) {
    return (0,_services_media_routes__WEBPACK_IMPORTED_MODULE_7__.mediaObjectUrl)(path);
  }
  open(panel) {
    if (this.working) return;
    this.panel = panel;
    this.error = '';
    if (panel === 'edit') {
      this.form = JSON.parse(JSON.stringify(this.data.asset));
      this.photos = this.assetPhotos();
      this.files = [];
    }
  }
  assetPhotos() {
    const m = this.data?.asset?.media || {};
    return [...new Set([m.hero, m.cover, ...(Array.isArray(m.gallery) ? m.gallery : [])].filter(x => typeof x === 'string' && x))];
  }
  choose(event) {
    const input = event.target;
    this.files = Array.from(input.files || []);
  }
  endpoint() {
    const a = this.data.asset;
    return '/api/manage/assets/' + [a.assetType, a.id].map(encodeURIComponent).join('/') + '/content';
  }
  save() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.working || !_this2.form.name?.trim() || !Number.isFinite(Number(_this2.form.pricing?.basePrice)) || Number(_this2.form.pricing.basePrice) < 0) return;
      const a = _this2.data.asset,
        seq = _this2.sequence,
        endpoint = _this2.endpoint(),
        revision = _this2.data.moderation.revision;
      _this2.working = true;
      _this2.error = '';
      try {
        const headers = yield _this2.auth.headers();
        while (_this2.files.length) {
          const file = _this2.files[0];
          const form = new FormData();
          form.append('file', file, file.name);
          form.append('category', a.assetType === 'boat' ? 'boat' : 'gallery');
          form.append('subject', a.id);
          form.append('resourceType', a.assetType);
          form.append('resourceId', a.id);
          const uploaded = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.firstValueFrom)(_this2.http.post(_services_media_routes__WEBPACK_IMPORTED_MODULE_7__.MEDIA_ROUTES.upload, form, {
            headers
          }));
          if (!uploaded?.path) throw Error('upload_failed');
          _this2.photos.push(uploaded.path);
          _this2.files.shift();
        }
        _this2.files = [];
        if (seq !== _this2.sequence || (yield _this2.auth.user()).uid !== _this2.uid) throw Error('asset_context_changed');
        const asset = {
          name: _this2.form.name.trim(),
          headline: _this2.form.headline || '',
          description: _this2.form.description || '',
          'pricing/basePrice': Number(_this2.form.pricing.basePrice),
          'location/city': _this2.form.location?.city || '',
          'location/area': _this2.form.location?.area || '',
          'location/country': _this2.form.location?.country || '',
          'media/hero': _this2.photos[0] || null,
          'media/cover': _this2.photos[0] || null,
          'media/gallery': _this2.photos,
          'media/configured': true
        };
        for (const [key, value] of Object.entries(_this2.form.properties || {})) asset['properties/' + key] = value;
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.firstValueFrom)(_this2.http.patch(endpoint, {
          asset,
          expectedRevision: revision
        }, {
          headers
        }));
        if (seq !== _this2.sequence) return;
        _this2.panel = 'summary';
        yield _this2.refresh();
        _this2.message = _this2.x('Annonce enregistrée. Relisez-la avant de la valider.', 'Listing saved. Review it before approval.');
      } catch (e) {
        _this2.error = _this2.x('Enregistrement impossible.', 'Could not save.') + ' ' + String(e?.error?.error || '');
      } finally {
        _this2.working = false;
      }
    })();
  }
  decide(decision) {
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.working || decision === 'rejected' && !_this3.reason.trim()) return;
      _this3.working = true;
      _this3.error = '';
      const a = _this3.data.asset,
        seq = _this3.sequence;
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.firstValueFrom)(_this3.http.post('/api/platform/admin/listings/' + [a.assetType, a.id].map(encodeURIComponent).join('/') + '/moderation', {
          decision,
          revision: _this3.data.moderation.revision,
          reason: _this3.reason,
          reviewDraft: true,
          publish: decision === 'approved' && _this3.publish
        }, {
          headers: yield _this3.auth.headers()
        }));
        if (seq !== _this3.sequence) return;
        if (decision === 'approved') {
          _this3.success = 'Annonce validée.';
          return;
        }
        yield _this3.refresh();
        _this3.message = _this3.x('Décision enregistrée.', 'Decision saved.');
      } catch (e) {
        _this3.error = _this3.x('Décision impossible. Actualisez le dossier.', 'Could not save decision. Refresh the file.') + ' ' + String(e?.error?.error || '');
      } finally {
        _this3.working = false;
      }
    })();
  }
  refresh() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sequence = ++_this4.sequence;
      _this4.loading = true;
      _this4.data = null;
      _this4.error = '';
      try {
        const type = String(_this4.route.snapshot.paramMap.get('type') || ''),
          id = String(_this4.route.snapshot.paramMap.get('id') || '');
        if (!['boat', 'car', 'property', 'parking', 'pool'].includes(type) || !/^[a-zA-Z0-9_-]+$/.test(id)) throw Error('invalid_scope');
        const uid = (yield _this4.auth.user()).uid;
        _this4.uid = uid;
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.firstValueFrom)(_this4.http.get('/api/platform/admin/assets/' + [type, id].map(encodeURIComponent).join('/'), {
          headers: yield _this4.auth.headers()
        }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_15__.timeout)(20000)));
        if (sequence !== _this4.sequence || (yield _this4.auth.user()).uid !== uid) return;
        _this4.data = data;
        _this4.imageErrors.clear();
        if (_this4.initialAction && _this4.route.snapshot.queryParamMap?.get('action') === 'edit') _this4.panel = 'edit';
        _this4.initialAction = false;
        _this4.publish = false;
        _this4.reason = '';
      } catch (e) {
        if (sequence === _this4.sequence) _this4.error = _this4.t(e.status === 403 ? 'forbidden' : e.status === 404 ? 'notFound' : 'error');
      } finally {
        if (sequence === _this4.sequence) _this4.loading = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_16__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_10__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_11__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_12__.LanguageService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_17__.ActivatedRoute
  }];
};
PlatformAssetComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_18__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_19__.Component)({
  selector: 'app-platform-asset',
  standalone: true,
  imports: [_shared_admin_success_component__WEBPACK_IMPORTED_MODULE_3__.AdminSuccessComponent, _calendar_asset_calendar_link_component__WEBPACK_IMPORTED_MODULE_4__.AssetCalendarLinkComponent, _shared_listing_description_component__WEBPACK_IMPORTED_MODULE_5__.ListingDescriptionComponent, _owner_listings_component__WEBPACK_IMPORTED_MODULE_6__.OwnerListingsComponent, _angular_common__WEBPACK_IMPORTED_MODULE_20__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_21__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_22__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_9__.PlatformLayoutComponent, _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_8__.SiteTextPipe],
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
}
.asset-admin-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0;
}

.asset-admin-nav > a, .asset-admin-nav app-asset-calendar-link {
  margin: 0;
}

.asset-admin-nav > a {
  background: transparent;
  color: #12566a;
  padding: 0.5rem 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}

label {
  display: block;
  margin: 1rem 0;
}

input:not([type=checkbox]), textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem;
  border: 1px solid #aac3cd;
  border-radius: 6px;
  font: inherit;
}

fieldset {
  border: 0;
  padding: 0;
  min-width: 0;
}

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.photos img {
  display: block;
  width: 220px;
  max-width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
}

.description {
  white-space: pre-wrap;
}

.listing-review h3 {
  font-size: 1.35rem;
}

.listing-review .description {
  line-height: 1.7;
  overflow-wrap: anywhere;
}

.review-price {
  padding: 1rem;
  background: #edf5f6;
  border-radius: 10px;
  margin: 1.5rem 0;
}

.review-price p {
  font-size: 1.5rem;
  margin: 0.5rem 0 0;
}

.review-photos {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.review-photos figure {
  margin: 0;
  border: 1px solid #d2e0e4;
  padding: 0.6rem;
  border-radius: 10px;
}

.review-photos img {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: contain;
  background: #f5f7f8;
}

.review-photos figcaption {
  padding: 0.5rem 0;
}

.review-photos a {
  color: inherit;
}

@media (max-width: 650px) {
  .review-photos {
    grid-template-columns: 1fr;
  }
  .review-photos img {
    height: 240px;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/platform-admin/platform-asset.component.scss"],"names":[],"mappings":"AAAA;EAAmB,iBAAA;EAAiB,YAAA;EAAY,kBAAA;EAAkB,cAAA;AAKlE;;AALgF;EAAO,aAAA;EAAa,8BAAA;EAA8B,SAAA;AAWlI;;AAX2I;EAAO,iBAAA;EAAiB,yBAAA;EAAyB,mBAAA;EAAmB,eAAA;EAAe,cAAA;AAmB9N;;AAnB4O;EAAQ,aAAA;EAAa,mBAAA;EAAmB,kBAAA;AAyBpR;;AAzBsS;EAAO,cAAA;AA6B7S;;AA7B2T;EAAG,aAAA;EAAa,gCAAA;EAAgC,WAAA;AAmC3W;;AAnCqX;EAAG,SAAA;EAAS,uBAAA;AAwCjY;;AAxCwZ;EAAM,cAAA;EAAc,cAAA;AA6C5a;;AA7C0b;EAAS,aAAA;EAAa,SAAA;EAAS,eAAA;AAmDzd;;AAnDwe;EAAgB,cAAA;EAAc,iBAAA;AAwDtgB;;AAxDuhB;EAAa,qBAAA;EAAqB,mBAAA;EAAmB,WAAA;EAAW,SAAA;EAAS,kBAAA;EAAkB,oBAAA;EAAmB,8BAAA;EAA2B,qBAAA;EAAqB,eAAA;AAoErrB;;AApEosB;EAAgB,YAAA;AAwEptB;;AAxE+tB;EAAI,gBAAA;AA4EnuB;;AA5EmvB;EAAwB;IAAO,sBAAA;EAiFhxB;EAjFsyB;IAAG,0BAAA;IAA0B,WAAA;EAqFn0B;EArF60B;IAAG,qBAAA;EAwFh1B;EAxFo2B;IAAO,aAAA;EA2F32B;AACF;AA3FA;EAAiB,aAAA;EAAa,mBAAA;EAAmB,SAAA;EAAS,eAAA;EAAe,aAAA;AAkGzE;;AAlGsF;EAA4D,SAAA;AAsGlJ;;AAtG2J;EAAmB,uBAAA;EAAuB,cAAA;EAAc,iBAAA;EAAgB,0BAAA;EAA0B,0BAAA;AA8G7P;;AA5GA;EAAM,cAAA;EAAc,cAAA;AAiHpB;;AAjHkC;EAAoC,cAAA;EAAc,WAAA;EAAW,sBAAA;EAAsB,eAAA;EAAc,yBAAA;EAAyB,kBAAA;EAAkB,aAAA;AA2H9K;;AA3H2L;EAAS,SAAA;EAAS,UAAA;EAAU,YAAA;AAiIvN;;AAjImO;EAAQ,aAAA;EAAa,2DAAA;EAAyD,SAAA;AAuIjT;;AAvI0T;EAAQ,aAAA;EAAa,eAAA;EAAe,SAAA;AA6I9V;;AA7IuW;EAAY,cAAA;EAAc,YAAA;EAAY,eAAA;EAAe,aAAA;EAAa,iBAAA;EAAiB,mBAAA;AAsJ1b;;AAtJ6c;EAAa,qBAAA;AA0J1d;;AAxJA;EAAmB,kBAAA;AA4JnB;;AA5JqC;EAA6B,gBAAA;EAAgB,uBAAA;AAiKlF;;AAjKyG;EAAc,aAAA;EAAa,mBAAA;EAAmB,mBAAA;EAAmB,gBAAA;AAwK1K;;AAxK0L;EAAgB,iBAAA;EAAiB,kBAAA;AA6K3N;;AA7K4O;EAAe,aAAA;EAAa,gDAAA;EAA8C,SAAA;AAmLtT;;AAnL+T;EAAsB,SAAA;EAAS,yBAAA;EAAyB,eAAA;EAAc,mBAAA;AA0LrY;;AA1LwZ;EAAmB,cAAA;EAAc,WAAA;EAAW,aAAA;EAAa,mBAAA;EAAmB,mBAAA;AAkMpe;;AAlMuf;EAA0B,iBAAA;AAsMjhB;;AAtMiiB;EAAiB,cAAA;AA0MljB;;AA1MgkB;EAAwB;IAAe,0BAAA;EA+MrmB;EA/M+nB;IAAmB,aAAA;EAkNlpB;AACF","sourcesContent":[".asset-admin-shell{max-width:1100px;margin:auto;padding:2rem 1rem;color:#153b46}header{display:flex;justify-content:space-between;gap:1rem}.panel{background:white;border:1px solid #cbdde1;border-radius:16px;padding:1.5rem;margin:1rem 0}.notice{padding:1rem;background:#edf5f6;border-radius:8px}.error{color:#b42318}dl{display:grid;grid-template-columns:10rem 1fr;gap:.7rem}dd{margin:0;overflow-wrap:anywhere}small{display:block;color:#567078}.metrics{display:flex;gap:2rem;flex-wrap:wrap}.metrics strong{display:block;font-size:1.8rem}button,nav a{display:inline-block;background:#12566a;color:#fff;border:0;border-radius:8px;padding:.7rem 1rem;margin:.4rem .5rem .4rem 0;text-decoration:none;cursor:pointer}button:disabled{opacity:.5}nav{margin-top:1rem}@media(max-width:650px){header{flex-direction:column}dl{grid-template-columns:1fr;gap:.3rem}dd{margin-bottom:.8rem}.panel{padding:1rem}}\n.asset-admin-nav{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:0}.asset-admin-nav>a,.asset-admin-nav app-asset-calendar-link{margin:0}.asset-admin-nav>a{background:transparent;color:#12566a;padding:.5rem 0;text-decoration:underline;text-underline-offset:3px}\n\nlabel{display:block;margin:1rem 0}input:not([type=checkbox]),textarea{display:block;width:100%;box-sizing:border-box;padding:.7rem;border:1px solid #aac3cd;border-radius:6px;font:inherit}fieldset{border:0;padding:0;min-width:0}.fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}.photos{display:flex;flex-wrap:wrap;gap:1rem}.photos img{display:block;width:220px;max-width:100%;height:160px;object-fit:cover;border-radius:10px}.description{white-space:pre-wrap}\n\n.listing-review h3{font-size:1.35rem}.listing-review .description{line-height:1.7;overflow-wrap:anywhere}.review-price{padding:1rem;background:#edf5f6;border-radius:10px;margin:1.5rem 0}.review-price p{font-size:1.5rem;margin:.5rem 0 0}.review-photos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.review-photos figure{margin:0;border:1px solid #d2e0e4;padding:.6rem;border-radius:10px}.review-photos img{display:block;width:100%;height:300px;object-fit:contain;background:#f5f7f8}.review-photos figcaption{padding:.5rem 0}.review-photos a{color:inherit}@media(max-width:650px){.review-photos{grid-template-columns:1fr}.review-photos img{height:240px}}\n"],"sourceRoot":""}]);
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
module.exports = "<app-platform-layout><main class=\"asset-admin-shell\"><header><div><nav class=\"asset-admin-nav\" [attr.aria-label]=\"x('Navigation du bien','Asset navigation')\"><a routerLink=\"/platform/admin\" [queryParams]=\"{tab:'assets'}\">← {{t('back')}}</a><app-asset-calendar-link *ngIf=\"data?.asset\" [type]=\"data.asset.assetType\" [assetId]=\"data.asset.id\"></app-asset-calendar-link></nav><h1>{{x('Modérer l’annonce','Moderate listing')}}</h1></div><button (click)=\"refresh()\" [disabled]=\"loading||working\">{{t('refresh')}}</button></header><p *ngIf=\"error\" role=\"alert\" class=\"error\">{{error}}</p>\n<p *ngIf=\"message\" role=\"status\">{{message}}</p><section *ngIf=\"data && access.authenticatedUid===uid && access.isPlatformAdmin\" class=\"panel\"><h2>{{data.asset.name}}</h2><p class=\"notice\">{{t('notice')}}</p><p *ngIf=\"data.asset.archived\" class=\"notice\">{{t('archived')}}</p><dl><dt>{{t('owner')}}</dt><dd><strong>{{data.owner.name}}</strong><small>{{data.owner.email}}</small></dd><dt>{{t('type')}}</dt><dd>{{data.asset.assetType}}</dd><dt>{{t('prefix')}}</dt><dd>godirect.fr/b/{{data.asset.prefix}}</dd><dt>{{t('location')}}</dt><dd>{{data.asset.location?.city}} {{data.asset.location?.country}}</dd><dt>{{t('price')}}</dt><dd>{{data.asset.pricing?.basePrice|number:'1.2-2'}} {{data.asset.pricing?.currency}} / {{data.asset.pricing?.pricingUnit}}</dd><dt>{{t('moderation')}}</dt><dd>{{data.moderation.status}}</dd><dt>{{t('subscription')}}</dt><dd>{{data.subscription.status}}<small>{{t('expiry')}} : {{data.subscription.paidUntil?(data.subscription.paidUntil*1000|date:'dd/MM/yyyy'):'—'}}</small></dd></dl>\n\n<p *ngIf=\"data.documents\">{{ 'ui.documents.title' | siteText }} : {{ ('ui.documents.status_'+data.documents.status) | siteText }} · {{data.documents.validated}} / {{data.documents.total}}</p><nav><a [routerLink]=\"['/platform/admin/documents',data.asset.assetType,data.asset.id]\">{{x('Valider les documents','Review documents')}}</a><button (click)=\"review()\">{{x('Valider l’annonce','Review listing')}}</button><button *ngIf=\"data.permissions.content\" (click)=\"open('edit')\">{{x('Modifier l’annonce','Edit listing')}}</button><a *ngIf=\"!data.asset.archived\" [routerLink]=\"link()\">{{x('Voir le site client','View customer site')}}</a></nav><p>{{x('Administration : justificatifs, annonce et publication. La gestion des réservations reste au propriétaire ou à son concierge habilité.','Administration: documents, listing and publication. Booking management remains with the owner or their authorized concierge.')}}</p></section>\n<ng-container *ngIf=\"data && access.authenticatedUid===uid && access.isPlatformAdmin && !data.asset.archived\">\n<section *ngIf=\"panel!=='edit'\" class=\"panel listing-review\" id=\"listing-review\" aria-labelledby=\"review-title\"><h2 id=\"review-title\">{{x('Annonce à vérifier','Listing to review')}}</h2><h3>{{data.asset.name}}</h3><app-listing-description [text]=\"data.asset.description||x('Aucune description renseignée.','No description provided.')\"></app-listing-description><div class=\"review-price\"><strong>{{t('price')}}</strong><p>{{data.asset.pricing?.basePrice|number:'1.2-2'}} {{data.asset.pricing?.currency||'EUR'}} / {{priceUnitKey()|siteText:priceUnitFallback()}}</p></div><h3>{{x('Photos','Photos')}} ({{assetPhotos().length}})</h3><p *ngIf=\"!assetPhotos().length\">{{x('Aucune photo ajoutée à cette annonce.','No photos have been added to this listing.')}}</p><p *ngIf=\"assetPhotos().length\">{{x('Cliquez sur une photo pour l’ouvrir en grand.','Click a photo to open it at full size.')}}</p><div class=\"review-photos\"><figure *ngFor=\"let photo of assetPhotos();let i=index\"><a [href]=\"image(photo)\" target=\"_blank\" rel=\"noopener\"><img [src]=\"image(photo)\" [alt]=\"data.asset.name+' — '+(i+1)\" loading=\"lazy\" (error)=\"imageErrors.add(photo)\"><figcaption>{{x('Photo','Photo')}} {{i+1}}</figcaption></a><p class=\"error\" *ngIf=\"imageErrors.has(photo)\">{{x('Impossible de charger cette photo.','Could not load this photo.')}}</p></figure></div></section>\n<app-owner-listings *ngIf=\"panel==='edit'\" [adminScope]=\"editScope\" (editorClosed)=\"open('summary')\" (listingSaved)=\"onListingSaved()\"></app-owner-listings>\n<section class=\"panel\" *ngIf=\"panel==='summary'\"><h2>{{x('Modérer les textes et les images','Review text and images')}}</h2><p>{{x('Examinez le titre, la description, les photos et le prix affichés ci-dessus avant de prendre votre décision.','Review the title, description, photos and price above before making your decision.')}}</p><label>{{x('Observations (obligatoires pour refuser)','Comments (required for rejection)')}}<textarea [(ngModel)]=\"reason\" maxlength=\"2000\" [disabled]=\"working\"></textarea></label><label><input type=\"checkbox\" [(ngModel)]=\"publish\" [disabled]=\"working||!data.documents?.approved||!data.subscription.entitled\">{{x('Publier aussi l’annonce après validation','Also publish the listing after approval')}}</label><p *ngIf=\"!data.documents?.approved||!data.subscription.entitled\">{{x('Publication : justificatifs validés ou dispensés et abonnement actif requis. La validation seule ne publie pas un bien hors ligne.','Publication requires approved or exempted documents and an active subscription. Approval alone does not publish an offline asset.')}}</p><button (click)=\"decide('approved')\" [disabled]=\"working\">{{x('Valider l’annonce','Approve listing')}}</button><button (click)=\"decide('rejected')\" [disabled]=\"working||!reason.trim()\">{{x('Refuser l’annonce','Reject listing')}}</button></section></ng-container></main></app-platform-layout>\n\n<app-admin-success (dismissed)=\"success=''\" *ngIf=\"success\" [message]=\"success\"></app-admin-success>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_platform-admin_platform-asset_component_ts.js.map