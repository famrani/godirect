(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_workspace_component_ts"],{

/***/ 18816:
/*!**************************************************!*\
  !*** ./src/app/workspace/workspace.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkspaceComponent: () => (/* binding */ WorkspaceComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _workspace_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./workspace.component.html?ngResource */ 78632);
/* harmony import */ var _workspace_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./workspace.component.scss?ngResource */ 30366);
/* harmony import */ var _workspace_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_workspace_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _profile_roles_profile_roles_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../profile-roles/profile-roles.component */ 62632);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 19999);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _services_account_header__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/account-header */ 1768);
/* harmony import */ var _services_workspace_navigation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../services/workspace-navigation */ 91613);

















let WorkspaceComponent = class WorkspaceComponent {
  http;
  auth;
  access;
  language;
  route;
  owner = false;
  kind = 'reservations';
  assets = [];
  rows = [];
  selected = '';
  loading = false;
  error = '';
  saved = false;
  profile = {};
  sub;
  request = 0;
  uid = '';
  constructor(http, auth, access, language, route) {
    this.http = http;
    this.auth = auth;
    this.access = access;
    this.language = language;
    this.route = route;
  }
  t(key) {
    return (0,_services_account_header__WEBPACK_IMPORTED_MODULE_8__.accountHeaderText)(this.language.currentLanguage, key);
  }
  ngOnInit() {
    this.sub = (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.combineLatest)([this.route.paramMap, this.route.queryParamMap]).subscribe(() => {
      this.owner = this.route.snapshot.data['owner'] === true;
      this.kind = this.route.snapshot.data['kind'] || this.route.snapshot.paramMap.get('section') || 'reservations';
      if (!['profile', 'reservations', 'bookings', 'payments', 'ratings'].includes(this.kind)) this.kind = 'reservations';
      const q = this.route.snapshot.queryParamMap;
      this.selected = q.get('type') && q.get('id') ? `${q.get('type')}/${q.get('id')}` : '';
      void this.refresh();
    });
  }
  ngOnDestroy() {
    this.request++;
    this.sub?.unsubscribe();
    this.rows = [];
    this.assets = [];
  }
  path(a, tail = 'home') {
    return (0,_services_workspace_navigation__WEBPACK_IMPORTED_MODULE_9__.assetLink)(a, tail);
  }
  get concierge() {
    return this.route?.snapshot?.data?.['concierge'] === true;
  }
  get visible() {
    return this.rows.filter(b => !this.selected || `${b.assetType}/${b.assetId}` === this.selected);
  }
  detail(b) {
    return (0,_services_workspace_navigation__WEBPACK_IMPORTED_MODULE_9__.assetLink)(b, this.owner ? 'admin/reservations' : 'my-bookings');
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const request = ++_this.request;
      _this.loading = true;
      _this.error = '';
      _this.rows = [];
      try {
        const user = yield _this.auth.user(),
          uid = user.uid,
          headers = yield _this.auth.headers();
        _this.uid = uid;
        if (_this.kind === 'profile') {
          const p = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.http.get('/api/me/profile', {
            headers
          }));
          if (request !== _this.request || (yield _this.auth.user()).uid !== uid) return;
          _this.profile = p;
        } else if (_this.owner) {
          const list = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.http.get(_this.concierge ? '/api/concierge/assets' : '/api/owner/listings', {
            headers
          }));
          if (request !== _this.request || (yield _this.auth.user()).uid !== uid) return;
          _this.assets = _this.concierge ? list.filter(a => a.permissions?.bookings) : (0,_services_workspace_navigation__WEBPACK_IMPORTED_MODULE_9__.ownedAssets)(list, uid);
          if (_this.selected && !_this.assets.some(a => `${a.assetType}/${a.id}` === _this.selected)) throw new Error('owner_required');
          if (_this.kind === 'ratings') {
            if (!_this.selected && _this.assets.length === 1) _this.selected = `${_this.assets[0].assetType}/${_this.assets[0].id}`;
            if (_this.selected) {
              const [type, id] = _this.selected.split('/');
              const ratings = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.http.get(`/api/manage/assets/${type}/${id}/feedbacks`, {
                headers
              }));
              if (request === _this.request && (yield _this.auth.user()).uid === uid) _this.rows = ratings;
            }
          } else {
            const rows = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.http.get(_this.concierge ? '/api/manage/bookings' : `/api/owners/${encodeURIComponent(uid)}/bookings`, {
              headers
            }));
            if (request === _this.request && (yield _this.auth.user()).uid === uid) _this.rows = rows.filter(b => (_this.concierge || b.ownerId === uid) && _this.assets.some(a => a.assetType === b.assetType && a.id === b.assetId));
          }
        } else {
          const rows = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.http.get(_this.kind === 'ratings' ? '/api/me/feedbacks' : '/api/me/bookings', {
            headers
          }));
          if (request === _this.request && (yield _this.auth.user()).uid === uid) _this.rows = rows;
        }
      } catch {
        if (request === _this.request) {
          _this.rows = [];
          _this.assets = [];
          _this.error = _this.t('error');
        }
      } finally {
        if (request === _this.request) _this.loading = false;
      }
    })();
  }
  save() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.loading) return;
      _this2.loading = true;
      _this2.error = '';
      _this2.saved = false;
      try {
        if ((yield _this2.auth.user()).uid !== _this2.uid) throw new Error('authentication_changed');
        const p = _this2.profile;
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this2.http.put('/api/me/profile', {
          firstname: p.firstname || '',
          lastname: p.lastname || '',
          phone: p.phone || '',
          address: p.address || '',
          displayName: [p.firstname, p.lastname].filter(Boolean).join(' ')
        }, {
          headers: yield _this2.auth.headers()
        }));
        yield _this2.access.refresh();
        _this2.saved = true;
      } catch {
        _this2.error = _this2.t('error');
      } finally {
        _this2.loading = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_5__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_6__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_7__.LanguageService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_13__.ActivatedRoute
  }];
};
WorkspaceComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_14__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_15__.Component)({
  selector: 'app-workspace',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_16__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_18__.RouterModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_4__.PlatformLayoutComponent, _profile_roles_profile_roles_component__WEBPACK_IMPORTED_MODULE_3__.ProfileRolesComponent],
  template: _workspace_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_workspace_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], WorkspaceComponent);


