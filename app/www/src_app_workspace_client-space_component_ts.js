(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_workspace_client-space_component_ts"],{

/***/ 36455:
/*!*****************************************************!*\
  !*** ./src/app/workspace/client-space.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClientSpaceComponent: () => (/* binding */ ClientSpaceComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/app/workspace/client-space.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ%3D%3D!./src/app/workspace/client-space.component.ts */ 94361);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_asset_domain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/asset-domain */ 94984);











let ClientSpaceComponent = class ClientSpaceComponent {
  http;
  auth;
  access;
  preview = location.pathname === '/owner/client-view';
  tabs = [{
    id: 'assets',
    label: 'Biens'
  }, {
    id: 'bookings',
    label: 'Mes réservations'
  }, {
    id: 'payments',
    label: 'Mes paiements'
  }, {
    id: 'ratings',
    label: 'Mes avis'
  }];
  empty = {
    assets: 'Aucune annonce publique dans cet espace.',
    bookings: 'Aucune réservation à votre nom dans cet espace.',
    payments: 'Aucun paiement associé à vos réservations dans cet espace.',
    ratings: 'Aucun avis dans cet espace.'
  };
  section = 'assets';
  rows = [];
  error = '';
  loading = false;
  uid = '';
  sequence = 0;
  constructor(http, auth, access) {
    this.http = http;
    this.auth = auth;
    this.access = access;
  }
  ngOnInit() {
    void this.load('assets');
  }
  ngOnDestroy() {
    this.sequence++;
  }
  load(section) {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const seq = ++_this.sequence;
      _this.section = section;
      _this.rows = [];
      _this.uid = '';
      _this.error = '';
      _this.loading = true;
      try {
        if (!_this.preview && !(0,_services_asset_domain__WEBPACK_IMPORTED_MODULE_4__.dedicatedAsset)()) throw Error('scope');
        const needsAuth = _this.preview || section !== 'assets';
        const uid = needsAuth ? (yield _this.auth.user()).uid : '';
        const headers = needsAuth ? yield _this.auth.headers() : undefined;
        const url = section === 'assets' ? '/api/assets' : section === 'ratings' ? '/api/me/feedbacks' : '/api/me/bookings';
        const rows = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this.http.get(url + (_this.preview ? '?preview=owner' : ''), {
          headers
        }));
        if (seq === _this.sequence && (!needsAuth || uid === _this.access.authenticatedUid)) {
          _this.rows = rows;
          _this.uid = uid;
        }
      } catch {
        if (seq === _this.sequence) _this.error = 'Impossible de charger cet espace. Vérifiez votre connexion et votre session.';
      } finally {
        if (seq === _this.sequence) _this.loading = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__.ReservationAuthService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_3__.AssetAccessService
  }];
};
ClientSpaceComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule],
  selector: 'app-client-space',
  template: `<main><a *ngIf="preview" routerLink="/owner/listings">← Retour à mon espace propriétaire</a><a *ngIf="!preview" href="/">← Site du bien</a>
<h1>{{preview?'Vue client de mes biens':'Mon espace client'}}</h1><p>{{preview?'Vos annonces publiques et votre activité en tant que client sur ces biens.':'Vos biens disponibles, réservations, paiements et avis sur ce site.'}}</p>
<nav aria-label="Mon espace client"><button *ngFor="let tab of tabs" [attr.aria-pressed]="section===tab.id" (click)="load(tab.id)">{{tab.label}}</button></nav>
<p *ngIf="loading" role="status">Chargement…</p><p *ngIf="error" role="alert">{{error}} <button (click)="load(section)">Réessayer</button></p>
<ng-container *ngIf="!loading&&!error&&(section==='assets'&&!preview||uid&&uid===access.authenticatedUid)">
<p *ngIf="!rows.length">{{empty[section]}}</p>
<article *ngFor="let r of rows"><h2>{{r.assetName||r.name||r.assetId}}</h2>
<a *ngIf="section==='assets'" [routerLink]="['/',r.assetType,r.id,'home']">Voir l’annonce</a>
<ng-container *ngIf="section==='bookings'||section==='payments'"><p>{{r.startAt||r.outingDate}} → {{r.endAt}}</p>
<p *ngIf="section==='payments'">{{r.totalAmount??r.rentalAmount??0}} {{r.currency||'EUR'}} · {{r.paymentStatus||r.status}}</p>
<a [routerLink]="['/',r.assetType,r.assetId,'my-bookings']" [queryParams]="{bookingId:r.bookingId||r.id}">Détails de la réservation</a></ng-container>
<p *ngIf="section==='ratings'">{{r.rating}} / 5 · {{r.comments}}</p></article></ng-container></main>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_workspace_client_space_component_ts__WEBPACK_IMPORTED_MODULE_1___default())]
})], ClientSpaceComponent);


/***/ }),

/***/ 94361:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/workspace/client-space.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=bWFpbnttYXgtd2lkdGg6NjVyZW07bWFyZ2luOjJyZW0gYXV0bztwYWRkaW5nOjFyZW19bmF2e2Rpc3BsYXk6ZmxleDtmbGV4LXdyYXA6d3JhcDtnYXA6LjZyZW07bWFyZ2luOjFyZW0gMH1idXR0b24sYXtwYWRkaW5nOi42cmVtIC44cmVtfWJ1dHRvblthcmlhLXByZXNzZWQ9dHJ1ZV17YmFja2dyb3VuZDojMTczZDM3O2NvbG9yOndoaXRlfWFydGljbGV7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2NlZGJkNztwYWRkaW5nOjFyZW0gMH1oMntmb250LXNpemU6MS4ycmVtfQ%3D%3D!./src/app/workspace/client-space.component.ts ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `main{max-width:65rem;margin:2rem auto;padding:1rem}nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0}button,a{padding:.6rem .8rem}button[aria-pressed=true]{background:#173d37;color:white}article{border-bottom:1px solid #cedbd7;padding:1rem 0}h2{font-size:1.2rem}`, "",{"version":3,"sources":["webpack://./src/app/workspace/client-space.component.ts"],"names":[],"mappings":"AAAA,KAAK,eAAe,CAAC,gBAAgB,CAAC,YAAY,CAAC,IAAI,YAAY,CAAC,cAAc,CAAC,SAAS,CAAC,aAAa,CAAC,SAAS,mBAAmB,CAAC,0BAA0B,kBAAkB,CAAC,WAAW,CAAC,QAAQ,+BAA+B,CAAC,cAAc,CAAC,GAAG,gBAAgB","sourcesContent":["main{max-width:65rem;margin:2rem auto;padding:1rem}nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0}button,a{padding:.6rem .8rem}button[aria-pressed=true]{background:#173d37;color:white}article{border-bottom:1px solid #cedbd7;padding:1rem 0}h2{font-size:1.2rem}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ })

}]);
//# sourceMappingURL=src_app_workspace_client-space_component_ts.js.map