(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["default-src_app_assets_car_pages_booking_car-booking_component_ts"],{

/***/ 16272:
/*!*********************************************!*\
  !*** ./src/app/services/ui-text.service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UiTextService: () => (/* binding */ UiTextService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _language_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./language.service */ 48756);
/* harmony import */ var _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../home/site-content-service/site-content.service */ 73196);




let UiTextService = class UiTextService {
  language;
  source;
  content;
  constructor(language, source) {
    this.language = language;
    this.source = source;
    void source.getContent().then(value => this.content = value).catch(() => {});
  }
  text(value) {
    return this.source.tFromContent(this.content, value, this.language.currentLanguage, value);
  }
  static ctorParameters = () => [{
    type: _language_service__WEBPACK_IMPORTED_MODULE_0__.LanguageService
  }, {
    type: _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_1__.SiteContentService
  }];
};
UiTextService = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.Injectable)({
  providedIn: 'root'
})], UiTextService);


/***/ }),

/***/ 16733:
/*!*********************************************************!*\
  !*** ./src/app/services/booking-publication-message.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bookingManagerMessage: () => (/* binding */ bookingManagerMessage),
/* harmony export */   bookingPublicationMessage: () => (/* binding */ bookingPublicationMessage)
/* harmony export */ });
function bookingPublicationMessage(code, language = 'fr') {
  const copy = {
    fr: ['L’abonnement de cette annonce n’est pas actif ou son paiement n’est pas encore confirmé.', 'Le dossier de justificatifs doit être validé ou faire l’objet d’une dispense active.', 'L’annonce a été modifiée ou attend sa validation par GoDirect. Son abonnement peut être actif : une nouvelle validation du contenu est nécessaire.', 'Cette annonce est hors ligne. Sa publication doit être activée après validation.', 'Cette annonce est indisponible.'],
    en: ['This listing subscription is inactive or payment is not yet confirmed.', 'The asset documents must be approved or covered by an active exemption.', 'The listing was changed or awaits GoDirect approval. Its subscription may be active: the content needs approval.', 'This listing is offline. Enable publication after approval.', 'This listing is unavailable.'],
    es: ['La suscripción no está activa o el pago no está confirmado.', 'Los documentos deben validarse o estar exentos.', 'El anuncio requiere validación del contenido, aunque la suscripción esté activa.', 'El anuncio no está publicado.', 'El anuncio no está disponible.'],
    it: ['Abbonamento non attivo o pagamento non confermato.', 'I documenti devono essere approvati o esentati.', 'Il contenuto richiede approvazione, anche se l’abbonamento è attivo.', 'L’annuncio non è pubblicato.', 'Annuncio non disponibile.'],
    de: ['Abonnement inaktiv oder Zahlung noch nicht bestätigt.', 'Dokumente müssen genehmigt oder freigestellt sein.', 'Der Inhalt muss genehmigt werden, auch bei aktivem Abonnement.', 'Dieses Inserat ist offline.', 'Inserat nicht verfügbar.'],
    nl: ['Abonnement niet actief of betaling niet bevestigd.', 'Documenten moeten goedgekeurd of vrijgesteld zijn.', 'De inhoud moet worden goedgekeurd, ook bij een actief abonnement.', 'Deze advertentie is offline.', 'Advertentie niet beschikbaar.'],
    ru: ['Подписка неактивна или оплата ещё не подтверждена.', 'Документы должны быть одобрены либо освобождены от проверки.', 'Требуется одобрение содержания даже при активной подписке.', 'Объявление не опубликовано.', 'Объявление недоступно.']
  };
  const i = ['listing_subscription_required', 'listing_documents_required', 'listing_moderation_required', 'listing_not_published', 'listing_unavailable'].indexOf(code);
  return i < 0 ? '' : (copy[language] || copy.en)[i];
}
const MANAGER_COPY = {
  "fr": ["Réserver pour un client", "Aucun compte GoDirect ou Google requis pour ce client. Saisissez son nom et son adresse email.", "Réservation créée pour le client : {id}. Retrouvez-la dans la gestion des réservations du bien."],
  "en": ["Book for a customer", "No GoDirect or Google account required for this customer. Enter their name and email.", "Reservation created for the customer: {id}. Find it in the asset booking management."],
  "es": ["Reservar para un cliente", "No se requiere cuenta GoDirect ni Google. Introduzca el nombre y email del cliente.", "Reserva creada para el cliente: {id}. Consulte la gestión de reservas del bien."],
  "it": ["Prenota per un cliente", "Non serve un account GoDirect o Google. Inserisci nome ed email del cliente.", "Prenotazione creata per il cliente: {id}. Consulta la gestione delle prenotazioni."],
  "de": ["Für einen Kunden buchen", "Kein GoDirect- oder Google-Konto erforderlich. Geben Sie Name und E-Mail des Kunden ein.", "Buchung für den Kunden erstellt: {id}. Öffnen Sie die Buchungsverwaltung des Objekts."],
  "nl": ["Boeken voor een klant", "Geen GoDirect- of Google-account nodig. Vul de naam en e-mail van de klant in.", "Boeking aangemaakt voor de klant: {id}. Bekijk het boekingsbeheer van het object."],
  "ru": ["Бронирование для клиента", "Аккаунт GoDirect или Google не требуется. Укажите имя и email клиента.", "Бронирование для клиента создано: {id}. Откройте управление бронированиями объекта."]
};
function bookingManagerMessage(i, lang) {
  return (MANAGER_COPY[lang] || MANAGER_COPY.en)[i];
}