/***/ }),

/***/ 30366:
/*!***************************************************************!*\
  !*** ./src/app/workspace/workspace.component.scss?ngResource ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
}

.workspace {
  max-width: 1120px;
  padding: 32px 20px;
  margin: auto;
}

.workspace header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.workspace h1 {
  font-size: 28px;
}

.workspace label {
  display: grid;
  gap: 8px;
  margin: 16px 0;
}

.workspace input, .workspace select, .workspace textarea {
  padding: 12px;
  border: 1px solid #bccfc9;
  border-radius: 8px;
  font: inherit;
}

.workspace button, .workspace a {
  padding: 10px 14px;
  border-radius: 8px;
  color: #173b36;
}

.workspace button {
  cursor: pointer;
  border: 1px solid #bccfc9;
  background: white;
}

.assets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.assets article, .record {
  padding: 20px;
  border: 1px solid #dce5df;
  border-radius: 12px;
  background: white;
  margin: 16px 0;
}

.assets article strong, .assets article small {
  display: block;
  margin-bottom: 12px;
}

.record h2 {
  font-size: 20px;
}

form {
  max-width: 650px;
}

[role=alert] {
  color: #9b302b;
}`, "",{"version":3,"sources":["webpack://./src/app/workspace/workspace.component.scss"],"names":[],"mappings":"AAAA;EAAM,cAAA;AAEN;;AAFoB;EAAW,iBAAA;EAAiB,kBAAA;EAAkB,YAAA;AAQlE;;AAR8E;EAAkB,aAAA;EAAa,8BAAA;EAA8B,mBAAA;EAAmB,SAAA;AAe9J;;AAfuK;EAAc,eAAA;AAmBrL;;AAnBoM;EAAiB,aAAA;EAAa,QAAA;EAAQ,cAAA;AAyB1O;;AAzBwP;EAAuD,aAAA;EAAa,yBAAA;EAAyB,kBAAA;EAAkB,aAAA;AAgCvW;;AAhCoX;EAA+B,kBAAA;EAAkB,kBAAA;EAAkB,cAAA;AAsCvb;;AAtCqc;EAAkB,eAAA;EAAe,yBAAA;EAAyB,iBAAA;AA4C/f;;AA5CghB;EAAQ,aAAA;EAAa,2DAAA;EAAyD,SAAA;AAkD9lB;;AAlDumB;EAAwB,aAAA;EAAa,yBAAA;EAAyB,mBAAA;EAAmB,iBAAA;EAAiB,cAAA;AA0DzsB;;AA1DutB;EAA6C,cAAA;EAAc,mBAAA;AA+DlxB;;AA/DqyB;EAAW,eAAA;AAmEhzB;;AAnE+zB;EAAK,gBAAA;AAuEp0B;;AAvEo1B;EAAa,cAAA;AA2Ej2B","sourcesContent":[":host{display:block}.workspace{max-width:1120px;padding:32px 20px;margin:auto}.workspace header{display:flex;justify-content:space-between;align-items:center;gap:20px}.workspace h1{font-size:28px}.workspace label{display:grid;gap:8px;margin:16px 0}.workspace input,.workspace select,.workspace textarea{padding:12px;border:1px solid #bccfc9;border-radius:8px;font:inherit}.workspace button,.workspace a{padding:10px 14px;border-radius:8px;color:#173b36}.workspace button{cursor:pointer;border:1px solid #bccfc9;background:white}.assets{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.assets article,.record{padding:20px;border:1px solid #dce5df;border-radius:12px;background:white;margin:16px 0}.assets article strong,.assets article small{display:block;margin-bottom:12px}.record h2{font-size:20px}form{max-width:650px}[role=alert]{color:#9b302b}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 57440:
/*!***********************************************************************!*\
  !*** ./src/app/profile-roles/profile-roles.component.html?ngResource ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<section class=\"profile-roles\" aria-labelledby=\"profile-role-title\"><header><h2 id=\"profile-role-title\">{{t('profileRoles')}}</h2><button type=\"button\" (click)=\"refresh()\" [disabled]=\"loading\">{{t('refresh')}}</button></header><p *ngIf=\"loading\" role=\"status\">{{t('loading')}}</p><p *ngIf=\"error\" role=\"alert\">{{t('error')}}</p><ng-container *ngIf=\"!loading && access.authenticatedUid===uid && roles.length\"><p class=\"primary-role\">{{t('primaryRole')}} : <strong>{{label(primaryRole)}}</strong></p><ul><li *ngFor=\"let role of roles\" [class.primary]=\"role===primaryRole\">{{label(role)}}</li></ul><p class=\"role-help\">{{t('roleHelp')}}</p></ng-container></section>\n";

/***/ }),

