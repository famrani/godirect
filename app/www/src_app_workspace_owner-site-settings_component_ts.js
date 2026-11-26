(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_owner-site-settings_component_ts"],{

/***/ 5967:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/workspace/owner-site-settings.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ%3D%3D!./src/app/workspace/owner-site-settings.component.ts ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `main{max-width:48rem;margin:auto;padding:1.2rem;color:#173d37}nav{display:flex;gap:1rem;flex-wrap:wrap}form{padding:1rem;margin:1rem 0;background:white;border:1px solid #d0dfd8;border-radius:12px}label{display:grid;gap:.35rem;margin:.7rem 0}input,textarea{padding:.6rem;border:1px solid #acbdb6;border-radius:6px;min-width:0}button{background:#175348;color:white;border:0;border-radius:8px;padding:.65rem}p[role=alert]{color:#9c2519}`, "",{"version":3,"sources":["webpack://./src/app/workspace/owner-site-settings.component.ts"],"names":[],"mappings":"AAAA,KAAK,eAAe,CAAC,WAAW,CAAC,cAAc,CAAC,aAAa,CAAC,IAAI,YAAY,CAAC,QAAQ,CAAC,cAAc,CAAC,KAAK,YAAY,CAAC,aAAa,CAAC,gBAAgB,CAAC,wBAAwB,CAAC,kBAAkB,CAAC,MAAM,YAAY,CAAC,UAAU,CAAC,cAAc,CAAC,eAAe,aAAa,CAAC,wBAAwB,CAAC,iBAAiB,CAAC,WAAW,CAAC,OAAO,kBAAkB,CAAC,WAAW,CAAC,QAAQ,CAAC,iBAAiB,CAAC,cAAc,CAAC,cAAc,aAAa","sourcesContent":["main{max-width:48rem;margin:auto;padding:1.2rem;color:#173d37}nav{display:flex;gap:1rem;flex-wrap:wrap}form{padding:1rem;margin:1rem 0;background:white;border:1px solid #d0dfd8;border-radius:12px}label{display:grid;gap:.35rem;margin:.7rem 0}input,textarea{padding:.6rem;border:1px solid #acbdb6;border-radius:6px;min-width:0}button{background:#175348;color:white;border:0;border-radius:8px;padding:.65rem}p[role=alert]{color:#9c2519}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 78464:
/*!************************************************************!*\
  !*** ./src/app/workspace/owner-site-settings.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OwnerSiteSettingsComponent: () => (/* binding */ OwnerSiteSettingsComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/app/workspace/owner-site-settings.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ%3D%3D!./src/app/workspace/owner-site-settings.component.ts */ 5967);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);









let OwnerSiteSettingsComponent = class OwnerSiteSettingsComponent {
  http;
  auth;
  url = '/api/owner/site-settings';
  siteUrl = '';
  home = {
    title: '',
    intro: ''
  };
  contact = {
    email: '',
    phone: '',
    address: ''
  };
  loading = true;
  loadError = false;
  saving = '';
  success = {
    home: '',
    contact: ''
  };
  error = {
    home: '',
    contact: ''
  };
  constructor(http, auth) {
    this.http = http;
    this.auth = auth;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.loading = true;
      _this.loadError = false;
      try {
        const s = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this.http.get(_this.url, {
          headers: yield _this.auth.headers()
        }));
        if (/^[a-z0-9-]+$/.test(s.prefix || '')) _this.siteUrl = 'https://' + s.prefix + '.godirect.fr';
        _this.home = {
          ..._this.home,
          ...s.home
        };
        _this.contact = {
          ..._this.contact,
          ...s.contact
        };
      } catch {
        _this.loadError = true;
      } finally {
        _this.loading = false;
      }
    })();
  }
  save(section) {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.saving) return;
      _this2.saving = section;
      _this2.success[section] = '';
      _this2.error[section] = '';
      try {
        const body = section === 'home' ? {
          home: {
            ..._this2.home
          }
        } : {
          ..._this2.contact
        };
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this2.http.put(_this2.url, body, {
          headers: yield _this2.auth.headers()
        }));
        _this2.success[section] = section === 'home' ? 'Page d’accueil enregistrée.' : 'Coordonnées publiques enregistrées.';
      } catch {
        _this2.error[section] = 'Enregistrement impossible. Vérifiez les champs puis réessayez.';
      } finally {
        _this2.saving = '';
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__.ReservationAuthService
  }];
};
OwnerSiteSettingsComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.FormsModule],
  template: `
<main><h1>Paramètres de mon site</h1>
<p *ngIf="loading" role="status">Chargement des réglages…</p>
<p *ngIf="loadError" role="alert">Impossible de charger les réglages. <button type="button" (click)="ngOnInit()">Réessayer</button></p>
<ng-container *ngIf="!loading && !loadError">
<p *ngIf="!siteUrl">Créez votre première annonce pour obtenir l’adresse de votre vitrine.</p>
<nav *ngIf="siteUrl"><a [href]="siteUrl+'/?view=client'" target="_blank" rel="noopener">Voir mon accueil public ↗</a><a [href]="siteUrl+'/contact'" target="_blank" rel="noopener">Voir ma page Contact ↗</a></nav>
<form (ngSubmit)="save('home')"><h2>Page d’accueil</h2><label>Titre<input name="title" maxlength="100" [(ngModel)]="home.title"></label><label>Présentation<textarea name="intro" rows="5" maxlength="2500" [(ngModel)]="home.intro"></textarea></label><button [disabled]="!!saving">Enregistrer l’accueil</button><p role="status">{{success.home}}</p><p *ngIf="error.home" role="alert">{{error.home}}</p></form>
<form (ngSubmit)="save('contact')"><h2>Coordonnées publiques</h2><p>Ces informations seront visibles sur la page Contact de votre vitrine.</p><label>Email<input name="email" type="email" email maxlength="254" [(ngModel)]="contact.email"></label><label>Téléphone<input name="phone" type="tel" maxlength="40" [(ngModel)]="contact.phone"></label><label>Adresse<input name="address" maxlength="300" [(ngModel)]="contact.address"></label><button [disabled]="!!saving">Enregistrer les coordonnées</button><p role="status">{{success.contact}}</p><p *ngIf="error.contact" role="alert">{{error.contact}}</p></form>
</ng-container></main>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NDhyZW07bWFyZ2luOmF1dG87cGFkZGluZzoxLjJyZW07Y29sb3I6IzE3M2QzN31uYXZ7ZGlzcGxheTpmbGV4O2dhcDoxcmVtO2ZsZXgtd3JhcDp3cmFwfWZvcm17cGFkZGluZzoxcmVtO21hcmdpbjoxcmVtIDA7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXI6MXB4IHNvbGlkICNkMGRmZDg7Ym9yZGVyLXJhZGl1czoxMnB4fWxhYmVse2Rpc3BsYXk6Z3JpZDtnYXA6LjM1cmVtO21hcmdpbjouN3JlbSAwfWlucHV0LHRleHRhcmVhe3BhZGRpbmc6LjZyZW07Ym9yZGVyOjFweCBzb2xpZCAjYWNiZGI2O2JvcmRlci1yYWRpdXM6NnB4O21pbi13aWR0aDowfWJ1dHRvbntiYWNrZ3JvdW5kOiMxNzUzNDg7Y29sb3I6d2hpdGU7Ym9yZGVyOjA7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzouNjVyZW19cFtyb2xlPWFsZXJ0XXtjb2xvcjojOWMyNTE5fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_owner_site_settings_component_ts__WEBPACK_IMPORTED_MODULE_1___default())]
})], OwnerSiteSettingsComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_owner-site-settings_component_ts.js.map