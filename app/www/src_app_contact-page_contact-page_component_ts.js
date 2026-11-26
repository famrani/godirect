(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_contact-page_contact-page_component_ts"],{

/***/ 222:
/*!*********************************************************************!*\
  !*** ./src/app/contact-page/contact-page.component.html?ngResource ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<app-platform-layout><main class=\"contact-page\"><header><p>GoDirect · All Digital Network</p><h1>{{t('title')}}</h1><p>{{t('intro')}}</p></header><div class=\"contact-grid\"><aside><h2>{{t('email')}}</h2><a [href]=\"'mailto:'+email\">{{email}}</a><h2>{{t('phone')}}</h2><a [href]=\"'tel:'+phone\">+33 6 85 26 65 10</a></aside><section><p>{{t('required')}}</p><form #contactForm=\"ngForm\" (ngSubmit)=\"submit(contactForm)\"><fieldset [disabled]=\"busy\"><label for=\"contact-name\">{{t('name')}}</label><input id=\"contact-name\" name=\"name\" [(ngModel)]=\"form.name\" required minlength=\"2\" maxlength=\"100\" autocomplete=\"name\"><label for=\"contact-email\">{{t('yourEmail')}}</label><input id=\"contact-email\" name=\"email\" [(ngModel)]=\"form.email\" type=\"email\" email required maxlength=\"254\" autocomplete=\"email\"><label for=\"contact-topic\">{{t('topic')}}</label><select id=\"contact-topic\" name=\"topic\" [(ngModel)]=\"form.topic\" required><option value=\"general\">{{t('general')}}</option><option value=\"listing\">{{t('listing')}}</option><option value=\"payment\">{{t('payment')}}</option></select><label for=\"contact-message\">{{t('message')}}</label><textarea id=\"contact-message\" name=\"message\" [(ngModel)]=\"form.message\" required maxlength=\"5000\" rows=\"8\"></textarea><div class=\"contact-trap\" aria-hidden=\"true\"><label>Website<input name=\"website\" [(ngModel)]=\"form.website\" tabindex=\"-1\" autocomplete=\"off\"></label></div><p class=\"privacy\">{{t('privacy')}}</p><button type=\"submit\" [disabled]=\"contactForm.invalid || busy\">{{t(busy?'sending':'send')}}</button></fieldset></form><p class=\"success\" *ngIf=\"sent\" role=\"status\">{{t('success')}}</p><p class=\"error\" *ngIf=\"error\" role=\"alert\">{{t(error)}}</p></section></div></main></app-platform-layout>";

/***/ }),