/***/ 62632:
/*!**********************************************************!*\
  !*** ./src/app/profile-roles/profile-roles.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileRolesComponent: () => (/* binding */ ProfileRolesComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _profile_roles_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile-roles.component.html?ngResource */ 57440);
/* harmony import */ var _profile_roles_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./profile-roles.component.scss?ngResource */ 73734);
/* harmony import */ var _profile_roles_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_profile_roles_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 72354);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _services_account_header__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/account-header */ 1768);












let ProfileRolesComponent = class ProfileRolesComponent {
  http;
  auth;
  access;
  language;
  refreshKey = '';
  uid = '';
  roles = [];
  primaryRole = '';
  loading = false;
  error = false;
  sequence = 0;
  constructor(http, auth, access, language) {
    this.http = http;
    this.auth = auth;
    this.access = access;
    this.language = language;
  }
  t(key) {
    return (0,_services_account_header__WEBPACK_IMPORTED_MODULE_6__.accountHeaderText)(this.language.currentLanguage, key);
  }
  label(role) {
    return this.t({
      customer: 'client',
      assetOwner: 'assetOwnerRole',
      concierge: 'concierge',
      admin: 'admin'
    }[role] || role);
  }
  ngOnInit() {
    void this.refresh();
  }
  ngOnChanges(changes) {
    if (changes['refreshKey'] && !changes['refreshKey'].firstChange) void this.refresh();
  }
  ngOnDestroy() {
    this.sequence++;
    this.roles = [];
    this.primaryRole = '';
  }
  refresh() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sequence = ++_this.sequence;
      _this.loading = true;
      _this.error = false;
      _this.roles = [];
      _this.primaryRole = '';
      try {
        const uid = (yield _this.auth.user()).uid;
        _this.uid = uid;
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.firstValueFrom)(_this.http.get('/api/me/roles', {
          headers: yield _this.auth.headers()
        }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.timeout)(10000)));
        if (sequence !== _this.sequence || (yield _this.auth.user()).uid !== uid || data.uid !== uid) return;
        const allowed = ['customer', 'assetOwner', 'concierge', 'admin'];
        _this.roles = Array.isArray(data.roles) ? [...new Set(data.roles.filter(r => allowed.includes(r)))] : [];
        _this.primaryRole = _this.roles.includes(data.primaryRole) ? data.primaryRole : _this.roles[0] || '';
      } catch {
        if (sequence === _this.sequence) _this.error = true;
      } finally {
        if (sequence === _this.sequence) _this.loading = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_4__.AssetAccessService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_5__.LanguageService
  }];
  static propDecorators = {
    refreshKey: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_10__.Input
    }]
  };
};
ProfileRolesComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_11__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.Component)({
  selector: 'app-profile-roles',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule],
  template: _profile_roles_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_profile_roles_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], ProfileRolesComponent);


