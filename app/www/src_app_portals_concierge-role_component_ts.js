"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_portals_concierge-role_component_ts"],{

/***/ 26059:
/*!*****************************************************!*\
  !*** ./src/app/portals/concierge-role.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConciergeRoleComponent: () => (/* binding */ ConciergeRoleComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _portal_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./portal-home.component.scss?ngResource */ 8969);
/* harmony import */ var _portal_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_portal_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/language.service */ 48756);






let ConciergeRoleComponent = class ConciergeRoleComponent {
  language;
  constructor(language) {
    this.language = language;
  }
  get fr() {
    return this.language.currentLanguage === 'fr';
  }
  static ctorParameters = () => [{
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_1__.LanguageService
  }];
};
ConciergeRoleComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule],
  template: `<div class="portal-page"><main><section class="portal-hero"><p class="eyebrow">{{fr?'La délégation, simplement':'Delegation, simply'}}</p><h1>{{fr?'Votre concierge vous aide. Vous gardez la main.':'Your concierge helps. You stay in control.'}}</h1><p class="intro">{{fr?'Le propriétaire choisit les biens confiés et les droits accordés. Le concierge accède uniquement aux biens qui lui sont délégués.':'Owners select the rentals and permissions they delegate. Concierges access only the rentals entrusted to them.'}}</p></section><div class="cards"><article><h2>{{fr?'L’annonce':'The listing'}}</h2><p>{{fr?'Avec le droit de gestion du contenu, le concierge peut modifier les textes, photos et tarifs du bien.':'With content permission, the concierge can edit the rental’s descriptions, photos and prices.'}}</p></article><article><h2>{{fr?'Les réservations':'Bookings'}}</h2><p>{{fr?'Avec les droits correspondants, il gère les demandes, le calendrier et les échanges avec les clients autorisés.':'With the relevant permissions, they manage requests, the calendar and conversations with authorized customers.'}}</p></article><article><h2>{{fr?'Les limites':'The limits'}}</h2><p>{{fr?'Il ne devient pas propriétaire du bien et ne peut pas s’accorder lui-même des droits. Les opérations financières réservées au propriétaire le restent.':'They do not become the rental owner and cannot grant themselves permissions. Owner-only financial operations remain restricted.'}}</p></article></div><section><h2>{{fr?'Vous choisissez, vous autorisez, vous pouvez révoquer.':'You choose, you authorize, you can revoke.'}}</h2><p>{{fr?'Depuis votre espace propriétaire, sélectionnez un concierge, les biens concernés et les droits à lui confier : contenu, réservations, clients ou paiements. Vous pouvez ensuite modifier ou retirer ses accès.':'In your owner workspace, select a concierge, the rentals concerned and the permissions to grant: content, bookings, customers or payments. You can then change or revoke their access.'}}</p><div class="actions"><a class="button" href="https://godirect.fr/owner/delegations">{{fr?'Gérer mes délégations':'Manage my delegations'}}</a><a class="button secondary" href="https://godirect.fr/concierge">{{fr?'Je suis concierge':'I am a concierge'}}</a></div></section></main></div>`,
  styles: [(_portal_home_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_0___default())]
})], ConciergeRoleComponent);


/***/ })

}]);
//# sourceMappingURL=src_app_portals_concierge-role_component_ts.js.map