/***/ }),

/***/ 18282:
/*!*********************************************************!*\
  !*** ./src/app/messaging/booking-question.component.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BookingQuestionComponent: () => (/* binding */ BookingQuestionComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/app/messaging/booking-question.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ%3D%3D!./src/app/messaging/booking-question.component.ts */ 48320);
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _booking_inquiry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./booking-inquiry */ 36838);
/* harmony import */ var _prebooking_text__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./prebooking-text */ 20141);










let BookingQuestionComponent = class BookingQuestionComponent {
  auth;
  router;
  language;
  type = '';
  assetId = '';
  form = {};
  disabled = false;
  busy = false;
  error = '';
  constructor(auth, router, language) {
    this.auth = auth;
    this.router = router;
    this.language = language;
  }
  t(i) {
    return (0,_prebooking_text__WEBPACK_IMPORTED_MODULE_5__.prebookingText)(this.language.currentLanguage, i);
  }
  ask() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.busy) return;
      _this.error = '';
      let query;
      try {
        query = (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_4__.inquiryQuery)(_this.type, _this.assetId, (0,_booking_inquiry__WEBPACK_IMPORTED_MODULE_4__.inquiryFromForm)(_this.type, _this.form));
      } catch {
        _this.error = _this.t(6);
        return;
      }
      _this.busy = true;
      try {
        yield _this.auth.user();
        yield _this.router.navigate(['/messages'], {
          queryParams: query
        });
      } catch {
        const returnUrl = _this.router.serializeUrl(_this.router.createUrlTree(['/messages'], {
          queryParams: query
        }));
        yield _this.router.navigate(['/account/login'], {
          queryParams: {
            role: 'customer',
            returnUrl
          }
        });
      } finally {
        _this.busy = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_2__.ReservationAuthService
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_6__.Router
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_3__.LanguageService
  }];
  static propDecorators = {
    type: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_7__.Input
    }],
    assetId: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_7__.Input
    }],
    form: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_7__.Input
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_7__.Input
    }]
  };
};
BookingQuestionComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
  selector: 'app-booking-question',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule],
  template: `<button type="button" (click)="ask()" [disabled]="disabled||busy">{{t(0)}}</button><p *ngIf="error" role="alert">{{error}}</p>`,
  styles: [(_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts_css_ngResource_Users_faycalamrani_data_ADN_boatify_app_node_modules_ngtools_webpack_src_loaders_inline_resource_js_data_Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ_3D_3D_Users_faycalamrani_data_ADN_boatify_app_src_app_messaging_booking_question_component_ts__WEBPACK_IMPORTED_MODULE_1___default())]
})], BookingQuestionComponent);


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
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _car_booking_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./car-booking.component.html?ngResource */ 87051);
/* harmony import */ var _car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./car-booking.component.scss?ngResource */ 63603);
/* harmony import */ var _car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _messaging_booking_question_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../messaging/booking-question.component */ 18282);
/* harmony import */ var _messaging_booking_inquiry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../messaging/booking-inquiry */ 36838);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../home/site-text.pipe */ 99343);
/* harmony import */ var _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../services/resource-route.pipe */ 19337);
/* harmony import */ var _services_resource_context_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/resource-context.service */ 54560);
/* harmony import */ var _services_booking_manager_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../services/booking-manager.service */ 78871);
/* harmony import */ var _services_booking_publication_message__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../services/booking-publication-message */ 16733);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../services/language.service */ 48756);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _services_ui_text_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../services/ui-text.service */ 16272);
/* harmony import */ var _services_discovery_search__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../services/discovery-search */ 74918);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var godigital_lib__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! godigital-lib */ 22464);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common/http */ 93262);






