/***/ }),

/***/ 73734:
/*!***********************************************************************!*\
  !*** ./src/app/profile-roles/profile-roles.component.scss?ngResource ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
  grid-column: 1/-1;
}

.profile-roles {
  padding: 1.1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #cbdde1;
  border-radius: 12px;
  background: #f2f7f7;
  color: #153b46;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

h2 {
  font-size: 1.1rem;
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

li {
  border: 1px solid #b8cdd3;
  border-radius: 20px;
  background: white;
  padding: 0.35rem 0.75rem;
}

.primary {
  border-color: #12566a;
  font-weight: 600;
}

.primary-role {
  margin-bottom: 0.5rem;
}

.role-help {
  font-size: 0.9rem;
  margin-bottom: 0;
  color: #526b70;
}

button {
  background: white;
  border: 1px solid #b8cdd3;
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  color: #153b46;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}`, "",{"version":3,"sources":["webpack://./src/app/profile-roles/profile-roles.component.scss"],"names":[],"mappings":"AAAA;EAAM,cAAA;EAAc,iBAAA;AAGpB;;AAHqC;EAAe,eAAA;EAAe,qBAAA;EAAqB,yBAAA;EAAyB,mBAAA;EAAmB,mBAAA;EAAmB,cAAA;AAYvJ;;AAZqK;EAAO,aAAA;EAAa,mBAAA;EAAmB,8BAAA;EAA8B,SAAA;EAAS,eAAA;AAoBnP;;AApBkQ;EAAG,iBAAA;EAAiB,SAAA;AAyBtR;;AAzB+R;EAAG,gBAAA;EAAgB,UAAA;EAAU,aAAA;EAAa,WAAA;EAAU,eAAA;AAiCnV;;AAjCkW;EAAG,yBAAA;EAAyB,mBAAA;EAAmB,iBAAA;EAAiB,wBAAA;AAwCla;;AAxCwb;EAAS,qBAAA;EAAqB,gBAAA;AA6Ctd;;AA7Cse;EAAc,qBAAA;AAiDpf;;AAjDwgB;EAAW,iBAAA;EAAgB,gBAAA;EAAgB,cAAA;AAuDnjB;;AAvDikB;EAAO,iBAAA;EAAiB,yBAAA;EAAyB,kBAAA;EAAkB,sBAAA;EAAoB,cAAA;EAAc,eAAA;AAgEtqB;;AAhEqrB;EAAgB,YAAA;AAoErsB","sourcesContent":[":host{display:block;grid-column:1/-1}.profile-roles{padding:1.1rem;margin-bottom:1.5rem;border:1px solid #cbdde1;border-radius:12px;background:#f2f7f7;color:#153b46}header{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap}h2{font-size:1.1rem;margin:0}ul{list-style:none;padding:0;display:flex;gap:.5rem;flex-wrap:wrap}li{border:1px solid #b8cdd3;border-radius:20px;background:white;padding:.35rem .75rem}.primary{border-color:#12566a;font-weight:600}.primary-role{margin-bottom:.5rem}.role-help{font-size:.9rem;margin-bottom:0;color:#526b70}button{background:white;border:1px solid #b8cdd3;border-radius:8px;padding:.4rem .7rem;color:#153b46;cursor:pointer}button:disabled{opacity:.5}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 78632:
/*!***************************************************************!*\
  !*** ./src/app/workspace/workspace.component.html?ngResource ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"workspace\"><header><div><p>{{t(owner?'bookingManagement':'account')}}</p><h1>{{t(kind==='bookings'?'customerBookings':kind)}}</h1></div><button type=\"button\" (click)=\"refresh()\" [disabled]=\"loading\">{{t('refresh')}}</button></header>\n<p *ngIf=\"error\" role=\"alert\">{{error}}</p><p *ngIf=\"loading\" role=\"status\">…</p>\n<ng-container *ngIf=\"access.authenticatedUid===uid\"><form *ngIf=\"kind==='profile'&&!loading\" (ngSubmit)=\"save()\"><app-profile-roles [refreshKey]=\"uid\"></app-profile-roles><label>{{t('firstname')}}<input name=\"firstname\" [(ngModel)]=\"profile.firstname\" maxlength=\"120\"></label><label>{{t('lastname')}}<input name=\"lastname\" [(ngModel)]=\"profile.lastname\" maxlength=\"120\"></label><label>Email<input [value]=\"profile.email||''\" readonly></label><label>{{t('phone')}}<input name=\"phone\" [(ngModel)]=\"profile.phone\" maxlength=\"80\"></label><label>{{t('address')}}<textarea name=\"address\" [(ngModel)]=\"profile.address\" maxlength=\"1000\"></textarea></label><button [disabled]=\"loading\">{{t('save')}}</button><p *ngIf=\"saved\" role=\"status\">{{t('saved')}}</p></form>\n<ng-container *ngIf=\"kind!=='profile'\"><label *ngIf=\"owner\">{{t('chooseAsset')}}<select [(ngModel)]=\"selected\" (ngModelChange)=\"kind==='ratings'?refresh():null\"><option value=\"\">{{t(kind==='ratings'?'chooseAsset':'allAssets')}}</option><option *ngFor=\"let a of assets\" [value]=\"a.assetType+'/'+a.id\">{{a.name}} · {{a.assetType}}</option></select></label>\n<div class=\"assets\" *ngIf=\"owner\"><article *ngFor=\"let a of assets\" [hidden]=\"selected&&selected!==a.assetType+'/'+a.id\"><strong>{{a.name}}</strong><small>{{a.assetType}} / {{a.id}}</small><a [routerLink]=\"path(a,'admin/reservations')\">{{t('reservations')}}</a><a [routerLink]=\"path(a,'admin/calendar')\">{{t('calendar')}}</a></article></div>\n<p *ngIf=\"!loading&&!error&&!visible.length\">{{t('empty')}}</p><article class=\"record\" *ngFor=\"let b of visible\"><h2>{{b.assetName||b.assetId}}</h2><small>{{b.assetType}} / {{b.assetId}}</small><ng-container *ngIf=\"kind!=='ratings'\"><p>{{b.startAt||b.outingDate}} → {{b.endAt}}</p><p>{{b.status}}</p><p *ngIf=\"kind==='payments'\">{{b.totalAmount||b.rentalAmount||0}} {{b.currency||'EUR'}} · {{b.paymentStatus||b.status}}</p><a [routerLink]=\"detail(b)\" [queryParams]=\"{bookingId:b.id||b.bookingId}\">{{t('open')}}</a></ng-container><ng-container *ngIf=\"kind==='ratings'\"><p>{{b.rating}} / 5</p><p>{{b.comments}}</p></ng-container></article></ng-container>\n</ng-container></main></app-platform-layout>";

/***/ })

}]);
//# sourceMappingURL=src_app_workspace_workspace_component_ts.js.map