/***/ 3592:
/*!*********************************************************************!*\
  !*** ./src/app/contact-page/contact-page.component.scss?ngResource ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.contact-page {
  max-width: 1080px;
  margin: auto;
  padding: 48px 24px;
  color: #153c48;
}

.contact-page h1 {
  font: 400 clamp(32px, 5vw, 52px) Georgia, serif;
}

.contact-page p {
  line-height: 1.7;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 48px;
  margin-top: 40px;
}

aside {
  background: #eef4f3;
  border-radius: 18px;
  padding: 24px;
  align-self: start;
}

aside h2 {
  font-size: 18px;
}

aside a {
  color: #14546c;
  overflow-wrap: anywhere;
}

fieldset {
  border: 0;
  padding: 0;
  min-width: 0;
}

label {
  display: block;
  font-weight: 600;
  margin: 18px 0 8px;
}

input, select, textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #b4c9ce;
  border-radius: 8px;
  padding: 12px;
  font: inherit;
  color: inherit;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 14px 24px;
  background: #14546c;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: default;
}

.privacy {
  font-size: 13px;
  color: #526b70;
}

.contact-trap {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.success {
  background: #edf6ec;
  padding: 16px;
}

.error {
  background: #fff0ec;
  padding: 16px;
}

input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible, a:focus-visible {
  outline: 3px solid #bc631e;
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .contact-page {
    padding: 32px 20px;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/contact-page/contact-page.component.scss"],"names":[],"mappings":"AAAA;EAAc,iBAAA;EAAiB,YAAA;EAAY,kBAAA;EAAkB,cAAA;AAK7D;;AAL2E;EAAiB,+CAAA;AAS5F;;AATwI;EAAgB,gBAAA;AAaxJ;;AAbwK;EAAc,aAAA;EAAa,gCAAA;EAAgC,SAAA;EAAS,gBAAA;AAoB5O;;AApB4P;EAAM,mBAAA;EAAmB,mBAAA;EAAmB,aAAA;EAAa,iBAAA;AA2BrT;;AA3BsU;EAAS,eAAA;AA+B/U;;AA/B8V;EAAQ,cAAA;EAAc,uBAAA;AAoCpX;;AApC2Y;EAAS,SAAA;EAAS,UAAA;EAAU,YAAA;AA0Cva;;AA1Cmb;EAAM,cAAA;EAAc,gBAAA;EAAgB,kBAAA;AAgDvd;;AAhDye;EAAsB,WAAA;EAAW,sBAAA;EAAsB,yBAAA;EAAyB,kBAAA;EAAkB,aAAA;EAAa,aAAA;EAAa,cAAA;AA0DrmB;;AA1DmnB;EAAO,SAAA;EAAS,kBAAA;EAAkB,kBAAA;EAAkB,mBAAA;EAAmB,YAAA;EAAY,aAAA;EAAa,eAAA;AAoEntB;;AApEkuB;EAAgB,aAAA;EAAY,eAAA;AAyE9vB;;AAzE6wB;EAAS,eAAA;EAAe,cAAA;AA8EryB;;AA9EmzB;EAAc,kBAAA;EAAkB,cAAA;EAAc,UAAA;EAAU,WAAA;EAAW,gBAAA;AAsFt3B;;AAtFs4B;EAAS,mBAAA;EAAmB,aAAA;AA2Fl6B;;AA3F+6B;EAAO,mBAAA;EAAmB,aAAA;AAgGz8B;;AAhGs9B;EAAqG,0BAAA;EAA0B,mBAAA;AAqGrlC;;AArGwmC;EAAwB;IAAc,0BAAA;IAA0B,SAAA;EA2GtqC;EA3G+qC;IAAc,kBAAA;EA8G7rC;AACF","sourcesContent":[".contact-page{max-width:1080px;margin:auto;padding:48px 24px;color:#153c48}.contact-page h1{font:400 clamp(32px,5vw,52px) Georgia,serif}.contact-page p{line-height:1.7}.contact-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:48px;margin-top:40px}aside{background:#eef4f3;border-radius:18px;padding:24px;align-self:start}aside h2{font-size:18px}aside a{color:#14546c;overflow-wrap:anywhere}fieldset{border:0;padding:0;min-width:0}label{display:block;font-weight:600;margin:18px 0 8px}input,select,textarea{width:100%;box-sizing:border-box;border:1px solid #b4c9ce;border-radius:8px;padding:12px;font:inherit;color:inherit}button{border:0;border-radius:8px;padding:14px 24px;background:#14546c;color:white;font:inherit;cursor:pointer}button:disabled{opacity:.55;cursor:default}.privacy{font-size:13px;color:#526b70}.contact-trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.success{background:#edf6ec;padding:16px}.error{background:#fff0ec;padding:16px}input:focus-visible,select:focus-visible,textarea:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #bc631e;outline-offset:3px}@media(max-width:700px){.contact-grid{grid-template-columns:1fr;gap:20px}.contact-page{padding:32px 20px}}"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 25558:
/*!********************************************************!*\
  !*** ./src/app/contact-page/contact-page.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContactPageComponent: () => (/* binding */ ContactPageComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _contact_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contact-page.component.html?ngResource */ 222);
/* harmony import */ var _contact_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contact-page.component.scss?ngResource */ 3592);
/* harmony import */ var _contact_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_contact_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _services_asset_domain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/asset-domain */ 94984);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../layout/platform-layout/platform-layout.component */ 86075);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../home/site-content-service/site-content.service */ 73196);
/* harmony import */ var _contact_page_text__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./contact-page.text */ 45230);














