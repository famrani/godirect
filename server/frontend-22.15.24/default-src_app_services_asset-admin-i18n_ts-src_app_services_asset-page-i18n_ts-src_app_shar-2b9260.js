(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["default-src_app_services_asset-admin-i18n_ts-src_app_services_asset-page-i18n_ts-src_app_shar-2b9260"],{

/***/ 11665:
/*!*****************************************************************************************!*\
  !*** ./src/app/shared/components/asset-gallery/asset-gallery.component.scss?ngResource ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ 53142);
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ 35950);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:host {
  display: block;
  min-width: 0;
}

.asset-gallery {
  display: grid;
  gap: 12px;
  width: 100%;
  color: #17202a;
}

.asset-gallery-main {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: #ece9e2;
  aspect-ratio: 16/10;
  box-shadow: 0 10px 30px rgba(23, 32, 42, 0.08);
}

.asset-gallery-main img {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  object-fit: cover !important;
  display: block !important;
  opacity: 1 !important;
  filter: none !important;
  mix-blend-mode: normal !important;
}

.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(12, 30, 42, 0.68);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.2);
  transition: background 0.15s ease, transform 0.15s ease;
}

.gallery-nav:hover {
  background: rgba(12, 30, 42, 0.88);
  transform: translateY(-50%) scale(1.04);
}

.gallery-nav:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.9);
  outline-offset: 2px;
}

.gallery-nav span {
  display: block;
  font-size: 38px;
  line-height: 36px;
  font-weight: 300;
  margin-top: -3px;
}

.gallery-nav-prev {
  left: 14px;
}

.gallery-nav-next {
  right: 14px;
}

.gallery-counter {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 3;
  min-width: 54px;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(12, 30, 42, 0.72);
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
}

.asset-gallery-thumbs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: thin;
}

.asset-gallery-thumbs button {
  flex: 0 0 108px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  height: 78px;
  transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.asset-gallery-thumbs button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(23, 32, 42, 0.1);
}

.asset-gallery-thumbs button.active {
  border-color: #12364a;
  box-shadow: 0 0 0 1px #12364a;
}

.asset-gallery-thumbs button:focus-visible {
  outline: 3px solid rgba(18, 54, 74, 0.28);
  outline-offset: 2px;
}

.asset-gallery-thumbs img {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
  opacity: 1 !important;
  filter: none !important;
}

@media (max-width: 640px) {
  .gallery-nav {
    width: 40px;
    height: 40px;
  }
  .gallery-nav span {
    font-size: 32px;
  }
  .gallery-nav-prev {
    left: 10px;
  }
  .gallery-nav-next {
    right: 10px;
  }
  .gallery-counter {
    right: 10px;
    bottom: 10px;
  }
  .asset-gallery-thumbs button {
    flex-basis: 88px;
    height: 64px;
  }
}
.asset-gallery-main {
  cursor: zoom-in;
}

.gallery-zoom-hint {
  position: absolute;
  left: 14px;
  bottom: 14px;
  z-index: 3;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(12, 30, 42, 0.68);
  color: #fff;
  font-size: 20px;
  pointer-events: none;
}

.asset-lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(5, 12, 18, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 72px 20px;
  color: #fff;
}

.lightbox-stage {
  position: relative;
  width: min(92vw, 1400px);
  height: min(76vh, 900px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-stage img {
  position: static !important;
  display: block !important;
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
  opacity: 1 !important;
  filter: none !important;
}

.lightbox-close {
  position: fixed;
  top: 18px;
  right: 24px;
  z-index: 10003;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10002;
  width: 54px;
  height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.42);
  color: #fff;
  font-size: 42px;
  line-height: 1;
  cursor: pointer;
}

.lightbox-prev {
  left: -64px;
}

.lightbox-next {
  right: -64px;
}

.lightbox-counter {
  margin-top: 10px;
  font-weight: 700;
  font-size: 14px;
}

.lightbox-thumbs {
  width: min(92vw, 1000px);
  display: flex;
  justify-content: center;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 4px 2px;
}

.lightbox-thumbs button {
  flex: 0 0 88px;
  height: 62px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  opacity: 0.68;
}

.lightbox-thumbs button.active {
  border-color: #fff;
  opacity: 1;
}

.lightbox-thumbs img {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

:host-context(body.asset-lightbox-open) {
  overscroll-behavior: none;
}

@media (max-width: 700px) {
  .asset-lightbox {
    padding: 64px 12px 16px;
  }
  .lightbox-stage {
    width: 100%;
    height: 68vh;
  }
  .lightbox-nav {
    width: 44px;
    height: 44px;
    font-size: 34px;
    background: rgba(0, 0, 0, 0.58);
  }
  .lightbox-prev {
    left: 8px;
  }
  .lightbox-next {
    right: 8px;
  }
  .lightbox-close {
    top: 12px;
    right: 12px;
  }
  .lightbox-thumbs {
    width: 100%;
    justify-content: flex-start;
  }
  .lightbox-thumbs button {
    flex-basis: 72px;
    height: 52px;
  }
}
/* R5.5: keep carousel controls unmistakably visible above every image */
.gallery-nav, .lightbox-nav {
  display: grid !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  isolation: isolate;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
}

.gallery-nav {
  z-index: 50 !important;
  background: rgba(0, 0, 0, 0.72) !important;
  border: 2px solid rgba(255, 255, 255, 0.92) !important;
}

.lightbox-stage {
  overflow: visible !important;
}

.lightbox-nav {
  position: fixed !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10050 !important;
  width: 58px !important;
  height: 58px !important;
  display: grid !important;
  place-items: center !important;
  padding: 0 !important;
  background: rgba(0, 0, 0, 0.78) !important;
  border: 2px solid rgba(255, 255, 255, 0.95) !important;
  color: #fff !important;
  box-shadow: 0 4px 22px rgba(0, 0, 0, 0.45) !important;
  font-size: 44px !important;
  line-height: 1 !important;
}

.lightbox-prev {
  left: 24px !important;
}

.lightbox-next {
  right: 24px !important;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.95) !important;
}

.lightbox-nav:focus-visible {
  outline: 3px solid #fff !important;
  outline-offset: 3px;
}

@media (max-width: 700px) {
  .lightbox-nav {
    width: 46px !important;
    height: 46px !important;
    font-size: 36px !important;
  }
  .lightbox-prev {
    left: 10px !important;
  }
  .lightbox-next {
    right: 10px !important;
  }
}`, "",{"version":3,"sources":["webpack://./src/app/shared/components/asset-gallery/asset-gallery.component.scss"],"names":[],"mappings":"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","sourcesContent":[":host { display:block; min-width:0; }\n.asset-gallery { display:grid; gap:12px; width:100%; color:#17202a; }\n.asset-gallery-main { position:relative; border-radius:18px; overflow:hidden; background:#ece9e2; aspect-ratio:16/10; box-shadow:0 10px 30px rgba(23,32,42,.08); }\n.asset-gallery-main img { position:static !important; width:100% !important; height:100% !important; max-width:100%; object-fit:cover !important; display:block !important; opacity:1 !important; filter:none !important; mix-blend-mode:normal !important; }\n\n.gallery-nav { position:absolute; top:50%; transform:translateY(-50%); z-index:3; width:46px; height:46px; padding:0; border:1px solid rgba(255,255,255,.55); border-radius:50%; display:grid; place-items:center; background:rgba(12,30,42,.68); color:#fff; cursor:pointer; box-shadow:0 4px 18px rgba(0,0,0,.2); transition:background .15s ease, transform .15s ease; }\n.gallery-nav:hover { background:rgba(12,30,42,.88); transform:translateY(-50%) scale(1.04); }\n.gallery-nav:focus-visible { outline:3px solid rgba(255,255,255,.9); outline-offset:2px; }\n.gallery-nav span { display:block; font-size:38px; line-height:36px; font-weight:300; margin-top:-3px; }\n.gallery-nav-prev { left:14px; }\n.gallery-nav-next { right:14px; }\n.gallery-counter { position:absolute; right:14px; bottom:14px; z-index:3; min-width:54px; padding:7px 11px; border-radius:999px; background:rgba(12,30,42,.72); color:#fff; text-align:center; font-size:13px; font-weight:700; letter-spacing:.02em; backdrop-filter:blur(4px); }\n\n.asset-gallery-thumbs { display:flex; gap:8px; overflow-x:auto; padding:2px 2px 6px; scrollbar-width:thin; }\n.asset-gallery-thumbs button { flex:0 0 108px; padding:0; border:2px solid transparent; border-radius:10px; overflow:hidden; background:#fff; cursor:pointer; height:78px; transition:border-color .15s ease, transform .15s ease, box-shadow .15s ease; }\n.asset-gallery-thumbs button:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(23,32,42,.1); }\n.asset-gallery-thumbs button.active { border-color:#12364a; box-shadow:0 0 0 1px #12364a; }\n.asset-gallery-thumbs button:focus-visible { outline:3px solid rgba(18,54,74,.28); outline-offset:2px; }\n.asset-gallery-thumbs img { position:static !important; width:100% !important; height:100% !important; object-fit:cover !important; display:block !important; opacity:1 !important; filter:none !important; }\n\n@media (max-width:640px) {\n  .gallery-nav { width:40px; height:40px; }\n  .gallery-nav span { font-size:32px; }\n  .gallery-nav-prev { left:10px; }\n  .gallery-nav-next { right:10px; }\n  .gallery-counter { right:10px; bottom:10px; }\n  .asset-gallery-thumbs button { flex-basis:88px; height:64px; }\n}\n\n.asset-gallery-main { cursor:zoom-in; }\n.gallery-zoom-hint { position:absolute; left:14px; bottom:14px; z-index:3; width:38px; height:38px; border-radius:50%; display:grid; place-items:center; background:rgba(12,30,42,.68); color:#fff; font-size:20px; pointer-events:none; }\n.asset-lightbox { position:fixed; inset:0; z-index:10000; background:rgba(5,12,18,.96); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px 72px 20px; color:#fff; }\n.lightbox-stage { position:relative; width:min(92vw,1400px); height:min(76vh,900px); display:flex; align-items:center; justify-content:center; }\n.lightbox-stage img { position:static !important; display:block !important; width:auto !important; height:auto !important; max-width:100% !important; max-height:100% !important; object-fit:contain !important; opacity:1 !important; filter:none !important; }\n.lightbox-close { position:fixed; top:18px; right:24px; z-index:10003; width:48px; height:48px; border:0; border-radius:50%; background:rgba(255,255,255,.14); color:#fff; font-size:34px; line-height:1; cursor:pointer; }\n.lightbox-nav { position:absolute; top:50%; transform:translateY(-50%); z-index:10002; width:54px; height:54px; border:1px solid rgba(255,255,255,.45); border-radius:50%; background:rgba(0,0,0,.42); color:#fff; font-size:42px; line-height:1; cursor:pointer; }\n.lightbox-prev { left:-64px; }\n.lightbox-next { right:-64px; }\n.lightbox-counter { margin-top:10px; font-weight:700; font-size:14px; }\n.lightbox-thumbs { width:min(92vw,1000px); display:flex; justify-content:center; gap:8px; overflow-x:auto; padding:12px 4px 2px; }\n.lightbox-thumbs button { flex:0 0 88px; height:62px; padding:0; border:2px solid transparent; border-radius:8px; overflow:hidden; background:transparent; cursor:pointer; opacity:.68; }\n.lightbox-thumbs button.active { border-color:#fff; opacity:1; }\n.lightbox-thumbs img { position:static !important; width:100% !important; height:100% !important; object-fit:cover !important; display:block !important; }\n:host-context(body.asset-lightbox-open) { overscroll-behavior:none; }\n@media (max-width:700px) {\n  .asset-lightbox { padding:64px 12px 16px; }\n  .lightbox-stage { width:100%; height:68vh; }\n  .lightbox-nav { width:44px; height:44px; font-size:34px; background:rgba(0,0,0,.58); }\n  .lightbox-prev { left:8px; }\n  .lightbox-next { right:8px; }\n  .lightbox-close { top:12px; right:12px; }\n  .lightbox-thumbs { width:100%; justify-content:flex-start; }\n  .lightbox-thumbs button { flex-basis:72px; height:52px; }\n}\n\n/* R5.5: keep carousel controls unmistakably visible above every image */\n.gallery-nav, .lightbox-nav {\n  display: grid !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n  isolation: isolate;\n  font-family: Arial, Helvetica, sans-serif;\n  font-weight: 700;\n  text-shadow: 0 1px 3px rgba(0,0,0,.55);\n}\n.gallery-nav { z-index: 50 !important; background: rgba(0,0,0,.72) !important; border: 2px solid rgba(255,255,255,.92) !important; }\n.lightbox-stage { overflow: visible !important; }\n.lightbox-nav {\n  position: fixed !important;\n  top: 50% !important;\n  transform: translateY(-50%) !important;\n  z-index: 10050 !important;\n  width: 58px !important;\n  height: 58px !important;\n  display: grid !important;\n  place-items: center !important;\n  padding: 0 !important;\n  background: rgba(0,0,0,.78) !important;\n  border: 2px solid rgba(255,255,255,.95) !important;\n  color: #fff !important;\n  box-shadow: 0 4px 22px rgba(0,0,0,.45) !important;\n  font-size: 44px !important;\n  line-height: 1 !important;\n}\n.lightbox-prev { left: 24px !important; }\n.lightbox-next { right: 24px !important; }\n.lightbox-nav:hover { background: rgba(0,0,0,.95) !important; }\n.lightbox-nav:focus-visible { outline: 3px solid #fff !important; outline-offset: 3px; }\n@media (max-width:700px) {\n  .lightbox-nav { width: 46px !important; height: 46px !important; font-size: 36px !important; }\n  .lightbox-prev { left: 10px !important; }\n  .lightbox-next { right: 10px !important; }\n}\n"],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___.toString();


/***/ }),

/***/ 28159:
/*!*****************************************************************************************!*\
  !*** ./src/app/shared/components/asset-gallery/asset-gallery.component.html?ngResource ***!
  \*****************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = "<div class=\"asset-gallery\" *ngIf=\"images?.length\">\n  <div class=\"asset-gallery-main\" (click)=\"openLightbox()\" role=\"button\" tabindex=\"0\" (keyup.enter)=\"openLightbox()\" [attr.aria-label]=\"'Agrandir ' + title\">\n    <img [src]=\"selected\" [alt]=\"title\" />\n    <ng-container *ngIf=\"images.length > 1\">\n      <button type=\"button\" class=\"gallery-nav gallery-nav-prev\" [attr.aria-label]=\"'ui.pages.t8addcb578d81' | siteText\" (click)=\"previous($event)\"><span aria-hidden=\"true\">‹</span></button>\n      <button type=\"button\" class=\"gallery-nav gallery-nav-next\" [attr.aria-label]=\"'ui.pages.t4759c4115808' | siteText\" (click)=\"next($event)\"><span aria-hidden=\"true\">›</span></button>\n      <div class=\"gallery-counter\" aria-live=\"polite\">{{ selectedIndex + 1 }} / {{ images.length }}</div>\n    </ng-container>\n    <div class=\"gallery-zoom-hint\" aria-hidden=\"true\">⛶</div>\n  </div>\n\n  <div class=\"asset-gallery-thumbs\" *ngIf=\"images.length > 1\">\n    <button type=\"button\" *ngFor=\"let image of images; let i = index\" [class.active]=\"i === selectedIndex\"\n      [attr.aria-label]=\"'Afficher la photo ' + (i + 1)\" [attr.aria-current]=\"i === selectedIndex ? 'true' : null\" (click)=\"selectIndex(i)\">\n      <img [src]=\"image\" [alt]=\"title + ' — photo ' + (i + 1)\" />\n    </button>\n  </div>\n</div>\n\n<div class=\"asset-lightbox\" *ngIf=\"lightboxOpen\" role=\"dialog\" aria-modal=\"true\" [attr.aria-label]=\"title + ' — galerie photos'\"\n  (click)=\"lightboxBackdropClick($event)\" (touchstart)=\"onTouchStart($event)\" (touchend)=\"onTouchEnd($event)\">\n  <button type=\"button\" class=\"lightbox-close\" [attr.aria-label]=\"'ui.pages.t5ab4ec640d65' | siteText\" (click)=\"closeLightbox($event)\">×</button>\n  <div class=\"lightbox-stage\">\n    <img [src]=\"selected\" [alt]=\"title + ' — photo ' + (selectedIndex + 1)\" />\n    <ng-container *ngIf=\"images.length > 1\">\n      <button type=\"button\" class=\"lightbox-nav lightbox-prev\" [attr.aria-label]=\"'ui.pages.t8addcb578d81' | siteText\" (click)=\"previous($event)\">‹</button>\n      <button type=\"button\" class=\"lightbox-nav lightbox-next\" [attr.aria-label]=\"'ui.pages.t4759c4115808' | siteText\" (click)=\"next($event)\">›</button>\n    </ng-container>\n  </div>\n  <div class=\"lightbox-counter\">{{ selectedIndex + 1 }} / {{ images.length }}</div>\n  <div class=\"lightbox-thumbs\" *ngIf=\"images.length > 1\">\n    <button type=\"button\" *ngFor=\"let image of images; let i = index\" [class.active]=\"i === selectedIndex\" (click)=\"selectIndex(i); $event.stopPropagation()\">\n      <img [src]=\"image\" [alt]=\"title + ' — photo ' + (i + 1)\" />\n    </button>\n  </div>\n</div>\n";

/***/ }),

/***/ 28466:
/*!**********************************************!*\
  !*** ./src/app/services/asset-admin-i18n.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSET_ADMIN_I18N: () => (/* binding */ ASSET_ADMIN_I18N)
/* harmony export */ });
const ASSET_ADMIN_I18N = {
  "pool": {
    "fr": {
      "eyebrow": "Espace propriétaire",
      "title": "Gestion de la piscine",
      "intro": "Suivez les réservations, validez les demandes et gérez les règlements.",
      "newBooking": "Créer une réservation pour un client",
      "allBookings": "Gérer les réservations",
      "refresh": "Actualiser",
      "upcoming": "Réservations à venir",
      "approvals": "Demandes à approuver",
      "payments": "Règlements ou garanties à suivre",
      "cancellations": "Annulations à traiter",
      "bookingList": "Réservations",
      "attention": "À traiter",
      "all": "Toutes",
      "search": "Rechercher un client ou une référence",
      "guest": "Client",
      "stay": "Créneau",
      "status": "Statut",
      "payment": "Règlements",
      "action": "Action",
      "manage": "Ouvrir",
      "empty": "Aucune réservation dans cette sélection.",
      "loading": "Chargement des réservations…",
      "loadError": "Impossible de charger les réservations. Réessayez.",
      "nextArrival": "Prochaine arrivée confirmée",
      "noArrival": "Aucune arrivée confirmée à venir.",
      "paymentsLink": "Compte Stripe",
      "propertyLink": "Fiche de la piscine",
      "pending": "En attente",
      "confirmed": "Confirmée",
      "cancelled": "Annulée",
      "completed": "Terminée",
      "rejected": "Refusée",
      "cancellationRequested": "Annulation demandée",
      "refundPending": "Remboursements à suivre",
      "refundFollowup": "Voir les remboursements",
      "paymentDue": "À compléter",
      "refundCompleted": "Remboursé intégralement",
      "paymentsReady": "Étapes requises validées",
      "approvalNote": "Les réservations client restent en attente de votre accord après acompte et garantie.",
      "attentionHint": "Demandes, règlements incomplets et annulations nécessitant un suivi."
    },
    "en": {
      "eyebrow": "Owner workspace",
      "title": "Pool management",
      "intro": "Track pool bookings, approve requests and manage payments.",
      "newBooking": "Create a booking for a customer",
      "allBookings": "Manage bookings",
      "refresh": "Refresh",
      "upcoming": "Upcoming pool bookings",
      "approvals": "Awaiting approval",
      "payments": "Payment or warranty follow-up",
      "cancellations": "Cancellation follow-up",
      "bookingList": "Bookings",
      "attention": "Needs attention",
      "all": "All",
      "search": "Search customer or reference",
      "guest": "Customer",
      "stay": "Booking period",
      "status": "Status",
      "payment": "Payments",
      "action": "Action",
      "manage": "Open",
      "empty": "No bookings in this selection.",
      "loading": "Loading bookings…",
      "loadError": "Unable to load bookings. Please retry.",
      "nextArrival": "Next confirmed arrival",
      "noArrival": "No upcoming confirmed arrival.",
      "paymentsLink": "Stripe account",
      "propertyLink": "Pool details",
      "pending": "Pending",
      "confirmed": "Confirmed",
      "cancelled": "Cancelled",
      "completed": "Completed",
      "rejected": "Rejected",
      "cancellationRequested": "Cancellation requested",
      "refundPending": "Refund follow-up",
      "refundFollowup": "View refunds",
      "paymentDue": "Incomplete",
      "refundCompleted": "Fully refunded",
      "paymentsReady": "Required steps completed",
      "approvalNote": "Customer bookings require your approval after deposit and warranty.",
      "attentionHint": "Requests, incomplete payments and cancellations to follow up."
    },
    "es": {
      "eyebrow": "Espacio propietario",
      "title": "Gestión de la piscina",
      "intro": "Sigue las reservas de la piscina, aprueba solicitudes y gestiona pagos.",
      "newBooking": "Crear reserva para un cliente",
      "allBookings": "Gestionar reservas",
      "refresh": "Actualizar",
      "upcoming": "Próximas reservas",
      "approvals": "Solicitudes por aprobar",
      "payments": "Pagos o garantías por revisar",
      "cancellations": "Cancelaciones por gestionar",
      "bookingList": "Reservas",
      "attention": "Por revisar",
      "all": "Todas",
      "search": "Buscar cliente o referencia",
      "guest": "Cliente",
      "stay": "Período reservado",
      "status": "Estado",
      "payment": "Pagos",
      "action": "Acción",
      "manage": "Abrir",
      "empty": "No hay reservas en esta selección.",
      "loading": "Cargando reservas…",
      "loadError": "No se pueden cargar las reservas. Reintenta.",
      "nextArrival": "Próxima llegada confirmada",
      "noArrival": "No hay próximas llegadas confirmadas.",
      "paymentsLink": "Cuenta Stripe",
      "propertyLink": "Ficha de la piscina",
      "pending": "Pendiente",
      "confirmed": "Confirmada",
      "cancelled": "Cancelada",
      "completed": "Finalizada",
      "rejected": "Rechazada",
      "cancellationRequested": "Cancelación solicitada",
      "refundPending": "Reembolsos por revisar",
      "refundFollowup": "Ver reembolsos",
      "paymentDue": "Incompleto",
      "refundCompleted": "Reembolsado totalmente",
      "paymentsReady": "Pasos necesarios completados",
      "approvalNote": "Las reservas de clientes esperan tu aprobación tras el anticipo y la garantía.",
      "attentionHint": "Solicitudes, pagos incompletos y cancelaciones por revisar."
    },
    "it": {
      "eyebrow": "Area proprietario",
      "title": "Gestione piscina",
      "intro": "Segui le prenotazioni della piscina, approva richieste e gestisci pagamenti.",
      "newBooking": "Crea prenotazione per un cliente",
      "allBookings": "Gestisci prenotazioni",
      "refresh": "Aggiorna",
      "upcoming": "Prenotazioni in programma",
      "approvals": "Richieste da approvare",
      "payments": "Pagamenti o garanzie da verificare",
      "cancellations": "Annullamenti da gestire",
      "bookingList": "Prenotazioni",
      "attention": "Da gestire",
      "all": "Tutte",
      "search": "Cerca cliente o riferimento",
      "guest": "Cliente",
      "stay": "Periodo prenotato",
      "status": "Stato",
      "payment": "Pagamenti",
      "action": "Azione",
      "manage": "Apri",
      "empty": "Nessuna prenotazione nella selezione.",
      "loading": "Caricamento prenotazioni…",
      "loadError": "Impossibile caricare le prenotazioni. Riprova.",
      "nextArrival": "Prossimo arrivo confermato",
      "noArrival": "Nessun prossimo arrivo confermato.",
      "paymentsLink": "Account Stripe",
      "propertyLink": "Dettagli piscina",
      "pending": "In attesa",
      "confirmed": "Confermata",
      "cancelled": "Annullata",
      "completed": "Completata",
      "rejected": "Rifiutata",
      "cancellationRequested": "Annullamento richiesto",
      "refundPending": "Rimborsi da verificare",
      "refundFollowup": "Vedi rimborsi",
      "paymentDue": "Incompleto",
      "refundCompleted": "Interamente rimborsato",
      "paymentsReady": "Passaggi richiesti completati",
      "approvalNote": "Le prenotazioni clienti attendono la tua approvazione dopo acconto e garanzia.",
      "attentionHint": "Richieste, pagamenti incompleti e annullamenti da seguire."
    },
    "de": {
      "eyebrow": "Eigentümerbereich",
      "title": "Poolverwaltung",
      "intro": "Poolbuchungen verfolgen, Anfragen genehmigen und Zahlungen verwalten.",
      "newBooking": "Buchung für einen Kunden erstellen",
      "allBookings": "Buchungen verwalten",
      "refresh": "Aktualisieren",
      "upcoming": "Bevorstehende Buchungen",
      "approvals": "Zu genehmigende Anfragen",
      "payments": "Zahlungen oder Kautionen prüfen",
      "cancellations": "Zu bearbeitende Stornierungen",
      "bookingList": "Buchungen",
      "attention": "Handlungsbedarf",
      "all": "Alle",
      "search": "Kunde oder Referenz suchen",
      "guest": "Kunde",
      "stay": "Buchungszeitraum",
      "status": "Status",
      "payment": "Zahlungen",
      "action": "Aktion",
      "manage": "Öffnen",
      "empty": "Keine Buchungen in dieser Auswahl.",
      "loading": "Buchungen werden geladen…",
      "loadError": "Buchungen können nicht geladen werden. Erneut versuchen.",
      "nextArrival": "Nächste bestätigte Ankunft",
      "noArrival": "Keine bevorstehende bestätigte Ankunft.",
      "paymentsLink": "Stripe-Konto",
      "propertyLink": "Pooldetails",
      "pending": "Ausstehend",
      "confirmed": "Bestätigt",
      "cancelled": "Storniert",
      "completed": "Abgeschlossen",
      "rejected": "Abgelehnt",
      "cancellationRequested": "Stornierung angefragt",
      "refundPending": "Erstattungen prüfen",
      "refundFollowup": "Erstattungen ansehen",
      "paymentDue": "Unvollständig",
      "refundCompleted": "Vollständig erstattet",
      "paymentsReady": "Erforderliche Schritte abgeschlossen",
      "approvalNote": "Kundenbuchungen benötigen nach Anzahlung und Kaution Ihre Freigabe.",
      "attentionHint": "Anfragen, unvollständige Zahlungen und Stornierungen zur Nachverfolgung."
    },
    "nl": {
      "eyebrow": "Eigenaarsomgeving",
      "title": "Zwembad beheren",
      "intro": "Volg zwembadboekingen, keur aanvragen goed en beheer betalingen.",
      "newBooking": "Boeking voor een klant maken",
      "allBookings": "Boekingen beheren",
      "refresh": "Vernieuwen",
      "upcoming": "Aankomende boekingen",
      "approvals": "Goed te keuren aanvragen",
      "payments": "Betalingen of borg te controleren",
      "cancellations": "Te behandelen annuleringen",
      "bookingList": "Boekingen",
      "attention": "Aandacht nodig",
      "all": "Alle",
      "search": "Zoek klant of referentie",
      "guest": "Klant",
      "stay": "Boekingsperiode",
      "status": "Status",
      "payment": "Betalingen",
      "action": "Actie",
      "manage": "Openen",
      "empty": "Geen boekingen in deze selectie.",
      "loading": "Boekingen laden…",
      "loadError": "Boekingen kunnen niet worden geladen. Probeer opnieuw.",
      "nextArrival": "Volgende bevestigde aankomst",
      "noArrival": "Geen aankomende bevestigde aankomst.",
      "paymentsLink": "Stripe-account",
      "propertyLink": "Zwembaddetails",
      "pending": "In afwachting",
      "confirmed": "Bevestigd",
      "cancelled": "Geannuleerd",
      "completed": "Voltooid",
      "rejected": "Afgewezen",
      "cancellationRequested": "Annulering aangevraagd",
      "refundPending": "Terugbetalingen te controleren",
      "refundFollowup": "Terugbetalingen bekijken",
      "paymentDue": "Onvolledig",
      "refundCompleted": "Volledig terugbetaald",
      "paymentsReady": "Vereiste stappen voltooid",
      "approvalNote": "Klantboekingen vereisen na aanbetaling en borg je goedkeuring.",
      "attentionHint": "Aanvragen, onvolledige betalingen en annuleringen om op te volgen."
    },
    "ru": {
      "eyebrow": "Кабинет владельца",
      "title": "Управление бассейном",
      "intro": "Отслеживайте бронирования бассейна, одобряйте запросы и управляйте платежами.",
      "newBooking": "Создать бронирование для клиента",
      "allBookings": "Управлять бронированиями",
      "refresh": "Обновить",
      "upcoming": "Предстоящие бронирования",
      "approvals": "Запросы для одобрения",
      "payments": "Платежи или обеспечение для проверки",
      "cancellations": "Отмены для обработки",
      "bookingList": "Бронирования",
      "attention": "Требует внимания",
      "all": "Все",
      "search": "Поиск по клиенту или номеру",
      "guest": "Клиент",
      "stay": "Период бронирования",
      "status": "Статус",
      "payment": "Платежи",
      "action": "Действие",
      "manage": "Открыть",
      "empty": "В этой выборке нет бронирований.",
      "loading": "Загрузка бронирований…",
      "loadError": "Не удалось загрузить бронирования. Повторите попытку.",
      "nextArrival": "Следующее подтверждённое прибытие",
      "noArrival": "Нет предстоящих подтверждённых прибытий.",
      "paymentsLink": "Счёт Stripe",
      "propertyLink": "Сведения о бассейне",
      "pending": "Ожидает",
      "confirmed": "Подтверждено",
      "cancelled": "Отменено",
      "completed": "Завершено",
      "rejected": "Отклонено",
      "cancellationRequested": "Запрошена отмена",
      "refundPending": "Возвраты для проверки",
      "refundFollowup": "Посмотреть возвраты",
      "paymentDue": "Не заполнено",
      "refundCompleted": "Полностью возвращено",
      "paymentsReady": "Обязательные шаги завершены",
      "approvalNote": "Бронирования клиентов требуют вашего одобрения после предоплаты и обеспечения.",
      "attentionHint": "Запросы, неполные платежи и отмены для проверки."
    }
  },
  "property": {
    "fr": {
      "eyebrow": "Espace propriétaire",
      "title": "Gestion du logement",
      "intro": "Suivez les séjours, validez les demandes et gérez les règlements.",
      "newBooking": "Créer une réservation pour un client",
      "allBookings": "Gérer les réservations",
      "refresh": "Actualiser",
      "upcoming": "Séjours à venir",
      "approvals": "Demandes à approuver",
      "payments": "Règlements ou garanties à suivre",
      "cancellations": "Annulations à traiter",
      "bookingList": "Réservations",
      "attention": "À traiter",
      "all": "Toutes",
      "search": "Rechercher un client ou une référence",
      "guest": "Client",
      "stay": "Séjour",
      "status": "Statut",
      "payment": "Règlements",
      "action": "Action",
      "manage": "Ouvrir",
      "empty": "Aucune réservation dans cette sélection.",
      "loading": "Chargement des réservations…",
      "loadError": "Impossible de charger les réservations. Réessayez.",
      "nextArrival": "Prochaine arrivée confirmée",
      "noArrival": "Aucune arrivée confirmée à venir.",
      "paymentsLink": "Compte Stripe",
      "propertyLink": "Fiche du logement",
      "pending": "En attente",
      "confirmed": "Confirmée",
      "cancelled": "Annulée",
      "completed": "Terminée",
      "rejected": "Refusée",
      "cancellationRequested": "Annulation demandée",
      "refundPending": "Remboursements à suivre",
      "refundFollowup": "Voir les remboursements",
      "paymentDue": "À compléter",
      "refundCompleted": "Remboursé intégralement",
      "paymentsReady": "Étapes requises validées",
      "approvalNote": "Les réservations client restent en attente de votre accord après acompte et garantie.",
      "attentionHint": "Demandes, règlements incomplets et annulations nécessitant un suivi."
    },
    "en": {
      "eyebrow": "Owner workspace",
      "title": "Property management",
      "intro": "Track stays, approve requests and manage payments.",
      "newBooking": "Create a booking for a customer",
      "allBookings": "Manage bookings",
      "refresh": "Refresh",
      "upcoming": "Upcoming stays",
      "approvals": "Awaiting approval",
      "payments": "Payment or warranty follow-up",
      "cancellations": "Cancellation follow-up",
      "bookingList": "Bookings",
      "attention": "Needs attention",
      "all": "All",
      "search": "Search customer or reference",
      "guest": "Customer",
      "stay": "Stay",
      "status": "Status",
      "payment": "Payments",
      "action": "Action",
      "manage": "Open",
      "empty": "No bookings in this selection.",
      "loading": "Loading bookings…",
      "loadError": "Unable to load bookings. Please retry.",
      "nextArrival": "Next confirmed arrival",
      "noArrival": "No upcoming confirmed arrival.",
      "paymentsLink": "Stripe account",
      "propertyLink": "Property details",
      "pending": "Pending",
      "confirmed": "Confirmed",
      "cancelled": "Cancelled",
      "completed": "Completed",
      "rejected": "Rejected",
      "cancellationRequested": "Cancellation requested",
      "refundPending": "Refund follow-up",
      "refundFollowup": "View refunds",
      "paymentDue": "Incomplete",
      "refundCompleted": "Fully refunded",
      "paymentsReady": "Required steps completed",
      "approvalNote": "Customer bookings require your approval after deposit and warranty.",
      "attentionHint": "Requests, incomplete payments and cancellations to follow up."
    },
    "es": {
      "eyebrow": "Espacio propietario",
      "title": "Gestión del alojamiento",
      "intro": "Sigue estancias, aprueba solicitudes y gestiona pagos.",
      "newBooking": "Crear reserva para un cliente",
      "allBookings": "Gestionar reservas",
      "refresh": "Actualizar",
      "upcoming": "Próximas reservas",
      "approvals": "Solicitudes por aprobar",
      "payments": "Pagos o garantías por revisar",
      "cancellations": "Cancelaciones por gestionar",
      "bookingList": "Reservas",
      "attention": "Por revisar",
      "all": "Todas",
      "search": "Buscar cliente o referencia",
      "guest": "Cliente",
      "stay": "Período reservado",
      "status": "Estado",
      "payment": "Pagos",
      "action": "Acción",
      "manage": "Abrir",
      "empty": "No hay reservas en esta selección.",
      "loading": "Cargando reservas…",
      "loadError": "No se pueden cargar las reservas. Reintenta.",
      "nextArrival": "Próxima llegada confirmada",
      "noArrival": "No hay próximas llegadas confirmadas.",
      "paymentsLink": "Cuenta Stripe",
      "propertyLink": "Ficha del alojamiento",
      "pending": "Pendiente",
      "confirmed": "Confirmada",
      "cancelled": "Cancelada",
      "completed": "Finalizada",
      "rejected": "Rechazada",
      "cancellationRequested": "Cancelación solicitada",
      "refundPending": "Reembolsos por revisar",
      "refundFollowup": "Ver reembolsos",
      "paymentDue": "Incompleto",
      "refundCompleted": "Reembolsado totalmente",
      "paymentsReady": "Pasos necesarios completados",
      "approvalNote": "Las reservas de clientes esperan tu aprobación tras el anticipo y la garantía.",
      "attentionHint": "Solicitudes, pagos incompletos y cancelaciones por revisar."
    },
    "it": {
      "eyebrow": "Area proprietario",
      "title": "Gestione alloggio",
      "intro": "Segui soggiorni, approva richieste e gestisci pagamenti.",
      "newBooking": "Crea prenotazione per un cliente",
      "allBookings": "Gestisci prenotazioni",
      "refresh": "Aggiorna",
      "upcoming": "Prenotazioni in programma",
      "approvals": "Richieste da approvare",
      "payments": "Pagamenti o garanzie da verificare",
      "cancellations": "Annullamenti da gestire",
      "bookingList": "Prenotazioni",
      "attention": "Da gestire",
      "all": "Tutte",
      "search": "Cerca cliente o riferimento",
      "guest": "Cliente",
      "stay": "Periodo prenotato",
      "status": "Stato",
      "payment": "Pagamenti",
      "action": "Azione",
      "manage": "Apri",
      "empty": "Nessuna prenotazione nella selezione.",
      "loading": "Caricamento prenotazioni…",
      "loadError": "Impossibile caricare le prenotazioni. Riprova.",
      "nextArrival": "Prossimo arrivo confermato",
      "noArrival": "Nessun prossimo arrivo confermato.",
      "paymentsLink": "Account Stripe",
      "propertyLink": "Dettagli alloggio",
      "pending": "In attesa",
      "confirmed": "Confermata",
      "cancelled": "Annullata",
      "completed": "Completata",
      "rejected": "Rifiutata",
      "cancellationRequested": "Annullamento richiesto",
      "refundPending": "Rimborsi da verificare",
      "refundFollowup": "Vedi rimborsi",
      "paymentDue": "Incompleto",
      "refundCompleted": "Interamente rimborsato",
      "paymentsReady": "Passaggi richiesti completati",
      "approvalNote": "Le prenotazioni clienti attendono la tua approvazione dopo acconto e garanzia.",
      "attentionHint": "Richieste, pagamenti incompleti e annullamenti da seguire."
    },
    "de": {
      "eyebrow": "Eigentümerbereich",
      "title": "Unterkunftsverwaltung",
      "intro": "Aufenthalte verfolgen, Anfragen genehmigen und Zahlungen verwalten.",
      "newBooking": "Buchung für einen Kunden erstellen",
      "allBookings": "Buchungen verwalten",
      "refresh": "Aktualisieren",
      "upcoming": "Bevorstehende Buchungen",
      "approvals": "Zu genehmigende Anfragen",
      "payments": "Zahlungen oder Kautionen prüfen",
      "cancellations": "Zu bearbeitende Stornierungen",
      "bookingList": "Buchungen",
      "attention": "Handlungsbedarf",
      "all": "Alle",
      "search": "Kunde oder Referenz suchen",
      "guest": "Kunde",
      "stay": "Buchungszeitraum",
      "status": "Status",
      "payment": "Zahlungen",
      "action": "Aktion",
      "manage": "Öffnen",
      "empty": "Keine Buchungen in dieser Auswahl.",
      "loading": "Buchungen werden geladen…",
      "loadError": "Buchungen können nicht geladen werden. Erneut versuchen.",
      "nextArrival": "Nächste bestätigte Ankunft",
      "noArrival": "Keine bevorstehende bestätigte Ankunft.",
      "paymentsLink": "Stripe-Konto",
      "propertyLink": "Unterkunftsdetails",
      "pending": "Ausstehend",
      "confirmed": "Bestätigt",
      "cancelled": "Storniert",
      "completed": "Abgeschlossen",
      "rejected": "Abgelehnt",
      "cancellationRequested": "Stornierung angefragt",
      "refundPending": "Erstattungen prüfen",
      "refundFollowup": "Erstattungen ansehen",
      "paymentDue": "Unvollständig",
      "refundCompleted": "Vollständig erstattet",
      "paymentsReady": "Erforderliche Schritte abgeschlossen",
      "approvalNote": "Kundenbuchungen benötigen nach Anzahlung und Kaution Ihre Freigabe.",
      "attentionHint": "Anfragen, unvollständige Zahlungen und Stornierungen zur Nachverfolgung."
    },
    "nl": {
      "eyebrow": "Eigenaarsomgeving",
      "title": "Accommodatie beheren",
      "intro": "Volg verblijven, keur aanvragen goed en beheer betalingen.",
      "newBooking": "Boeking voor een klant maken",
      "allBookings": "Boekingen beheren",
      "refresh": "Vernieuwen",
      "upcoming": "Aankomende boekingen",
      "approvals": "Goed te keuren aanvragen",
      "payments": "Betalingen of borg te controleren",
      "cancellations": "Te behandelen annuleringen",
      "bookingList": "Boekingen",
      "attention": "Aandacht nodig",
      "all": "Alle",
      "search": "Zoek klant of referentie",
      "guest": "Klant",
      "stay": "Boekingsperiode",
      "status": "Status",
      "payment": "Betalingen",
      "action": "Actie",
      "manage": "Openen",
      "empty": "Geen boekingen in deze selectie.",
      "loading": "Boekingen laden…",
      "loadError": "Boekingen kunnen niet worden geladen. Probeer opnieuw.",
      "nextArrival": "Volgende bevestigde aankomst",
      "noArrival": "Geen aankomende bevestigde aankomst.",
      "paymentsLink": "Stripe-account",
      "propertyLink": "Accommodatiedetails",
      "pending": "In afwachting",
      "confirmed": "Bevestigd",
      "cancelled": "Geannuleerd",
      "completed": "Voltooid",
      "rejected": "Afgewezen",
      "cancellationRequested": "Annulering aangevraagd",
      "refundPending": "Terugbetalingen te controleren",
      "refundFollowup": "Terugbetalingen bekijken",
      "paymentDue": "Onvolledig",
      "refundCompleted": "Volledig terugbetaald",
      "paymentsReady": "Vereiste stappen voltooid",
      "approvalNote": "Klantboekingen vereisen na aanbetaling en borg je goedkeuring.",
      "attentionHint": "Aanvragen, onvolledige betalingen en annuleringen om op te volgen."
    },
    "ru": {
      "eyebrow": "Кабинет владельца",
      "title": "Управление жильём",
      "intro": "Отслеживайте проживания, одобряйте запросы и управляйте платежами.",
      "newBooking": "Создать бронирование для клиента",
      "allBookings": "Управлять бронированиями",
      "refresh": "Обновить",
      "upcoming": "Предстоящие бронирования",
      "approvals": "Запросы для одобрения",
      "payments": "Платежи или обеспечение для проверки",
      "cancellations": "Отмены для обработки",
      "bookingList": "Бронирования",
      "attention": "Требует внимания",
      "all": "Все",
      "search": "Поиск по клиенту или номеру",
      "guest": "Клиент",
      "stay": "Период бронирования",
      "status": "Статус",
      "payment": "Платежи",
      "action": "Действие",
      "manage": "Открыть",
      "empty": "В этой выборке нет бронирований.",
      "loading": "Загрузка бронирований…",
      "loadError": "Не удалось загрузить бронирования. Повторите попытку.",
      "nextArrival": "Следующее подтверждённое прибытие",
      "noArrival": "Нет предстоящих подтверждённых прибытий.",
      "paymentsLink": "Счёт Stripe",
      "propertyLink": "Сведения о жилье",
      "pending": "Ожидает",
      "confirmed": "Подтверждено",
      "cancelled": "Отменено",
      "completed": "Завершено",
      "rejected": "Отклонено",
      "cancellationRequested": "Запрошена отмена",
      "refundPending": "Возвраты для проверки",
      "refundFollowup": "Посмотреть возвраты",
      "paymentDue": "Не заполнено",
      "refundCompleted": "Полностью возвращено",
      "paymentsReady": "Обязательные шаги завершены",
      "approvalNote": "Бронирования клиентов требуют вашего одобрения после предоплаты и обеспечения.",
      "attentionHint": "Запросы, неполные платежи и отмены для проверки."
    }
  },
  "parking": {
    "fr": {
      "eyebrow": "Espace propriétaire",
      "title": "Gestion du parking",
      "intro": "Suivez les réservations, validez les demandes et gérez les règlements.",
      "newBooking": "Créer une réservation pour un client",
      "allBookings": "Gérer les réservations",
      "refresh": "Actualiser",
      "upcoming": "Stationnements à venir",
      "approvals": "Demandes à approuver",
      "payments": "Règlements ou garanties à suivre",
      "cancellations": "Annulations à traiter",
      "bookingList": "Réservations",
      "attention": "À traiter",
      "all": "Toutes",
      "search": "Rechercher un client ou une référence",
      "guest": "Client",
      "stay": "Stationnement",
      "status": "Statut",
      "payment": "Règlements",
      "action": "Action",
      "manage": "Ouvrir",
      "empty": "Aucune réservation dans cette sélection.",
      "loading": "Chargement des réservations…",
      "loadError": "Impossible de charger les réservations. Réessayez.",
      "nextArrival": "Prochaine arrivée confirmée",
      "noArrival": "Aucune arrivée confirmée à venir.",
      "paymentsLink": "Compte Stripe",
      "propertyLink": "Fiche du parking",
      "pending": "En attente",
      "confirmed": "Confirmée",
      "cancelled": "Annulée",
      "completed": "Terminée",
      "rejected": "Refusée",
      "cancellationRequested": "Annulation demandée",
      "refundPending": "Remboursements à suivre",
      "refundFollowup": "Voir les remboursements",
      "paymentDue": "À compléter",
      "refundCompleted": "Remboursé intégralement",
      "paymentsReady": "Étapes requises validées",
      "approvalNote": "Les réservations client restent en attente de votre accord après acompte et garantie.",
      "attentionHint": "Demandes, règlements incomplets et annulations nécessitant un suivi."
    },
    "en": {
      "eyebrow": "Owner workspace",
      "title": "Parking management",
      "intro": "Track parking bookings, approve requests and manage payments.",
      "newBooking": "Create a booking for a customer",
      "allBookings": "Manage bookings",
      "refresh": "Refresh",
      "upcoming": "Upcoming parking bookings",
      "approvals": "Awaiting approval",
      "payments": "Payment or warranty follow-up",
      "cancellations": "Cancellation follow-up",
      "bookingList": "Bookings",
      "attention": "Needs attention",
      "all": "All",
      "search": "Search customer or reference",
      "guest": "Customer",
      "stay": "Parking period",
      "status": "Status",
      "payment": "Payments",
      "action": "Action",
      "manage": "Open",
      "empty": "No bookings in this selection.",
      "loading": "Loading bookings…",
      "loadError": "Unable to load bookings. Please retry.",
      "nextArrival": "Next confirmed arrival",
      "noArrival": "No upcoming confirmed arrival.",
      "paymentsLink": "Stripe account",
      "propertyLink": "Parking details",
      "pending": "Pending",
      "confirmed": "Confirmed",
      "cancelled": "Cancelled",
      "completed": "Completed",
      "rejected": "Rejected",
      "cancellationRequested": "Cancellation requested",
      "refundPending": "Refund follow-up",
      "refundFollowup": "View refunds",
      "paymentDue": "Incomplete",
      "refundCompleted": "Fully refunded",
      "paymentsReady": "Required steps completed",
      "approvalNote": "Customer bookings require your approval after deposit and warranty.",
      "attentionHint": "Requests, incomplete payments and cancellations to follow up."
    },
    "es": {
      "eyebrow": "Espacio propietario",
      "title": "Gestión del aparcamiento",
      "intro": "Sigue las reservas de aparcamiento, aprueba solicitudes y gestiona pagos.",
      "newBooking": "Crear reserva para un cliente",
      "allBookings": "Gestionar reservas",
      "refresh": "Actualizar",
      "upcoming": "Próximas reservas",
      "approvals": "Solicitudes por aprobar",
      "payments": "Pagos o garantías por revisar",
      "cancellations": "Cancelaciones por gestionar",
      "bookingList": "Reservas",
      "attention": "Por revisar",
      "all": "Todas",
      "search": "Buscar cliente o referencia",
      "guest": "Cliente",
      "stay": "Período reservado",
      "status": "Estado",
      "payment": "Pagos",
      "action": "Acción",
      "manage": "Abrir",
      "empty": "No hay reservas en esta selección.",
      "loading": "Cargando reservas…",
      "loadError": "No se pueden cargar las reservas. Reintenta.",
      "nextArrival": "Próxima llegada confirmada",
      "noArrival": "No hay próximas llegadas confirmadas.",
      "paymentsLink": "Cuenta Stripe",
      "propertyLink": "Ficha del aparcamiento",
      "pending": "Pendiente",
      "confirmed": "Confirmada",
      "cancelled": "Cancelada",
      "completed": "Finalizada",
      "rejected": "Rechazada",
      "cancellationRequested": "Cancelación solicitada",
      "refundPending": "Reembolsos por revisar",
      "refundFollowup": "Ver reembolsos",
      "paymentDue": "Incompleto",
      "refundCompleted": "Reembolsado totalmente",
      "paymentsReady": "Pasos necesarios completados",
      "approvalNote": "Las reservas de clientes esperan tu aprobación tras el anticipo y la garantía.",
      "attentionHint": "Solicitudes, pagos incompletos y cancelaciones por revisar."
    },
    "it": {
      "eyebrow": "Area proprietario",
      "title": "Gestione parcheggio",
      "intro": "Segui prenotazioni parcheggio, approva richieste e gestisci pagamenti.",
      "newBooking": "Crea prenotazione per un cliente",
      "allBookings": "Gestisci prenotazioni",
      "refresh": "Aggiorna",
      "upcoming": "Prenotazioni in programma",
      "approvals": "Richieste da approvare",
      "payments": "Pagamenti o garanzie da verificare",
      "cancellations": "Annullamenti da gestire",
      "bookingList": "Prenotazioni",
      "attention": "Da gestire",
      "all": "Tutte",
      "search": "Cerca cliente o riferimento",
      "guest": "Cliente",
      "stay": "Periodo prenotato",
      "status": "Stato",
      "payment": "Pagamenti",
      "action": "Azione",
      "manage": "Apri",
      "empty": "Nessuna prenotazione nella selezione.",
      "loading": "Caricamento prenotazioni…",
      "loadError": "Impossibile caricare le prenotazioni. Riprova.",
      "nextArrival": "Prossimo arrivo confermato",
      "noArrival": "Nessun prossimo arrivo confermato.",
      "paymentsLink": "Account Stripe",
      "propertyLink": "Dettagli parcheggio",
      "pending": "In attesa",
      "confirmed": "Confermata",
      "cancelled": "Annullata",
      "completed": "Completata",
      "rejected": "Rifiutata",
      "cancellationRequested": "Annullamento richiesto",
      "refundPending": "Rimborsi da verificare",
      "refundFollowup": "Vedi rimborsi",
      "paymentDue": "Incompleto",
      "refundCompleted": "Interamente rimborsato",
      "paymentsReady": "Passaggi richiesti completati",
      "approvalNote": "Le prenotazioni clienti attendono la tua approvazione dopo acconto e garanzia.",
      "attentionHint": "Richieste, pagamenti incompleti e annullamenti da seguire."
    },
    "de": {
      "eyebrow": "Eigentümerbereich",
      "title": "Parkplatzverwaltung",
      "intro": "Parkplatzbuchungen verfolgen, Anfragen genehmigen und Zahlungen verwalten.",
      "newBooking": "Buchung für einen Kunden erstellen",
      "allBookings": "Buchungen verwalten",
      "refresh": "Aktualisieren",
      "upcoming": "Bevorstehende Buchungen",
      "approvals": "Zu genehmigende Anfragen",
      "payments": "Zahlungen oder Kautionen prüfen",
      "cancellations": "Zu bearbeitende Stornierungen",
      "bookingList": "Buchungen",
      "attention": "Handlungsbedarf",
      "all": "Alle",
      "search": "Kunde oder Referenz suchen",
      "guest": "Kunde",
      "stay": "Buchungszeitraum",
      "status": "Status",
      "payment": "Zahlungen",
      "action": "Aktion",
      "manage": "Öffnen",
      "empty": "Keine Buchungen in dieser Auswahl.",
      "loading": "Buchungen werden geladen…",
      "loadError": "Buchungen können nicht geladen werden. Erneut versuchen.",
      "nextArrival": "Nächste bestätigte Ankunft",
      "noArrival": "Keine bevorstehende bestätigte Ankunft.",
      "paymentsLink": "Stripe-Konto",
      "propertyLink": "Parkplatzdetails",
      "pending": "Ausstehend",
      "confirmed": "Bestätigt",
      "cancelled": "Storniert",
      "completed": "Abgeschlossen",
      "rejected": "Abgelehnt",
      "cancellationRequested": "Stornierung angefragt",
      "refundPending": "Erstattungen prüfen",
      "refundFollowup": "Erstattungen ansehen",
      "paymentDue": "Unvollständig",
      "refundCompleted": "Vollständig erstattet",
      "paymentsReady": "Erforderliche Schritte abgeschlossen",
      "approvalNote": "Kundenbuchungen benötigen nach Anzahlung und Kaution Ihre Freigabe.",
      "attentionHint": "Anfragen, unvollständige Zahlungen und Stornierungen zur Nachverfolgung."
    },
    "nl": {
      "eyebrow": "Eigenaarsomgeving",
      "title": "Parkeerplaats beheren",
      "intro": "Volg parkeerboekingen, keur aanvragen goed en beheer betalingen.",
      "newBooking": "Boeking voor een klant maken",
      "allBookings": "Boekingen beheren",
      "refresh": "Vernieuwen",
      "upcoming": "Aankomende boekingen",
      "approvals": "Goed te keuren aanvragen",
      "payments": "Betalingen of borg te controleren",
      "cancellations": "Te behandelen annuleringen",
      "bookingList": "Boekingen",
      "attention": "Aandacht nodig",
      "all": "Alle",
      "search": "Zoek klant of referentie",
      "guest": "Klant",
      "stay": "Boekingsperiode",
      "status": "Status",
      "payment": "Betalingen",
      "action": "Actie",
      "manage": "Openen",
      "empty": "Geen boekingen in deze selectie.",
      "loading": "Boekingen laden…",
      "loadError": "Boekingen kunnen niet worden geladen. Probeer opnieuw.",
      "nextArrival": "Volgende bevestigde aankomst",
      "noArrival": "Geen aankomende bevestigde aankomst.",
      "paymentsLink": "Stripe-account",
      "propertyLink": "Parkeerplaatsdetails",
      "pending": "In afwachting",
      "confirmed": "Bevestigd",
      "cancelled": "Geannuleerd",
      "completed": "Voltooid",
      "rejected": "Afgewezen",
      "cancellationRequested": "Annulering aangevraagd",
      "refundPending": "Terugbetalingen te controleren",
      "refundFollowup": "Terugbetalingen bekijken",
      "paymentDue": "Onvolledig",
      "refundCompleted": "Volledig terugbetaald",
      "paymentsReady": "Vereiste stappen voltooid",
      "approvalNote": "Klantboekingen vereisen na aanbetaling en borg je goedkeuring.",
      "attentionHint": "Aanvragen, onvolledige betalingen en annuleringen om op te volgen."
    },
    "ru": {
      "eyebrow": "Кабинет владельца",
      "title": "Управление парковкой",
      "intro": "Отслеживайте бронирования парковки, одобряйте запросы и управляйте платежами.",
      "newBooking": "Создать бронирование для клиента",
      "allBookings": "Управлять бронированиями",
      "refresh": "Обновить",
      "upcoming": "Предстоящие бронирования",
      "approvals": "Запросы для одобрения",
      "payments": "Платежи или обеспечение для проверки",
      "cancellations": "Отмены для обработки",
      "bookingList": "Бронирования",
      "attention": "Требует внимания",
      "all": "Все",
      "search": "Поиск по клиенту или номеру",
      "guest": "Клиент",
      "stay": "Период бронирования",
      "status": "Статус",
      "payment": "Платежи",
      "action": "Действие",
      "manage": "Открыть",
      "empty": "В этой выборке нет бронирований.",
      "loading": "Загрузка бронирований…",
      "loadError": "Не удалось загрузить бронирования. Повторите попытку.",
      "nextArrival": "Следующее подтверждённое прибытие",
      "noArrival": "Нет предстоящих подтверждённых прибытий.",
      "paymentsLink": "Счёт Stripe",
      "propertyLink": "Сведения о парковке",
      "pending": "Ожидает",
      "confirmed": "Подтверждено",
      "cancelled": "Отменено",
      "completed": "Завершено",
      "rejected": "Отклонено",
      "cancellationRequested": "Запрошена отмена",
      "refundPending": "Возвраты для проверки",
      "refundFollowup": "Посмотреть возвраты",
      "paymentDue": "Не заполнено",
      "refundCompleted": "Полностью возвращено",
      "paymentsReady": "Обязательные шаги завершены",
      "approvalNote": "Бронирования клиентов требуют вашего одобрения после предоплаты и обеспечения.",
      "attentionHint": "Запросы, неполные платежи и отмены для проверки."
    }
  }
};

/***/ }),

/***/ 42293:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/asset-gallery/asset-gallery.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetGalleryComponent: () => (/* binding */ AssetGalleryComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _asset_gallery_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asset-gallery.component.html?ngResource */ 28159);
/* harmony import */ var _asset_gallery_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asset-gallery.component.scss?ngResource */ 11665);
/* harmony import */ var _asset_gallery_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_asset_gallery_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);




let AssetGalleryComponent = class AssetGalleryComponent {
  images = [];
  title = '';
  selectedIndex = 0;
  lightboxOpen = false;
  touchStartX = null;
  get selected() {
    return this.images?.[this.selectedIndex] || '';
  }
  ngOnChanges() {
    if (!this.images?.length) {
      this.selectedIndex = 0;
      this.closeLightbox();
      return;
    }
    if (this.selectedIndex >= this.images.length) this.selectedIndex = 0;
  }
  selectIndex(index) {
    if (!this.images?.length) return;
    this.selectedIndex = Math.max(0, Math.min(index, this.images.length - 1));
  }
  previous(event) {
    event?.stopPropagation();
    if (!this.images?.length) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }
  next(event) {
    event?.stopPropagation();
    if (!this.images?.length) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }
  openLightbox() {
    if (!this.selected) return;
    this.lightboxOpen = true;
    document.body.classList.add('asset-lightbox-open');
  }
  closeLightbox(event) {
    event?.stopPropagation();
    this.lightboxOpen = false;
    document.body.classList.remove('asset-lightbox-open');
  }
  lightboxBackdropClick(event) {
    if (event.target === event.currentTarget) this.closeLightbox();
  }
  onTouchStart(event) {
    this.touchStartX = event.changedTouches?.[0]?.clientX ?? null;
  }
  onTouchEnd(event) {
    if (this.touchStartX === null) return;
    const endX = event.changedTouches?.[0]?.clientX ?? this.touchStartX;
    const delta = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < 45) return;
    delta < 0 ? this.next() : this.previous();
  }
  onArrowLeft(event) {
    if (this.images?.length > 1) {
      event.preventDefault();
      this.previous();
    }
  }
  onArrowRight(event) {
    if (this.images?.length > 1) {
      event.preventDefault();
      this.next();
    }
  }
  onEscape(event) {
    if (this.lightboxOpen) {
      event.preventDefault();
      this.closeLightbox();
    }
  }
  static propDecorators = {
    images: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    title: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    onArrowLeft: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['document:keydown.arrowleft', ['$event']]
    }],
    onArrowRight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['document:keydown.arrowright', ['$event']]
    }],
    onEscape: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['document:keydown.escape', ['$event']]
    }]
  };
};
AssetGalleryComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.Component)({
  selector: 'app-asset-gallery',
  template: _asset_gallery_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__,
  standalone: false,
  styles: [(_asset_gallery_component_scss_ngResource__WEBPACK_IMPORTED_MODULE_1___default())]
})], AssetGalleryComponent);


/***/ }),

/***/ 93887:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedModule: () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 27824);
/* harmony import */ var _home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../home/site-text.pipe */ 99343);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 35135);
/* harmony import */ var _components_asset_gallery_asset_gallery_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/asset-gallery/asset-gallery.component */ 42293);





let SharedModule = class SharedModule {};
SharedModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
  declarations: [_components_asset_gallery_asset_gallery_component__WEBPACK_IMPORTED_MODULE_1__.AssetGalleryComponent],
  imports: [_home_site_text_pipe__WEBPACK_IMPORTED_MODULE_0__.SiteTextPipe, _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule],
  exports: [_components_asset_gallery_asset_gallery_component__WEBPACK_IMPORTED_MODULE_1__.AssetGalleryComponent]
})], SharedModule);


/***/ }),

/***/ 94700:
/*!*********************************************!*\
  !*** ./src/app/services/asset-page-i18n.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSET_PAGE_I18N: () => (/* binding */ ASSET_PAGE_I18N)
/* harmony export */ });
const ASSET_PAGE_I18N = {
  "fr": {
    "from": "À partir de",
    "day": "jour",
    "night": "nuit",
    "book": "Réserver",
    "details": "Voir les détails",
    "property": "Le logement",
    "parking": "Le parking",
    "pool": "La piscine",
    "car": "La voiture",
    "bedrooms": "chambres",
    "beds": "lits",
    "bathrooms": "salles de bain",
    "guests": "voyageurs",
    "people": "personnes",
    "heated": "Chauffée",
    "unheated": "Non chauffée",
    "indoor": "Intérieure",
    "outdoor": "Extérieure",
    "secured": "Sécurisé",
    "standard": "Accès standard",
    "cctv": "Vidéosurveillance",
    "noCctv": "Sans vidéosurveillance",
    "charging": "Recharge électrique",
    "noCharging": "Sans recharge",
    "seats": "places",
    "automatic": "Transmission automatique",
    "electric": "Motorisation électrique",
    "range": "Autonomie",
    "deposit": "Caution",
    "about": "À propos de cette voiture",
    "rental": "Votre location",
    "features": "Caractéristiques",
    "rentalText": "Choisissez vos dates, heures et lieux de prise en charge et de restitution.",
    "photo": "Photo bientôt disponible",
    "loading": "Chargement…",
    "notFound": "Ressource introuvable."
  },
  "en": {
    "from": "From",
    "day": "day",
    "night": "night",
    "book": "Book",
    "details": "View details",
    "property": "The property",
    "parking": "The parking space",
    "pool": "The pool",
    "car": "The car",
    "bedrooms": "bedrooms",
    "beds": "beds",
    "bathrooms": "bathrooms",
    "guests": "guests",
    "people": "people",
    "heated": "Heated",
    "unheated": "Not heated",
    "indoor": "Indoor",
    "outdoor": "Outdoor",
    "secured": "Secure",
    "standard": "Standard access",
    "cctv": "CCTV",
    "noCctv": "No CCTV",
    "charging": "EV charging",
    "noCharging": "No charging",
    "seats": "seats",
    "automatic": "Automatic transmission",
    "electric": "Electric",
    "range": "Range",
    "deposit": "Deposit",
    "about": "About this car",
    "rental": "Your rental",
    "features": "Features",
    "rentalText": "Choose your dates, times, pickup and return locations.",
    "photo": "Photo coming soon",
    "loading": "Loading…",
    "notFound": "Asset not found."
  },
  "es": {
    "from": "Desde",
    "day": "día",
    "night": "noche",
    "book": "Reservar",
    "details": "Ver detalles",
    "property": "El alojamiento",
    "parking": "El aparcamiento",
    "pool": "La piscina",
    "car": "El coche",
    "bedrooms": "habitaciones",
    "beds": "camas",
    "bathrooms": "baños",
    "guests": "huéspedes",
    "people": "personas",
    "heated": "Climatizada",
    "unheated": "Sin climatizar",
    "indoor": "Interior",
    "outdoor": "Exterior",
    "secured": "Seguro",
    "standard": "Acceso estándar",
    "cctv": "Videovigilancia",
    "noCctv": "Sin videovigilancia",
    "charging": "Carga eléctrica",
    "noCharging": "Sin carga",
    "seats": "plazas",
    "automatic": "Cambio automático",
    "electric": "Eléctrico",
    "range": "Autonomía",
    "deposit": "Fianza",
    "about": "Sobre este coche",
    "rental": "Tu alquiler",
    "features": "Características",
    "rentalText": "Elige fechas, horarios y lugares de recogida y devolución.",
    "photo": "Foto próximamente",
    "loading": "Cargando…",
    "notFound": "Recurso no encontrado."
  },
  "de": {
    "from": "Ab",
    "day": "Tag",
    "night": "Nacht",
    "book": "Buchen",
    "details": "Details ansehen",
    "property": "Die Unterkunft",
    "parking": "Der Parkplatz",
    "pool": "Der Pool",
    "car": "Das Auto",
    "bedrooms": "Schlafzimmer",
    "beds": "Betten",
    "bathrooms": "Badezimmer",
    "guests": "Gäste",
    "people": "Personen",
    "heated": "Beheizt",
    "unheated": "Unbeheizt",
    "indoor": "Innenpool",
    "outdoor": "Außenpool",
    "secured": "Gesichert",
    "standard": "Standardzugang",
    "cctv": "Videoüberwachung",
    "noCctv": "Keine Videoüberwachung",
    "charging": "E-Auto-Ladestation",
    "noCharging": "Keine Ladestation",
    "seats": "Sitzplätze",
    "automatic": "Automatikgetriebe",
    "electric": "Elektroantrieb",
    "range": "Reichweite",
    "deposit": "Kaution",
    "about": "Über dieses Auto",
    "rental": "Ihre Miete",
    "features": "Ausstattung",
    "rentalText": "Wählen Sie Datum, Uhrzeit sowie Abhol- und Rückgabeort.",
    "photo": "Foto folgt",
    "loading": "Wird geladen…",
    "notFound": "Objekt nicht gefunden."
  },
  "it": {
    "from": "A partire da",
    "day": "giorno",
    "night": "notte",
    "book": "Prenota",
    "details": "Vedi dettagli",
    "property": "L’alloggio",
    "parking": "Il parcheggio",
    "pool": "La piscina",
    "car": "L’auto",
    "bedrooms": "camere",
    "beds": "letti",
    "bathrooms": "bagni",
    "guests": "ospiti",
    "people": "persone",
    "heated": "Riscaldata",
    "unheated": "Non riscaldata",
    "indoor": "Interna",
    "outdoor": "Esterna",
    "secured": "Sicuro",
    "standard": "Accesso standard",
    "cctv": "Videosorveglianza",
    "noCctv": "Senza videosorveglianza",
    "charging": "Ricarica elettrica",
    "noCharging": "Senza ricarica",
    "seats": "posti",
    "automatic": "Cambio automatico",
    "electric": "Elettrica",
    "range": "Autonomia",
    "deposit": "Cauzione",
    "about": "Informazioni sull’auto",
    "rental": "Il tuo noleggio",
    "features": "Caratteristiche",
    "rentalText": "Scegli date, orari e luoghi di ritiro e riconsegna.",
    "photo": "Foto in arrivo",
    "loading": "Caricamento…",
    "notFound": "Risorsa non trovata."
  },
  "nl": {
    "from": "Vanaf",
    "day": "dag",
    "night": "nacht",
    "book": "Boeken",
    "details": "Details bekijken",
    "property": "De accommodatie",
    "parking": "De parkeerplaats",
    "pool": "Het zwembad",
    "car": "De auto",
    "bedrooms": "slaapkamers",
    "beds": "bedden",
    "bathrooms": "badkamers",
    "guests": "gasten",
    "people": "personen",
    "heated": "Verwarmd",
    "unheated": "Onverwarmd",
    "indoor": "Binnen",
    "outdoor": "Buiten",
    "secured": "Beveiligd",
    "standard": "Standaard toegang",
    "cctv": "Camerabewaking",
    "noCctv": "Geen camerabewaking",
    "charging": "Elektrisch laden",
    "noCharging": "Geen laadpunt",
    "seats": "zitplaatsen",
    "automatic": "Automatische transmissie",
    "electric": "Elektrisch",
    "range": "Actieradius",
    "deposit": "Borg",
    "about": "Over deze auto",
    "rental": "Uw huur",
    "features": "Kenmerken",
    "rentalText": "Kies datums, tijden en ophaal- en inleverlocaties.",
    "photo": "Foto volgt",
    "loading": "Laden…",
    "notFound": "Object niet gevonden."
  },
  "ru": {
    "from": "От",
    "day": "день",
    "night": "ночь",
    "book": "Забронировать",
    "details": "Подробнее",
    "property": "Жильё",
    "parking": "Парковка",
    "pool": "Бассейн",
    "car": "Автомобиль",
    "bedrooms": "спальни",
    "beds": "кровати",
    "bathrooms": "ванные комнаты",
    "guests": "гости",
    "people": "человек",
    "heated": "С подогревом",
    "unheated": "Без подогрева",
    "indoor": "В помещении",
    "outdoor": "На улице",
    "secured": "Охраняемая",
    "standard": "Обычный доступ",
    "cctv": "Видеонаблюдение",
    "noCctv": "Без видеонаблюдения",
    "charging": "Зарядка электромобиля",
    "noCharging": "Без зарядки",
    "seats": "мест",
    "automatic": "Автоматическая коробка",
    "electric": "Электромобиль",
    "range": "Запас хода",
    "deposit": "Залог",
    "about": "Об автомобиле",
    "rental": "Ваша аренда",
    "features": "Характеристики",
    "rentalText": "Выберите даты, время и места получения и возврата.",
    "photo": "Фото скоро появится",
    "loading": "Загрузка…",
    "notFound": "Объект не найден."
  }
};

/***/ })

}]);
//# sourceMappingURL=default-src_app_services_asset-admin-i18n_ts-src_app_services_asset-page-i18n_ts-src_app_shar-2b9260.js.map