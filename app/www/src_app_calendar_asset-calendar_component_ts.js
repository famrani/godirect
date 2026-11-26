(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_calendar_asset-calendar_component_ts"],{

/***/ 27022:
/*!*************************************************!*\
  !*** ./src/app/services/asset-calendar-view.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calendarEventOnDay: () => (/* binding */ calendarEventOnDay),
/* harmony export */   monthCells: () => (/* binding */ monthCells),
/* harmony export */   parisDay: () => (/* binding */ parisDay)
/* harmony export */ });
const parisFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
function parisDay(value) {
  const parts = parisFormatter.formatToParts(new Date(value));
  const get = key => parts.find(p => p.type === key)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}
function calendarEventOnDay(event, key) {
  const start = Date.parse(event.startAt),
    end = Date.parse(event.endAt);
  return Number.isFinite(start) && Number.isFinite(end) && end > start && parisDay(start) <= key && parisDay(end - 1) >= key;
}
function monthCells(year, month) {
  const first = new Date(Date.UTC(year, month, 1)),
    offset = (first.getUTCDay() + 6) % 7;
  return Array.from({
    length: 42
  }, (_, i) => {
    const date = new Date(Date.UTC(year, month, 1 - offset + i));
    return {
      key: date.toISOString().slice(0, 10),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === month
    };
  });
}

/***/ }),