let CarBookingComponent = class CarBookingComponent {
  route;
  router;
  http;
  storeDb;
  uiText = (0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.inject)(_services_ui_text_service__WEBPACK_IMPORTED_MODULE_11__.UiTextService);
  ctx = (0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.inject)(_services_resource_context_service__WEBPACK_IMPORTED_MODULE_7__.ResourceContextService);
  manager = (0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.inject)(_services_booking_manager_service__WEBPACK_IMPORTED_MODULE_8__.BookingManagerService);
  language = (0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.inject)(_services_language_service__WEBPACK_IMPORTED_MODULE_10__.LanguageService);
  canManage = false;
  managementReady = false;
  managerText(i) {
    return (0,_services_booking_publication_message__WEBPACK_IMPORTED_MODULE_9__.bookingManagerMessage)(i, this.language.currentLanguage);
  }
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
      return new _angular_common_http__WEBPACK_IMPORTED_MODULE_14__.HttpHeaders({
        Authorization: 'Bearer ' + (yield u.getIdToken())
      });
    })();
  }
  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    const start = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_12__.localDateTime)(q.get('startAt') || ''),
      end = (0,_services_discovery_search__WEBPACK_IMPORTED_MODULE_12__.localDateTime)(q.get('endAt') || '');
    if (start && end && Date.parse(q.get('endAt') || '') > Date.parse(q.get('startAt') || '')) {
      this.form.startDate = start.slice(0, 10);
      this.form.startTime = start.slice(11, 16);
      this.form.endDate = end.slice(0, 10);
      this.form.endTime = end.slice(11, 16);
    }
    this.adminMode = this.route.snapshot.queryParamMap.get('admin') === '1';
    this.authRequired = !this.authUser;
    this.assetId = String(this.ctx.resourceId || this.route.parent?.snapshot.paramMap.get('assetId') || '');
    this.http.get(`/api/assets/${encodeURIComponent(this.assetId)}`).subscribe({
      next: a => {
        this.asset = a;
        this.form.pickupLocation = a?.location?.city || '';
        this.form.returnLocation = this.form.pickupLocation;
        (0,_messaging_booking_inquiry__WEBPACK_IMPORTED_MODULE_4__.applyInquiryForm)(this.form, this.route.snapshot.queryParamMap);
        void this.detectManager();
      },
      error: () => this.error = 'Voiture introuvable.'
    });
  }
  detectManager() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.canManage = yield _this2.manager.allowed('car', _this2.assetId);
      _this2.adminMode = _this2.canManage;
      _this2.managementReady = true;
      if (_this2.adminMode) {
        _this2.form.customerId = 'guest';
        if (_this2.form.customerEmail === _this2.authUser?.email) {
          _this2.form.customerEmail = '';
          _this2.form.customerName = '';
        }
      } else _this2.syncCustomer();
      _this2.authRequired = !_this2.authUser;
    })();
  }
  bookingModeChanged() {
    this.form.customerId = 'guest';
    this.form.customerName = '';
    this.form.customerEmail = '';
    this.form.customerPhone = '';
    if (!this.adminMode) this.syncCustomer();
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
    const startAt = new Date(`${this.form.startDate}T${this.form.startTime}:00`).toISOString(),
      endAt = new Date(`${this.form.endDate}T${this.form.endTime}:00`).toISOString();
    return {
      ...(!this.adminMode ? (0,_messaging_booking_inquiry__WEBPACK_IMPORTED_MODULE_4__.prebookingRelation)(this.route.snapshot.queryParamMap, startAt, endAt) : {}),
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
    var _this3 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this3.error = '';
      _this3.quote = null;
      _this3.quotedPayload = '';
      if (!_this3.datesValid()) {
        _this3.calculating = false;
        _this3.error = 'Sélectionnez des dates et heures valides : la restitution doit être après la prise en charge.';
        return;
      }
      const p = _this3.payload();
      const signature = _this3.pricingSignature();
      const requestId = ++_this3.quoteRequestId;
      _this3.calculating = true;
      let headers;
      try {
        if (_this3.adminMode) headers = yield _this3.bookingHeaders();
      } catch (e) {
        _this3.calculating = false;
        _this3.error = e.message;
        return;
      }
      _this3.http.post('/api/car-bookings/quote' + (_this3.adminMode ? '?admin=1' : ''), p, {
        headers
      }).subscribe({
        next: q => {
          if (requestId !== _this3.quoteRequestId || signature !== _this3.pricingSignature()) return;
          _this3.quote = q;
          _this3.quotedPayload = signature;
          _this3.calculating = false;
          _this3.hasCalculated = true;
        },
        error: e => {
          if (requestId !== _this3.quoteRequestId) return;
          _this3.calculating = false;
          _this3.error = (0,_services_booking_publication_message__WEBPACK_IMPORTED_MODULE_9__.bookingPublicationMessage)(e?.error?.error, _this3.language.currentLanguage) || (e?.error?.error === 'asset_unavailable' ? _this3.uiText.text('Indisponible pour cette période.') : _this3.uiText.text('Impossible de calculer le prix') + (e?.error?.error ? ' : ' + _this3.uiText.text(e.error.error) : ''));
        }
      });
    })();
  }
  book() {
    var _this4 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this4.error = '';
      _this4.message = '';
      if (!_this4.managementReady) yield _this4.detectManager();
      if (!_this4.authUser) {
        _this4.authRequired = true;
        _this4.error = 'Connectez-vous ou créez un compte pour réserver.';
        return;
      }
      _this4.syncCustomer();
      if (!_this4.datesValid()) {
        _this4.error = 'Dates de réservation invalides.';
        return;
      }
      if (!_this4.form.customerName?.trim() || !/^\S+@\S+\.\S+$/.test(String(_this4.form.customerEmail || ''))) {
        _this4.error = 'Renseignez le nom du conducteur et une adresse e-mail valide.';
        return;
      }
      if (!_this4.quoteIsCurrent) {
        _this4.error = 'Calculez le prix avant de demander la réservation.';
        return;
      }
      _this4.saving = true;
      const p = _this4.payload();
      const signature = _this4.pricingSignature();
      let headers;
      try {
        headers = yield _this4.bookingHeaders();
      } catch (e) {
        _this4.saving = false;
        _this4.error = e.message;
        return;
      }
      _this4.http.post('/api/car-bookings' + (_this4.adminMode ? '?admin=1' : ''), p, {
        headers
      }).subscribe({
        next: b => {
          _this4.saving = false;
          _this4.message = _this4.uiText.text('Demande de réservation créée : {id}').replace('{id}', String(b.id));
          _this4.quote = b.pricing;
          _this4.quotedPayload = signature;
        },
        error: e => {
          _this4.saving = false;
          _this4.error = (0,_services_booking_publication_message__WEBPACK_IMPORTED_MODULE_9__.bookingPublicationMessage)(e?.error?.error, _this4.language.currentLanguage) || (e?.error?.error === 'asset_unavailable' ? _this4.uiText.text('Indisponible pour cette période.') : _this4.uiText.text('Impossible de créer la réservation') + (e?.error?.error ? ' : ' + _this4.uiText.text(e.error.error) : ''));
        }
      });
    })();
  }
  static ctorParameters = () => [{
    type: _angular_router__WEBPACK_IMPORTED_MODULE_15__.ActivatedRoute
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_15__.Router
  }, {
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_14__.HttpClient
  }, {
    type: godigital_lib__WEBPACK_IMPORTED_MODULE_16__.StoreDbService
  }];
};
CarBookingComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_17__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_13__.Component)({
  selector: 'app-car-booking',
  template: _car_booking_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_18__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_19__.FormsModule, _messaging_booking_question_component__WEBPACK_IMPORTED_MODULE_3__.BookingQuestionComponent, _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_5__.SiteTextPipe, _services_resource_route_pipe__WEBPACK_IMPORTED_MODULE_6__.ResourceRoutePipe],
  styles: [(_car_booking_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], CarBookingComponent);


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

/***/ 48320:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./src/app/messaging/booking-question.component.ts.css?ngResource!=!./node_modules/@ngtools/webpack/src/loaders/inline-resource.js?data=Omhvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2t9YnV0dG9ue2JvcmRlcjoxcHggc29saWQgIzE0NTU2YTtjb2xvcjojMTQ1NTZhO2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLXJhZGl1czo5cHg7cGFkZGluZzoxMnB4IDE2cHg7Zm9udDo2MDAgMTVweC8xLjQgc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcn1idXR0b246ZGlzYWJsZWR7b3BhY2l0eTouNTtjdXJzb3I6ZGVmYXVsdH1idXR0b246Zm9jdXMtdmlzaWJsZXtvdXRsaW5lOjNweCBzb2xpZCAjZjg4YjIwO291dGxpbmUtb2Zmc2V0OjNweH1we2NvbG9yOiNhNTI5MjQ7bWF4LXdpZHRoOjQwMHB4O2ZvbnQtc2l6ZToxNHB4fQ%3D%3D!./src/app/messaging/booking-question.component.ts ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host{display:inline-block}button{border:1px solid #14556a;color:#14556a;background:white;border-radius:9px;padding:12px 16px;font:600 15px/1.4 sans-serif;cursor:pointer}button:disabled{opacity:.5;cursor:default}button:focus-visible{outline:3px solid #f88b20;outline-offset:3px}p{color:#a52924;max-width:400px;font-size:14px}`, "",{"version":3,"sources":["webpack://./src/app/messaging/booking-question.component.ts"],"names":[],"mappings":"AAAA,MAAM,oBAAoB,CAAC,OAAO,wBAAwB,CAAC,aAAa,CAAC,gBAAgB,CAAC,iBAAiB,CAAC,iBAAiB,CAAC,4BAA4B,CAAC,cAAc,CAAC,gBAAgB,UAAU,CAAC,cAAc,CAAC,qBAAqB,yBAAyB,CAAC,kBAAkB,CAAC,EAAE,aAAa,CAAC,eAAe,CAAC,cAAc","sourcesContent":[":host{display:inline-block}button{border:1px solid #14556a;color:#14556a;background:white;border-radius:9px;padding:12px 16px;font:600 15px/1.4 sans-serif;cursor:pointer}button:disabled{opacity:.5;cursor:default}button:focus-visible{outline:3px solid #f88b20;outline-offset:3px}p{color:#a52924;max-width:400px;font-size:14px}"],"sourceRoot":""}]);
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

/***/ 78871:
/*!*****************************************************!*\
  !*** ./src/app/services/booking-manager.service.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BookingManagerService: () => (/* binding */ BookingManagerService)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _reservation_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reservation-auth.service */ 46709);