let ContactPageComponent = class ContactPageComponent {
  http;
  language;
  content;
  email = 'famrani@alldigitalnetwork.com';
  phone = '+33685266510';
  uiContent;
  busy = false;
  sent = false;
  error = '';
  form = {
    name: '',
    email: '',
    topic: 'general',
    message: '',
    website: ''
  };
  constructor(http, language, content) {
    this.http = http;
    this.language = language;
    this.content = content;
  }
  ngOnInit() {
    if (typeof location !== 'undefined' && (0,_services_asset_domain__WEBPACK_IMPORTED_MODULE_3__.assetDomainSlug)(location.hostname)) {
      location.replace('/contact?ngsw-bypass=true');
      return;
    }
    void this.content.getContent().then(c => this.uiContent = c).catch(() => {});
  }
  t(key) {
    const lang = this.language.currentLanguage;
    return this.content.tFromContent(this.uiContent, 'ui.contact.' + key, lang, _contact_page_text__WEBPACK_IMPORTED_MODULE_7__.CONTACT_TEXT[lang]?.[key] || _contact_page_text__WEBPACK_IMPORTED_MODULE_7__.CONTACT_TEXT.en[key]);
  }
  submit(form) {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.busy || form.invalid) return;
      _this.busy = true;
      _this.sent = false;
      _this.error = '';
      try {
        const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.firstValueFrom)(_this.http.post('/api/contact', {
          ..._this.form,
          language: _this.language.currentLanguage
        }));
        if (!result?.ok) throw Error('send_failed');
        _this.sent = true;
        _this.form.message = '';
        form.form.markAsPristine();
      } catch (e) {
        _this.error = e?.status === 429 ? 'rateLimit' : e?.status === 503 ? 'unavailable' : 'error';
      } finally {
        _this.busy = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClient
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_5__.LanguageService
  }, {
    type: _home_site_content_service_site_content_service__WEBPACK_IMPORTED_MODULE_6__.SiteContentService
  }];
};
ContactPageComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_10__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_11__.Component)({
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _layout_platform_layout_platform_layout_component__WEBPACK_IMPORTED_MODULE_4__.PlatformLayoutComponent],
  template: _contact_page_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_contact_page_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], ContactPageComponent);


/***/ }),

/***/ 45230:
/*!***************************************************!*\
  !*** ./src/app/contact-page/contact-page.text.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONTACT_TEXT: () => (/* binding */ CONTACT_TEXT)