/***/ 69373:
/*!*******************************************************************!*\
  !*** ./src/app/calendar/asset-calendar.component.scss?ngResource ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@charset "UTF-8";
:host {
  display: block;
  background: #f8f6f1;
  color: #153b46;
  min-height: 90vh;
}

.calendar-page {
  box-sizing: border-box;
  max-width: 1200px;
  margin: auto;
  padding: 32px 24px 60px;
  font: 16px/1.6 Arial, sans-serif;
}

a {
  color: inherit;
}

header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
  margin: 24px 0;
}

h1 {
  font-size: 30px;
  line-height: 1.3;
}

h2 {
  font-size: 21px;
  margin: 12px 0;
}

button {
  font: inherit;
  cursor: pointer;
  border: 1px solid #c8d9df;
  border-radius: 8px;
  padding: 9px 14px;
  color: #153b46;
  background: white;
}

button:focus-visible, a:focus-visible {
  outline: 3px solid #b47a22;
  outline-offset: 2px;
}

button:disabled {
  opacity: 0.5;
}

.month-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin: 22px 0;
}

.month-nav h2 {
  min-width: 180px;
  text-transform: capitalize;
}

.weekdays, .month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.weekdays span {
  text-align: center;
  padding: 10px;
  font-weight: 700;
}

.month-grid {
  border-top: 1px solid #d1dfe3;
  border-left: 1px solid #d1dfe3;
  background: white;
}

.day {
  min-height: 120px;
  min-width: 0;
  border-right: 1px solid #d1dfe3;
  border-bottom: 1px solid #d1dfe3;
  padding: 8px;
  box-sizing: border-box;
}

.outside {
  opacity: 0.45;
}

.occupied {
  background: #fff0dc;
}

.day.today {
  box-shadow: inset 0 0 0 2px #12566a;
}

.day.selected {
  box-shadow: inset 0 0 0 3px #a64c11;
}

.day-number {
  padding: 3px 8px;
  font-weight: 700;
}

.event {
  display: block;
  width: 100%;
  padding: 5px;
  margin-top: 6px;
  text-align: left;
  font-size: 12px;
  overflow-wrap: anywhere;
  background: #e8f2f3;
}

.event small {
  display: block;
}

.busy-label {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 700;
}

.agenda, .detail {
  background: white;
  border: 1px solid #d1dfe3;
  border-radius: 12px;
  margin-top: 24px;
  padding: 20px;
}

.agenda button {
  display: block;
  margin: 10px 0;
  text-align: left;
}

dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 650px) {
  .calendar-page {
    padding: 20px 10px;
  }
  .day {
    min-height: 80px;
    padding: 3px;
  }
  .event {
    font-size: 10px;
    padding: 3px;
  }
  .day-number {
    padding: 2px 5px;
  }
  .busy-label {
    font-size: 10px;
  }
  .weekdays span {
    font-size: 12px;
    padding: 6px 0;
  }
  h1 {
    font-size: 24px;
  }
  header {
    flex-direction: column;
  }
  .month-nav {
    gap: 8px;
  }
  .month-nav h2 {
    min-width: 120px;
    font-size: 18px;
  }
  dl {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  dd {
    margin-bottom: 12px;
  }
}
.editable-range .day {
  -webkit-user-select: none;
          user-select: none;
  cursor: pointer;
}

.editable-range .day.in-range {
  background: #d2ece5;
  box-shadow: inset 0 0 0 1px #63978a;
}

.editable-range .day.range-edge .day-number {
  background: #185647;
  color: white;
}

.editor {
  display: grid;
  gap: 14px;
  padding: clamp(16px, 3vw, 28px);
  border-radius: 18px;
}

.editor h2, .editor p {
  margin: 0;
}

.editor p {
  color: #49636a;
}

.period, .choices {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.period label, .amount {
  display: grid;
  gap: 4px;
  font-weight: 600;
}

.period input, .amount input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 14rem;
  min-height: 44px;
  border: 1px solid #abc4be;
  border-radius: 9px;
  background: white;
  color: inherit;
  font: inherit;
  padding: 6px 10px;
}

.editor fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.editor legend {
  font-weight: 700;
  margin-bottom: 7px;
}

.choice {
  position: relative;
  cursor: pointer;
}

.choice input {
  position: absolute;
  opacity: 0;
}

.choice span {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 44px;
  padding: 5px 14px;
  border: 1px solid #b4c9c4;
  border-radius: 24px;
  background: white;
}

.choice:hover span {
  background: #f0f6f3;
}

.choice input:checked + span {
  border-color: #21654f;
  background: #def0e7;
  color: #134632;
  font-weight: 700;
}

.choice input:checked + span:before {
  content: "✓";
  margin-right: 6px;
}

.choice input:focus-visible + span, .editor input:focus-visible {
  outline: 3px solid #996522;
  outline-offset: 2px;
}

.editor .apply {
  justify-self: start;
  margin: 0;
  border: 0;
  padding: 10px 20px;
  background: #175348;
  color: white;
  font-weight: 700;
  min-height: 44px;
}

.editor .apply:disabled {
  background: #e6ecea;
  color: #50635c;
  opacity: 1;
  cursor: default;
}

@media (max-width: 600px) {
  .period, .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .choice span {
    height: 100%;
    text-align: center;
    font-size: 14px;
    padding: 6px;
  }
  .editor .apply {
    width: 100%;
    text-align: center;
  }
  .period input {
    max-width: none;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/calendar/asset-calendar.component.scss"],"names":[],"mappings":"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","sourcesContent":[":host{display:block;background:#f8f6f1;color:#153b46;min-height:90vh}.calendar-page{box-sizing:border-box;max-width:1200px;margin:auto;padding:32px 24px 60px;font:16px/1.6 Arial,sans-serif}a{color:inherit}header{display:flex;justify-content:space-between;gap:20px;align-items:start;margin:24px 0}h1{font-size:30px;line-height:1.3}h2{font-size:21px;margin:12px 0}button{font:inherit;cursor:pointer;border:1px solid #c8d9df;border-radius:8px;padding:9px 14px;color:#153b46;background:white}button:focus-visible,a:focus-visible{outline:3px solid #b47a22;outline-offset:2px}button:disabled{opacity:.5}.month-nav{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin:22px 0}.month-nav h2{min-width:180px;text-transform:capitalize}.weekdays,.month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.weekdays span{text-align:center;padding:10px;font-weight:700}.month-grid{border-top:1px solid #d1dfe3;border-left:1px solid #d1dfe3;background:white}.day{min-height:120px;min-width:0;border-right:1px solid #d1dfe3;border-bottom:1px solid #d1dfe3;padding:8px;box-sizing:border-box}.outside{opacity:.45}.occupied{background:#fff0dc}.day.today{box-shadow:inset 0 0 0 2px #12566a}.day.selected{box-shadow:inset 0 0 0 3px #a64c11}.day-number{padding:3px 8px;font-weight:700}.event{display:block;width:100%;padding:5px;margin-top:6px;text-align:left;font-size:12px;overflow-wrap:anywhere;background:#e8f2f3}.event small{display:block}.busy-label{display:block;margin-top:10px;font-size:13px;font-weight:700}.agenda,.detail{background:white;border:1px solid #d1dfe3;border-radius:12px;margin-top:24px;padding:20px}.agenda button{display:block;margin:10px 0;text-align:left}dl{display:grid;grid-template-columns:120px 1fr;gap:12px}dd{margin:0;overflow-wrap:anywhere}@media(max-width:650px){.calendar-page{padding:20px 10px}.day{min-height:80px;padding:3px}.event{font-size:10px;padding:3px}.day-number{padding:2px 5px}.busy-label{font-size:10px}.weekdays span{font-size:12px;padding:6px 0}h1{font-size:24px}header{flex-direction:column}.month-nav{gap:8px}.month-nav h2{min-width:120px;font-size:18px}dl{grid-template-columns:1fr;gap:4px}dd{margin-bottom:12px}}\n\n.editable-range .day{user-select:none;cursor:pointer}.editable-range .day.in-range{background:#d2ece5;box-shadow:inset 0 0 0 1px #63978a}.editable-range .day.range-edge .day-number{background:#185647;color:white}\n\n.editor{display:grid;gap:14px;padding:clamp(16px,3vw,28px);border-radius:18px}.editor h2,.editor p{margin:0}.editor p{color:#49636a}.period,.choices{display:flex;gap:8px;flex-wrap:wrap}.period label,.amount{display:grid;gap:4px;font-weight:600}.period input,.amount input{box-sizing:border-box;width:100%;min-width:0;max-width:14rem;min-height:44px;border:1px solid #abc4be;border-radius:9px;background:white;color:inherit;font:inherit;padding:6px 10px}.editor fieldset{border:0;margin:0;padding:0;min-width:0}.editor legend{font-weight:700;margin-bottom:7px}.choice{position:relative;cursor:pointer}.choice input{position:absolute;opacity:0}.choice span{display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:44px;padding:5px 14px;border:1px solid #b4c9c4;border-radius:24px;background:white}.choice:hover span{background:#f0f6f3}.choice input:checked+span{border-color:#21654f;background:#def0e7;color:#134632;font-weight:700}.choice input:checked+span:before{content:'✓';margin-right:6px}.choice input:focus-visible+span,.editor input:focus-visible{outline:3px solid #996522;outline-offset:2px}.editor .apply{justify-self:start;margin:0;border:0;padding:10px 20px;background:#175348;color:white;font-weight:700;min-height:44px}.editor .apply:disabled{background:#e6ecea;color:#50635c;opacity:1;cursor:default}@media(max-width:600px){.period,.choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.choice span{height:100%;text-align:center;font-size:14px;padding:6px}.editor .apply{width:100%;text-align:center}.period input{max-width:none}}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 78477:
/*!******************************************************!*\
  !*** ./src/app/calendar/asset-calendar.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetCalendarComponent: () => (/* binding */ AssetCalendarComponent)
