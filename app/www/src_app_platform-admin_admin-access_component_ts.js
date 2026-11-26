"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_platform-admin_admin-access_component_ts"],{

/***/ 43429:
/*!**********************************************************!*\
  !*** ./src/app/platform-admin/admin-access.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminAccessComponent: () => (/* binding */ AdminAccessComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 99585);




let AdminAccessComponent = class AdminAccessComponent {
  route;
  router;
  busy = false;
  constructor(route, router) {
    this.route = route;
    this.router = router;
  }
  get reason() {
    const value = this.route.snapshot.queryParamMap.get('reason') || '';
    return /^(session_unavailable|session_mismatch|admin_required|authentication_required|request_timeout|network_unavailable|session_check_failed|http_\d{3})$/.test(value) ? value : 'session_check_failed';
  }
  get message() {
    const messages = {
      session_unavailable: 'La session de connexion n’est pas encore disponible. Connectez-vous ou réessayez.',
      session_mismatch: 'La session a changé pendant le contrôle. Réessayez avec le compte administrateur.',
      admin_required: 'Le serveur n’a pas confirmé le droit administrateur pour cette session.',
      authentication_required: 'Le serveur a refusé la session. Reconnectez-vous puis réessayez.',
      request_timeout: 'Le serveur n’a pas répondu au contrôle administrateur dans le délai prévu.',
      network_unavailable: 'Le navigateur n’a pas pu joindre le serveur pour vérifier vos droits.',
      session_check_failed: 'La vérification de la session a échoué avant de pouvoir confirmer vos droits.'
    };
    return messages[this.reason] || 'Le serveur a renvoyé une erreur pendant le contrôle administrateur.';
  }
  retry() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.busy) return;
      _this.busy = true;
      const value = _this.route.snapshot.queryParamMap.get('returnUrl') || '';
      const target = /^\/platform\/admin(?:\/|\?|$)/.test(value) ? value : '/platform/admin/notifications';
      try {
        yield _this.router.navigateByUrl(target);
      } finally {
        _this.busy = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_router__WEBPACK_IMPORTED_MODULE_1__.ActivatedRoute
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_1__.Router
  }];
};
AdminAccessComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  selector: 'app-admin-access',
  standalone: true,
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
  template: `<main style="max-width:760px;margin:48px auto;padding:24px">
 <h1>Accès à l’administration interrompu</h1>
 <p role="alert">{{message}}</p>
 <p>Code de diagnostic : <strong>{{reason}}</strong></p>
 <p>Le contrôle d’accès reste actif. Aucune donnée n’a été modifiée.</p>
 <button type="button" (click)="retry()" [disabled]="busy">Réessayer</button>
 <p><a routerLink="/account/login">Se connecter</a> · <a routerLink="/">Accueil GoDirect</a></p>
 </main>`
})], AdminAccessComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_platform-admin_admin-access_component_ts.js.map