/* harmony export */ });
const CONTACT_TEXT = {
  "fr": {
    "title": "Contactez GoDirect",
    "intro": "Une question sur votre espace de location, une annonce ou un paiement ? Contactez All Digital Network.",
    "email": "Par email",
    "phone": "Par téléphone",
    "name": "Votre nom",
    "yourEmail": "Votre adresse email",
    "topic": "Sujet",
    "general": "Demande générale",
    "listing": "Annonce et espace propriétaire",
    "payment": "Paiement",
    "message": "Votre message",
    "send": "Envoyer le message",
    "sending": "Envoi en cours…",
    "success": "Votre message a été transmis. Merci, nous vous répondrons par email.",
    "error": "Le message n’a pas pu être envoyé. Réessayez ou contactez-nous directement par email ou téléphone.",
    "rateLimit": "Trop de messages. Réessayez dans quinze minutes ou contactez-nous par téléphone.",
    "unavailable": "Le formulaire est momentanément indisponible. Utilisez notre adresse email ou notre téléphone.",
    "privacy": "Ces informations servent uniquement à traiter votre demande. Aucun abonnement commercial n’est créé.",
    "required": "Tous les champs sont obligatoires."
  },
  "en": {
    "title": "Contact GoDirect",
    "intro": "Questions about your rental website, a listing or a payment? Contact All Digital Network.",
    "email": "By email",
    "phone": "By phone",
    "name": "Your name",
    "yourEmail": "Your email address",
    "topic": "Subject",
    "general": "General enquiry",
    "listing": "Listing and owner workspace",
    "payment": "Payment",
    "message": "Your message",
    "send": "Send message",
    "sending": "Sending…",
    "success": "Your message has been submitted. Thank you, we will reply by email.",
    "error": "Could not send your message. Retry or contact us directly by email or phone.",
    "rateLimit": "Too many messages. Retry in fifteen minutes or call us.",
    "unavailable": "The form is temporarily unavailable. Please email or call us.",
    "privacy": "These details are used only to answer your enquiry. You are not subscribed to marketing.",
    "required": "All fields are required."
  },
  "es": {
    "title": "Contacta con GoDirect",
    "intro": "¿Dudas sobre tu espacio de alquiler, un anuncio o un pago? Contacta con All Digital Network.",
    "email": "Por email",
    "phone": "Por teléfono",
    "name": "Tu nombre",
    "yourEmail": "Tu email",
    "topic": "Asunto",
    "general": "Consulta general",
    "listing": "Anuncio y espacio del propietario",
    "payment": "Pago",
    "message": "Tu mensaje",
    "send": "Enviar mensaje",
    "sending": "Enviando…",
    "success": "Mensaje enviado. Gracias, responderemos por email.",
    "error": "No se pudo enviar. Reintenta o contacta por email o teléfono.",
    "rateLimit": "Demasiados mensajes. Reintenta en quince minutos o llámanos.",
    "unavailable": "Formulario no disponible. Contacta por email o teléfono.",
    "privacy": "Los datos se usan solo para responder a tu consulta, sin suscripción comercial.",
    "required": "Todos los campos son obligatorios."
  },
  "it": {
    "title": "Contatta GoDirect",
    "intro": "Domande sul tuo spazio di noleggio, un annuncio o un pagamento? Contatta All Digital Network.",
    "email": "Via email",
    "phone": "Per telefono",
    "name": "Il tuo nome",
    "yourEmail": "La tua email",
    "topic": "Oggetto",
    "general": "Richiesta generale",
    "listing": "Annuncio e spazio proprietario",
    "payment": "Pagamento",
    "message": "Il tuo messaggio",
    "send": "Invia messaggio",
    "sending": "Invio…",
    "success": "Messaggio inviato. Grazie, risponderemo via email.",
    "error": "Invio non riuscito. Riprova o contattaci via email o telefono.",
    "rateLimit": "Troppi messaggi. Riprova tra quindici minuti o chiamaci.",
    "unavailable": "Modulo non disponibile. Contattaci via email o telefono.",
    "privacy": "I dati servono solo a rispondere alla richiesta, senza iscrizione commerciale.",
    "required": "Tutti i campi sono obbligatori."
  },
  "de": {
    "title": "GoDirect kontaktieren",
    "intro": "Fragen zu Ihrer Vermietungsseite, einer Anzeige oder Zahlung? Kontaktieren Sie All Digital Network.",
    "email": "Per E-Mail",
    "phone": "Telefonisch",
    "name": "Ihr Name",
    "yourEmail": "Ihre E-Mail-Adresse",
    "topic": "Betreff",
    "general": "Allgemeine Anfrage",
    "listing": "Anzeige und Eigentümerbereich",
    "payment": "Zahlung",
    "message": "Ihre Nachricht",
    "send": "Nachricht senden",
    "sending": "Wird gesendet…",
    "success": "Nachricht übermittelt. Vielen Dank, wir antworten per E-Mail.",
    "error": "Senden fehlgeschlagen. Erneut versuchen oder per E-Mail/Telefon kontaktieren.",
    "rateLimit": "Zu viele Nachrichten. In fünfzehn Minuten erneut versuchen oder anrufen.",
    "unavailable": "Formular derzeit nicht verfügbar. Bitte E-Mail senden oder anrufen.",
    "privacy": "Die Angaben dienen nur Ihrer Anfrage. Kein Marketing-Abonnement.",
    "required": "Alle Felder sind erforderlich."
  },
  "nl": {
    "title": "Contact met GoDirect",
    "intro": "Vragen over je verhuursite, een advertentie of betaling? Neem contact op met All Digital Network.",
    "email": "Per e-mail",
    "phone": "Telefonisch",
    "name": "Je naam",
    "yourEmail": "Je e-mailadres",
    "topic": "Onderwerp",
    "general": "Algemene vraag",
    "listing": "Advertentie en eigenaarsomgeving",
    "payment": "Betaling",
    "message": "Je bericht",
    "send": "Bericht verzenden",
    "sending": "Verzenden…",
    "success": "Bericht verstuurd. Bedankt, we antwoorden per e-mail.",
    "error": "Verzenden mislukt. Probeer opnieuw of neem contact op per e-mail of telefoon.",
    "rateLimit": "Te veel berichten. Probeer over vijftien minuten opnieuw of bel ons.",
    "unavailable": "Formulier tijdelijk niet beschikbaar. E-mail of bel ons.",
    "privacy": "Deze gegevens worden alleen gebruikt voor je vraag. Geen marketinginschrijving.",
    "required": "Alle velden zijn verplicht."
  },
  "ru": {
    "title": "Связаться с GoDirect",
    "intro": "Вопросы о сайте аренды, объявлении или платеже? Свяжитесь с All Digital Network.",
    "email": "По email",
    "phone": "По телефону",
    "name": "Ваше имя",
    "yourEmail": "Ваш email",
    "topic": "Тема",
    "general": "Общий вопрос",
    "listing": "Объявление и кабинет владельца",
    "payment": "Платёж",
    "message": "Ваше сообщение",
    "send": "Отправить",
    "sending": "Отправка…",
    "success": "Сообщение отправлено. Спасибо, ответим по email.",
    "error": "Не удалось отправить. Повторите или свяжитесь по email или телефону.",
    "rateLimit": "Слишком много сообщений. Повторите через пятнадцать минут или позвоните.",
    "unavailable": "Форма временно недоступна. Напишите email или позвоните.",
    "privacy": "Данные используются только для ответа на запрос. Без подписки на рекламу.",
    "required": "Все поля обязательны."
  }
};

/***/ })

}]);
//# sourceMappingURL=src_app_contact-page_contact-page_component_ts.js.map