/* harmony export */ });
/* harmony import */ var _Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _asset_calendar_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asset-calendar.component.html?ngResource */ 88239);
/* harmony import */ var _asset_calendar_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./asset-calendar.component.scss?ngResource */ 69373);
/* harmony import */ var _asset_calendar_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_asset_calendar_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var godigital_lib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! godigital-lib */ 22464);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 50085);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 99585);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ 93262);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 72354);
/* harmony import */ var _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/reservation-auth.service */ 46709);
/* harmony import */ var _services_language_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/language.service */ 48756);
/* harmony import */ var _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/asset-access.service */ 16379);
/* harmony import */ var _services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/asset-calendar-view */ 27022);















const KEYS = ['calendar', 'busy', 'available', 'previous', 'next', 'today', 'refresh', 'loading', 'error', 'publicIntro', 'privateIntro', 'details', 'customer', 'status', 'period', 'back', 'timezone', 'manage'];
const TEXT = {
  fr: ['Calendrier', 'Occupé', 'Aucune occupation enregistrée', 'Mois précédent', 'Mois suivant', 'Aujourd’hui', 'Actualiser', 'Chargement…', 'Impossible de charger le calendrier.', 'Seules les périodes occupées sont affichées. Les informations des réservations restent privées.', 'Sélectionnez une réservation pour consulter son détail.', 'Détail de la réservation', 'Client', 'Statut', 'Période', 'Voir le bien', 'Horaires : Europe/Paris', 'Ouvrir la réservation'],
  en: ['Calendar', 'Busy', 'No recorded occupancy', 'Previous month', 'Next month', 'Today', 'Refresh', 'Loading…', 'Unable to load the calendar.', 'Only busy periods are shown. Booking information remains private.', 'Select a booking to view its details.', 'Booking details', 'Customer', 'Status', 'Period', 'View asset', 'Times: Europe/Paris', 'Open booking'],
  es: ['Calendario', 'Ocupado', 'Sin ocupación registrada', 'Mes anterior', 'Mes siguiente', 'Hoy', 'Actualizar', 'Cargando…', 'No se puede cargar el calendario.', 'Solo se muestran períodos ocupados. Los datos de las reservas son privados.', 'Seleccione una reserva para ver sus detalles.', 'Detalles de la reserva', 'Cliente', 'Estado', 'Período', 'Ver bien', 'Horario: Europe/Paris', 'Abrir reserva'],
  it: ['Calendario', 'Occupato', 'Nessuna occupazione registrata', 'Mese precedente', 'Mese successivo', 'Oggi', 'Aggiorna', 'Caricamento…', 'Impossibile caricare il calendario.', 'Sono mostrati solo i periodi occupati. Le informazioni delle prenotazioni sono private.', 'Seleziona una prenotazione per vedere i dettagli.', 'Dettagli della prenotazione', 'Cliente', 'Stato', 'Periodo', 'Vedi bene', 'Orari: Europe/Paris', 'Apri prenotazione'],
  de: ['Kalender', 'Belegt', 'Keine Belegung erfasst', 'Vorheriger Monat', 'Nächster Monat', 'Heute', 'Aktualisieren', 'Laden…', 'Kalender konnte nicht geladen werden.', 'Nur belegte Zeiträume werden angezeigt. Buchungsdaten bleiben privat.', 'Buchung auswählen, um Details anzuzeigen.', 'Buchungsdetails', 'Kunde', 'Status', 'Zeitraum', 'Objekt ansehen', 'Zeiten: Europe/Paris', 'Buchung öffnen'],
  nl: ['Kalender', 'Bezet', 'Geen bezetting geregistreerd', 'Vorige maand', 'Volgende maand', 'Vandaag', 'Vernieuwen', 'Laden…', 'Kalender kan niet worden geladen.', 'Alleen bezette perioden worden getoond. Boekingsgegevens blijven privé.', 'Selecteer een boeking om details te bekijken.', 'Boekingsdetails', 'Klant', 'Status', 'Periode', 'Object bekijken', 'Tijden: Europe/Paris', 'Boeking openen'],
  ru: ['Календарь', 'Занято', 'Занятость не зарегистрирована', 'Предыдущий месяц', 'Следующий месяц', 'Сегодня', 'Обновить', 'Загрузка…', 'Не удалось загрузить календарь.', 'Показаны только занятые периоды. Данные бронирований скрыты.', 'Выберите бронирование для просмотра деталей.', 'Детали бронирования', 'Клиент', 'Статус', 'Период', 'Посмотреть объект', 'Время: Europe/Paris', 'Открыть бронирование']
};
let AssetCalendarComponent = class AssetCalendarComponent {
  http;
  route;
  auth;
  language;
  access;
  store;
  from = '';
  to = '';
  action = 'personal';
  rate = null;
  second = false;
  saving = false;
  notice = '';
  save() {
    var _this = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.saving = true;
      _this.notice = '';
      try {
        yield (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.firstValueFrom)(_this.http.patch('/api/assets/' + _this.type + '/' + _this.id + '/calendar', {
          start: _this.from,
          end: _this.to,
          action: _this.action,
          rate: _this.rate
        }, {
          headers: yield _this.auth.headers()
        }));
        yield _this.load();
        _this.notice = 'Calendrier enregistré.';
      } catch (e) {
        _this.notice = e?.status === 409 ? 'Cette période contient déjà une réservation.' : 'Modification impossible. Vérifiez les dates, le tarif et vos droits.';
      } finally {
        _this.saving = false;
      }
    })();
  }
  type = '';
  id = '';
  data = null;
  events = [];
  busy = false;
  error = false;
  year = Number((0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(Date.now()).slice(0, 4));
  month = Number((0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(Date.now()).slice(5, 7)) - 1;
  selectedDay = '';
  selectedEvent = null;
  sequence = 0;
  sub;
  constructor(http, route, auth, language, access, store) {
    this.http = http;
    this.route = route;
    this.auth = auth;
    this.language = language;
    this.access = access;
    this.store = store;
  }
  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(p => {
      this.from = this.to = '';
      this.second = false;
      this.type = p.get('type') || '';
      this.id = p.get('id') || '';
      void this.load();
    });
  }
  ngOnDestroy() {
    this.sequence++;
    this.sub?.unsubscribe();
    this.data = null;
    this.events = [];
    this.selectedEvent = null;
  }
  t(key) {
    return (TEXT[this.language.currentLanguage] || TEXT.en)[KEYS.indexOf(key)] || key;
  }
  grid = (0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.monthCells)(this.year, this.month);
  gridKey = this.year + ':' + this.month;
  get cells() {
    const k = this.year + ':' + this.month;
    if (k !== this.gridKey) {
      this.grid = (0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.monthCells)(this.year, this.month);
      this.gridKey = k;
    }
    return this.grid;
  }
  trackDay = (_, c) => c.key;
  byDay = new Map();
  empty = [];
  indexEvents() {
    this.byDay.clear();
    const cells = this.cells;
    for (const event of this.events) {
      const a = Date.parse(event.startAt),
        z = Date.parse(event.endAt);
      if (!Number.isFinite(a) || !Number.isFinite(z) || a >= z) continue;
      const first = (0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(a),
        last = (0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(z - 1);
      for (const c of cells) {
        if (c.key < first || c.key > last) continue;
        const bucket = this.byDay.get(c.key) || [];
        bucket.push(event);
        this.byDay.set(c.key, bucket);
      }
    }
  }
  get heading() {
    return new Intl.DateTimeFormat(this.language.currentLanguage, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(this.year, this.month, 1)));
  }
  get weekdays() {
    return Array.from({
      length: 7
    }, (_, i) => new Intl.DateTimeFormat(this.language.currentLanguage, {
      weekday: 'short',
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(2026, 0, 5 + i))));
  }
  dayEvents(key) {
    return this.byDay.get(key) || this.empty;
  }
  occupied(key) {
    return this.data?.days?.[key]?.blocked || this.dayEvents(key).some(e => !['cancelled', 'canceled', 'rejected', 'refused'].includes(e.status));
  }
  today(key) {
    return key === (0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(Date.now());
  }
  change(delta) {
    const d = new Date(Date.UTC(this.year, this.month + delta, 1));
    this.year = d.getUTCFullYear();
    this.month = d.getUTCMonth();
    void this.load();
  }
  now() {
    const d = new Date((0,_services_asset_calendar_view__WEBPACK_IMPORTED_MODULE_6__.parisDay)(Date.now()) + 'T12:00:00Z');
    this.year = d.getUTCFullYear();
    this.month = d.getUTCMonth();
    void this.load();
  }
  anchor = '';
  moved = false;
  skipClick = false;
  startRange(e, key) {
    if (!this.data?.isOwner || this.saving || e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('.event')) return;
    this.skipClick = false;
    this.anchor = key;
    this.moved = false;
  }
  extendRange(e, key) {
    if (!this.anchor || e.pointerType !== 'mouse') return;
    if (!(e.buttons & 1)) {
      this.endRange();
      return;
    }
    if (key !== this.anchor) this.moved = true;
    if (!this.moved) return;
    this.from = key < this.anchor ? key : this.anchor;
    this.to = key > this.anchor ? key : this.anchor;
    this.selectedDay = key;
    this.selectedEvent = null;
    this.second = false;
  }
  endRange() {
    if (this.anchor) this.skipClick = this.moved;
    this.anchor = '';
    this.moved = false;
  }
  clickCell(e, key) {
    if (e.detail && this.skipClick) {
      this.skipClick = false;
      return;
    }
    this.skipClick = false;
    this.selectDay(key);
  }
  selectDay(key) {
    if (this.data?.isOwner) {
      if (!this.second) {
        this.from = this.to = key;
      } else {
        this.to = key;
        if (this.from > key) [this.from, this.to] = [key, this.from];
      }
      this.second = !this.second;
    }
    this.selectedDay = key;
    this.selectedEvent = null;
  }
  selectEvent(e) {
    if (this.data?.canViewDetails) this.selectedEvent = e;
  }
  period(e) {
    const f = new Intl.DateTimeFormat(this.language.currentLanguage, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/Paris'
    });
    return f.format(new Date(e.startAt)) + ' → ' + f.format(new Date(e.endAt));
  }
  status(value) {
    const keys = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];
    const copy = {
      fr: ['En attente', 'Confirmée', 'Terminée', 'Annulée', 'Refusée'],
      en: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'],
      es: ['Pendiente', 'Confirmada', 'Finalizada', 'Cancelada', 'Rechazada'],
      it: ['In attesa', 'Confermata', 'Completata', 'Annullata', 'Rifiutata'],
      de: ['Ausstehend', 'Bestätigt', 'Abgeschlossen', 'Storniert', 'Abgelehnt'],
      nl: ['In afwachting', 'Bevestigd', 'Voltooid', 'Geannuleerd', 'Afgewezen'],
      ru: ['В ожидании', 'Подтверждено', 'Завершено', 'Отменено', 'Отклонено']
    };
    const index = keys.indexOf(value === 'canceled' ? 'cancelled' : value);
    return index < 0 ? value : (copy[this.language.currentLanguage] || copy.en)[index];
  }
  load() {
    var _this2 = this;
    return (0,_Users_faycalamrani_data_ADN_boatify_app_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const seq = ++_this2.sequence;
      _this2.data = null;
      _this2.events = [];
      _this2.selectedDay = '';
      _this2.selectedEvent = null;
      _this2.busy = true;
      _this2.error = false;
      try {
        const deadline = Date.now() + 15000;
        const store = _this2.store;
        while (!(store.firebaseauth || store.firebaseAuth || store.auth) && Date.now() < deadline) {
          yield new Promise(resolve => setTimeout(resolve, 100));
        }
        if (seq !== _this2.sequence) return;
        let headers;
        try {
          headers = yield _this2.auth.headers();
        } catch {}
        const uid = _this2.access.authenticatedUid;
        const cells = _this2.cells;
        const params = {
          start: new Date(Date.parse(cells[0].key + 'T00:00:00Z') - 86400000).toISOString(),
          end: new Date(Date.parse(cells[cells.length - 1].key + 'T00:00:00Z') + 2 * 86400000).toISOString()
        };
        const data = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.firstValueFrom)(_this2.http.get('/api/assets/' + [_this2.type, _this2.id].map(encodeURIComponent).join('/') + '/calendar', {
          headers,
          params
        }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.timeout)(15000)));
        if (seq !== _this2.sequence) return;
        if (uid !== _this2.access.authenticatedUid) {
          _this2.error = true;
          return;
        }
        _this2.data = data;
        _this2.events = data.events || [];
        _this2.indexEvents();
      } catch {
        if (seq === _this2.sequence) _this2.error = true;
      } finally {
        if (seq === _this2.sequence) _this2.busy = false;
      }
    })();
  }
  static ctorParameters = () => [{
    type: _angular_common_http__WEBPACK_IMPORTED_MODULE_9__.HttpClient
  }, {
    type: _angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute
  }, {
    type: _services_reservation_auth_service__WEBPACK_IMPORTED_MODULE_3__.ReservationAuthService
  }, {
    type: _services_language_service__WEBPACK_IMPORTED_MODULE_4__.LanguageService
  }, {
    type: _services_asset_access_service__WEBPACK_IMPORTED_MODULE_5__.AssetAccessService
  }, {
    type: godigital_lib__WEBPACK_IMPORTED_MODULE_11__.StoreDbService
  }];
  static propDecorators = {
    endRange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_12__.HostListener,
      args: ['window:pointerup']
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_12__.HostListener,
      args: ['window:blur']
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_12__.HostListener,
      args: ['window:pointercancel']
    }]
  };
};
AssetCalendarComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_12__.Component)({
  selector: 'app-asset-calendar',
  standalone: true,
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.CommonModule, _angular_router__WEBPACK_IMPORTED_MODULE_15__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_16__.FormsModule],
  template: _asset_calendar_component_html_ngResource__WEBPACK_IMPORTED_MODULE_1__,
  styles: [(_asset_calendar_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_2___default())]
})], AssetCalendarComponent);