let BookingManagerService = class BookingManagerService {
  http;
  auth;
  constructor(http, auth) {
    this.http = http;
    this.auth = auth;
  }
  allowed(type, id) {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const user = yield _this.auth.user();
        const c = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this.http.get('/api/me/context', {
          headers: yield _this.auth.headers(),
          params: {
            type,
            id
          }
        }));
        return c.uid === user.uid && c.managementPermissions?.bookings === true;
      } catch {
        return false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient
  }, {
    type: _reservation_auth_service__WEBPACK_IMPORTED_MODULE_1__.ReservationAuthService
  }];
};
BookingManagerService = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.Injectable)({
  providedIn: 'root'
})], BookingManagerService);


/***/ }),

/***/ 87051:
/*!********************************************************************************!*\
  !*** ./src/app/assets/car/pages/booking/car-booking.component.html?ngResource ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<p *ngIf=\"canManage\" class=\"manager-note\"><label><input type=\"checkbox\" [(ngModel)]=\"adminMode\" (ngModelChange)=\"bookingModeChanged()\"> {{managerText(0)}}</label><span *ngIf=\"adminMode\"> — {{managerText(1)}}</span></p>\n<div class=\"car-booking\"><div *ngIf=\"authRequired\" class=\"err\">{{ \"ui.pages.t3d216c51f30c\" | siteText }} <button type=\"button\" (click)=\"login()\">{{ \"ui.pages.tfedf2439f275\" | siteText }}</button> <button type=\"button\" (click)=\"signup()\">{{ \"ui.pages.tdd9f915122c5\" | siteText }}</button></div><h1>{{ \"ui.pages.t254b0ae17097\" | siteText }} {{asset?.name || 'la voiture'}}</h1><p *ngIf=\"asset\">{{asset.properties?.brand}} {{asset.properties?.model}} · {{asset.pricing?.basePrice}} {{ \"ui.pages.t1a9f6db73c34\" | siteText }}</p>\n<div class=\"grid\"><label>{{ \"ui.pages.t95fc0a53e33a\" | siteText }}<input type=\"date\" [(ngModel)]=\"form.startDate\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t5073129fadb8\" | siteText }}<input type=\"time\" [(ngModel)]=\"form.startTime\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t955cdde93864\" | siteText }}<input type=\"date\" [(ngModel)]=\"form.endDate\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t5073129fadb8\" | siteText }}<input type=\"time\" [(ngModel)]=\"form.endTime\" (ngModelChange)=\"onBookingChanged()\"></label><label>{{ \"ui.pages.t4786ef9c6b0f\" | siteText }}<input [(ngModel)]=\"form.pickupLocation\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t23f397112f95\" | siteText }}<input [(ngModel)]=\"form.returnLocation\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.ta75c5068eaa4\" | siteText }}<input [(ngModel)]=\"form.customerName\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t84add5b29527\" | siteText }}<input type=\"email\" [readonly]=\"!adminMode && !!authUser\" [(ngModel)]=\"form.customerEmail\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.td3b023eabc9c\" | siteText }}<input [(ngModel)]=\"form.customerPhone\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.t2a7b83a2f65a\" | siteText }}<input type=\"number\" min=\"18\" [(ngModel)]=\"form.driverAge\" (ngModelChange)=\"onCustomerChanged()\"></label><label>{{ \"ui.pages.td6f6988fb061\" | siteText }}<input maxlength=\"3\" [(ngModel)]=\"form.licenseCountry\" (ngModelChange)=\"onCustomerChanged()\"></label></div>\n<label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"form.additionalDriver\" (ngModelChange)=\"onOptionChanged()\"> {{ \"ui.pages.tbd4c429c692e\" | siteText }}</label><label class=\"check\"><input type=\"checkbox\" [(ngModel)]=\"form.childSeat\" (ngModelChange)=\"onOptionChanged()\"> {{ \"ui.pages.t247c1e5ced94\" | siteText }}</label><label>{{ \"ui.pages.tdbdeccaf80ad\" | siteText }}<textarea [(ngModel)]=\"form.comments\" (ngModelChange)=\"onCustomerChanged()\"></textarea></label>\n<div class=\"actions\"><app-booking-question *ngIf=\"!adminMode\" type=\"car\" [assetId]=\"assetId\" [form]=\"form\" [disabled]=\"saving||calculating\"></app-booking-question><button type=\"button\" (click)=\"calculate()\" [disabled]=\"calculating\">{{calculating ? ('ui.messages.t62de1b588c87' | siteText) : ('ui.pages.t865b10c19fe0' | siteText)}}</button><button type=\"button\" class=\"primary\" (click)=\"book()\" [disabled]=\"saving || calculating || !quoteIsCurrent\">{{saving?('ui.messages.t987c4d94bbbe' | siteText):('ui.messages.t3fa843c945b9' | siteText)}}</button></div>\n<div class=\"quote\" *ngIf=\"quote\">\n  <div class=\"quote-heading\">{{ \"ui.pages.t28469cb42deb\" | siteText }}</div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.tebbcf17b6528\" | siteText }}{{quote.quantity}} {{ \"ui.pages.t986f4785a113\" | siteText }} {{quote.basePrice}} {{quote.currency}})</span><strong>{{quote.baseAmount !== undefined ? quote.baseAmount : (quote.quantity * quote.basePrice)}} {{quote.currency}}</strong></div>\n  <div class=\"price-row\" *ngIf=\"form.additionalDriver\"><span>{{ \"ui.pages.tbd4c429c692e\" | siteText }}</span><span>{{quote.additionalDriverAmount !== undefined ? quote.additionalDriverAmount : '—'}} {{quote.additionalDriverAmount !== undefined ? quote.currency : ''}}</span></div>\n  <div class=\"price-row\" *ngIf=\"form.childSeat\"><span>{{ \"ui.pages.t247c1e5ced94\" | siteText }}</span><span>{{quote.childSeatAmount !== undefined ? quote.childSeatAmount : '—'}} {{quote.childSeatAmount !== undefined ? quote.currency : ''}}</span></div>\n  <div class=\"price-row total\"><span>{{ \"ui.pages.tfd7698f20c64\" | siteText }}</span><strong>{{quote.rentalAmount}} {{quote.currency}}</strong></div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.t54f0b0d51c9f\" | siteText }}</span><span>{{quote.bookingDeposit}} {{quote.currency}}</span></div>\n  <div class=\"price-row\"><span>{{ \"ui.pages.tb9e063d73168\" | siteText }}</span><span>{{quote.securityDeposit}} {{quote.currency}}</span></div>\n  <p>{{ \"ui.pages.t374deeed96a8\" | siteText }}</p>\n  <small *ngIf=\"quote.additionalDriverAmount === undefined || quote.childSeatAmount === undefined\">{{ \"ui.pages.t993dac20dea3\" | siteText }}</small>\n</div><p class=\"ok\" *ngIf=\"message\">{{ message | siteText }}</p><p class=\"err\" *ngIf=\"error\">{{ error | siteText }}</p></div>\n";

/***/ })

}]);
//# sourceMappingURL=default-src_app_assets_car_pages_booking_car-booking_component_ts.js.map