"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_notifications_notification-admin_component_ts"],{

/***/ 77277:
/*!***************************************************************!*\
  !*** ./src/app/notifications/notification-admin.component.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationAdminComponent: () => (/* binding */ NotificationAdminComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/language.service */ 48756);









let NotificationAdminComponent = class NotificationAdminComponent {
  http;
  auth;
  language;
  data = null;
  busy = false;
  error = false;
  constructor(http, auth, language) {
    this.http = http;
    this.auth = auth;
    this.language = language;
  }
  t(i) {
    const text = {
      fr: ['Notifications email', 'Les destinataires dépendent du bien et des droits des concierges. Activation depuis la configuration du serveur.', 'Actualiser', 'Impossible de charger le suivi.', 'Envoi activé', 'En attente', 'En échec après 8 tentatives', 'Tentatives', 'Prochaine tentative', 'Réessayer', 'Filtre des adresses de test actif : les autres destinataires sont ignorés.', 'Erreur'],
      en: ['Email notifications', 'Recipients depend on the asset and concierge permissions. Enable sending in the server configuration.', 'Refresh', 'Unable to load delivery status.', 'Sending enabled', 'Pending', 'Failed after 8 attempts', 'Attempts', 'Next attempt', 'Retry', 'Test recipient filter active: other recipients are skipped.', 'Error']
    };
    return (text[this.language.currentLanguage] || text.en)[i];
  }
  retry(id) {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.busy) return;
      _this.busy = true;
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this.http.post('/api/platform/admin/notifications/' + id + '/retry', {}, {
          headers: yield _this.auth.headers()
        }));
      } catch {
        _this.error = true;
      } finally {
        _this.busy = false;
      }
      yield _this.refresh();
    })();
  }
  ngOnInit() {
    void this.refresh();
  }
  refresh() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this2.busy) return;
      _this2.busy = true;
      _this2.error = false;
      try {
        _this2.data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.firstValueFrom)(_this2.http.get('/api/platform/admin/notifications', {
          headers: yield _this2.auth.headers()
        }));
      } catch {
        _this2.data = null;
        _this2.error = true;
      } finally {
        _this2.busy = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_1__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_2__.LanguageService
  }];
};
NotificationAdminComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
  selector: 'app-notification-admin',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule],
  template: `<main style="max-width:1000px;margin:40px auto;padding:24px"><a routerLink="/platform/admin">← GoDirect Admin</a><h1>{{t(0)}}</h1><p>{{t(1)}}</p><button type="button" (click)="refresh()" [disabled]="busy">{{t(2)}}</button><p *ngIf="error" role="alert">{{t(3)}}</p><section *ngIf="data"><p>{{t(4)}} : {{data.enabled?'✓':'—'}}</p><p>Admin : {{data.adminEmail}}</p><p *ngIf="data.recipientFilterActive">{{t(10)}}</p><p>SMTP : {{data.smtpConfigured?'✓':'—'}}</p><p>{{t(5)}} : {{data.pending}} · {{t(6)}} : {{data.failed}}</p><p *ngIf="data.lastError">{{data.lastError}}</p><table style="width:100%;text-align:left;overflow-wrap:anywhere"><thead><tr><th>ID</th><th>{{t(7)}}</th><th>{{t(8)}}</th><th>{{t(11)}}</th></tr></thead><tbody><tr *ngFor="let row of data.queue"><td>{{row.id.slice(0,12)}}</td><td>{{row.attempts}} / 8</td><td>{{row.nextAttemptAt | date:'short'}} <button type="button" *ngIf="row.attempts>=8" (click)="retry(row.id)" [disabled]="busy">{{t(9)}}</button></td><td>{{row.lastError}} {{row.responseCode}}</td></tr></tbody></table></section></main>`
})], NotificationAdminComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_notifications_notification-admin_component_ts.js.map