/***/ }),

/***/ 88239:
/*!*******************************************************************!*\
  !*** ./src/app/calendar/asset-calendar.component.html?ngResource ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<main class=\"calendar-page\"><a routerLink=\"/\">← GoDirect</a> · <a [routerLink]=\"['/',type,id,'home']\">{{t('back')}}</a>\n <header><div><h1>{{t('calendar')}}<span *ngIf=\"data\"> — {{data.assetName}}</span></h1><p>{{t(data?.canViewDetails?'privateIntro':'publicIntro')}}</p><small>{{t('timezone')}}</small></div><button type=\"button\" (click)=\"load()\" [disabled]=\"busy\">{{t('refresh')}}</button></header>\n <nav class=\"month-nav\"><button type=\"button\" (click)=\"change(-1)\" [attr.aria-label]=\"t('previous')\">←</button><h2>{{heading}}</h2><button type=\"button\" (click)=\"change(1)\" [attr.aria-label]=\"t('next')\">→</button><button type=\"button\" (click)=\"now()\">{{t('today')}}</button></nav>\n <p *ngIf=\"busy\" role=\"status\">{{t('loading')}}</p><p *ngIf=\"error\" role=\"alert\">{{t('error')}}</p>\n <ng-container *ngIf=\"data&&!busy&&!error\"><section *ngIf=\"data.isOwner\" class=\"agenda editor\"><h2>Gérer mon calendrier</h2>\n<p>Glissez sur le calendrier ou choisissez deux dates. Le premier et le dernier jour sont inclus.</p>\n<div class=\"period\"><label>Du<input type=\"date\" [(ngModel)]=\"from\"></label><label>Au<input type=\"date\" [(ngModel)]=\"to\"></label></div>\n<fieldset><legend>Action sur cette période</legend><div class=\"choices\"><label class=\"choice\"><input type=\"radio\" name=\"calendarAction\" [(ngModel)]=\"action\" value=\"personal\"><span>Réserver pour moi</span></label><label class=\"choice\"><input type=\"radio\" name=\"calendarAction\" [(ngModel)]=\"action\" value=\"block\"><span>Bloquer les dates</span></label><label class=\"choice\"><input type=\"radio\" name=\"calendarAction\" [(ngModel)]=\"action\" value=\"open\"><span>Rouvrir les dates</span></label><label class=\"choice\"><input type=\"radio\" name=\"calendarAction\" [(ngModel)]=\"action\" value=\"rate\"><span>Fixer un tarif</span></label><label class=\"choice\"><input type=\"radio\" name=\"calendarAction\" [(ngModel)]=\"action\" value=\"reset\"><span>Rétablir le tarif de base</span></label></div></fieldset>\n<label class=\"amount\" *ngIf=\"action==='rate'\">Tarif par {{data.unit==='night'?'nuit':data.unit==='hour'?'heure':'jour'}} ({{data.currency}})<input type=\"number\" min=\"0.01\" step=\"0.01\" [(ngModel)]=\"rate\"></label>\n<button class=\"apply\" type=\"button\" (click)=\"save()\" [disabled]=\"saving||!from||!to||from>to||(action==='rate'&&!(rate && rate>0))\">{{saving?'Enregistrement…':'Appliquer à la période'}}</button>\n </section><p role=\"status\">{{notice}}</p><div class=\"weekdays\"><span *ngFor=\"let day of weekdays\">{{day}}</span></div><div class=\"month-grid\" [class.editable-range]=\"data.isOwner\">\n <div class=\"day\" *ngFor=\"let cell of cells; trackBy: trackDay\" (pointerdown)=\"startRange($event,cell.key)\" (pointerenter)=\"extendRange($event,cell.key)\" (click)=\"clickCell($event,cell.key)\" [class.in-range]=\"data.isOwner && from && to && cell.key>=from && cell.key<=to\" [class.range-edge]=\"data.isOwner && (cell.key===from || cell.key===to)\" [class.outside]=\"!cell.inMonth\" [class.occupied]=\"occupied(cell.key)\" [class.today]=\"today(cell.key)\" [class.selected]=\"selectedDay===cell.key\">\n <button class=\"day-number\" type=\"button\" [attr.aria-label]=\"cell.key+' — '+t(occupied(cell.key)?'busy':'available')\">{{cell.day}}</button>\n <small *ngIf=\"data.days?.[cell.key]?.blocked\">Indisponible</small><small *ngIf=\"(data.days?.[cell.key]?.rate ?? data.basePrice) != null\">{{ data.days?.[cell.key]?.rate ?? data.basePrice }} {{data.currency}}</small><ng-container *ngIf=\"data.canViewDetails;else publicDay\"><button class=\"event\" type=\"button\" *ngFor=\"let event of dayEvents(cell.key).slice(0,3)\" (click)=\"$event.stopPropagation();selectedDay=cell.key;selectEvent(event)\">{{event.customerName||event.id}}<small>{{status(event.status)}}</small></button><small *ngIf=\"dayEvents(cell.key).length>3\">+{{dayEvents(cell.key).length-3}}</small></ng-container>\n <ng-template #publicDay><span class=\"busy-label\" *ngIf=\"occupied(cell.key)\">{{t('busy')}}</span></ng-template>\n </div></div>\n <section class=\"agenda\" *ngIf=\"selectedDay\"><h2>{{selectedDay}}</h2><p *ngIf=\"!occupied(selectedDay)&&!dayEvents(selectedDay).length\">{{t('available')}}</p><ng-container *ngFor=\"let event of dayEvents(selectedDay)\"><button *ngIf=\"data.canViewDetails;else publicPeriod\" type=\"button\" (click)=\"selectEvent(event)\">{{event.customerName||event.id}} · {{period(event)}} · {{status(event.status)}}</button><ng-template #publicPeriod><p>{{t('busy')}} · {{period(event)}}</p></ng-template></ng-container></section>\n <section class=\"detail\" *ngIf=\"data.canViewDetails&&selectedEvent\" aria-live=\"polite\"><h2>{{t('details')}}</h2><dl><dt>ID</dt><dd>{{selectedEvent.id}}</dd><dt>{{t('customer')}}</dt><dd>{{selectedEvent.customerName}}<br>{{selectedEvent.customerEmail}}</dd><dt>{{t('period')}}</dt><dd>{{period(selectedEvent)}}</dd><dt>{{t('status')}}</dt><dd>{{status(selectedEvent.status)}}</dd></dl><a *ngIf=\"data.canManageBookings&&selectedEvent.source==='booking'\" [routerLink]=\"['/',type,id,'admin/reservations',selectedEvent.id]\">{{t('manage')}}</a></section>\n </ng-container></main>\n";

/***/ })

}]);
//# sourceMappingURL=src_app_calendar_asset-calendar_component_ts.js.map