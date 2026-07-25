import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LanguageService, SiteLanguage } from '../../services/language.service';
import { BoatContextService } from '../../services/boat-context.service';
import { FleetService } from '../fleet.service';
import { StripeConnectService, StripeConnectStatus } from '../stripe-connect.service';

type StripeConnectTexts = Record<string, string>;

const FALLBACK: Record<SiteLanguage, StripeConnectTexts> = {
  fr: { eyebrow: 'Paiements propriétaires', title: 'Stripe Connect', intro: 'Connectez le compte Stripe du propriétaire pour recevoir directement les paiements et verser automatiquement la commission de la plateforme.', owner: 'Propriétaire', boat: 'Bateau', status: 'Statut', connected: 'Connecté', notConnected: 'Non connecté', actionRequired: 'Action requise', operational: 'Opérationnel', charges: 'Paiements', payouts: 'Virements', enabled: 'Activés', disabled: 'Désactivés', mode: 'Mode', live: 'Production', test: 'Test', commission: 'Commission plateforme', connect: 'Connecter Stripe', continue: 'Continuer la configuration', refresh: 'Actualiser', disconnect: 'Déconnecter', disconnectConfirm: 'Déconnecter ce compte Stripe ?', loading: 'Chargement…', error: 'Impossible de charger le statut Stripe.', note: 'Le taux de commission est défini par l’administrateur de la plateforme et enregistré au moment de chaque paiement.' },
  en: { eyebrow: 'Owner payments', title: 'Stripe Connect', intro: 'Connect the owner’s Stripe account to receive booking payments directly and automatically pay the platform commission.', owner: 'Owner', boat: 'Boat', status: 'Status', connected: 'Connected', notConnected: 'Not connected', actionRequired: 'Action required', operational: 'Operational', charges: 'Payments', payouts: 'Payouts', enabled: 'Enabled', disabled: 'Disabled', mode: 'Mode', live: 'Live', test: 'Test', commission: 'Platform commission', connect: 'Connect Stripe', continue: 'Continue setup', refresh: 'Refresh', disconnect: 'Disconnect', disconnectConfirm: 'Disconnect this Stripe account?', loading: 'Loading…', error: 'Unable to load Stripe status.', note: 'The commission rate is defined by the platform administrator and recorded with every payment.' },
  es: { eyebrow: 'Pagos del propietario', title: 'Stripe Connect', intro: 'Conecte la cuenta Stripe del propietario para recibir pagos directamente y abonar automáticamente la comisión de la plataforma.', owner: 'Propietario', boat: 'Barco', status: 'Estado', connected: 'Conectado', notConnected: 'No conectado', actionRequired: 'Acción requerida', operational: 'Operativo', charges: 'Pagos', payouts: 'Transferencias', enabled: 'Activados', disabled: 'Desactivados', mode: 'Modo', live: 'Producción', test: 'Prueba', commission: 'Comisión de plataforma', connect: 'Conectar Stripe', continue: 'Continuar configuración', refresh: 'Actualizar', disconnect: 'Desconectar', disconnectConfirm: '¿Desconectar esta cuenta Stripe?', loading: 'Cargando…', error: 'No se puede cargar el estado de Stripe.', note: 'La comisión la define el administrador de la plataforma y se registra en cada pago.' },
  it: { eyebrow: 'Pagamenti proprietario', title: 'Stripe Connect', intro: 'Collega l’account Stripe del proprietario per ricevere direttamente i pagamenti e versare automaticamente la commissione della piattaforma.', owner: 'Proprietario', boat: 'Barca', status: 'Stato', connected: 'Collegato', notConnected: 'Non collegato', actionRequired: 'Azione richiesta', operational: 'Operativo', charges: 'Pagamenti', payouts: 'Bonifici', enabled: 'Attivati', disabled: 'Disattivati', mode: 'Modalità', live: 'Produzione', test: 'Test', commission: 'Commissione piattaforma', connect: 'Collega Stripe', continue: 'Continua configurazione', refresh: 'Aggiorna', disconnect: 'Disconnetti', disconnectConfirm: 'Disconnettere questo account Stripe?', loading: 'Caricamento…', error: 'Impossibile caricare lo stato Stripe.', note: 'La commissione è definita dall’amministratore della piattaforma e registrata per ogni pagamento.' },
  de: { eyebrow: 'Zahlungen des Eigentümers', title: 'Stripe Connect', intro: 'Verbinden Sie das Stripe-Konto des Eigentümers, um Zahlungen direkt zu empfangen und die Plattformprovision automatisch abzurechnen.', owner: 'Eigentümer', boat: 'Boot', status: 'Status', connected: 'Verbunden', notConnected: 'Nicht verbunden', actionRequired: 'Aktion erforderlich', operational: 'Betriebsbereit', charges: 'Zahlungen', payouts: 'Auszahlungen', enabled: 'Aktiviert', disabled: 'Deaktiviert', mode: 'Modus', live: 'Produktion', test: 'Test', commission: 'Plattformprovision', connect: 'Stripe verbinden', continue: 'Einrichtung fortsetzen', refresh: 'Aktualisieren', disconnect: 'Trennen', disconnectConfirm: 'Dieses Stripe-Konto trennen?', loading: 'Laden…', error: 'Stripe-Status konnte nicht geladen werden.', note: 'Der Provisionssatz wird vom Plattformadministrator festgelegt und bei jeder Zahlung gespeichert.' },
  nl: { eyebrow: 'Betalingen eigenaar', title: 'Stripe Connect', intro: 'Koppel het Stripe-account van de eigenaar om betalingen rechtstreeks te ontvangen en de platformcommissie automatisch af te dragen.', owner: 'Eigenaar', boat: 'Boot', status: 'Status', connected: 'Verbonden', notConnected: 'Niet verbonden', actionRequired: 'Actie vereist', operational: 'Operationeel', charges: 'Betalingen', payouts: 'Uitbetalingen', enabled: 'Ingeschakeld', disabled: 'Uitgeschakeld', mode: 'Modus', live: 'Productie', test: 'Test', commission: 'Platformcommissie', connect: 'Stripe koppelen', continue: 'Configuratie voortzetten', refresh: 'Vernieuwen', disconnect: 'Ontkoppelen', disconnectConfirm: 'Dit Stripe-account ontkoppelen?', loading: 'Laden…', error: 'Stripe-status kan niet worden geladen.', note: 'Het commissietarief wordt bepaald door de platformbeheerder en bij elke betaling vastgelegd.' },
  ru: { eyebrow: 'Платежи владельца', title: 'Stripe Connect', intro: 'Подключите Stripe владельца, чтобы получать платежи напрямую и автоматически перечислять комиссию платформе.', owner: 'Владелец', boat: 'Судно', status: 'Статус', connected: 'Подключено', notConnected: 'Не подключено', actionRequired: 'Требуется действие', operational: 'Работает', charges: 'Платежи', payouts: 'Выплаты', enabled: 'Включены', disabled: 'Отключены', mode: 'Режим', live: 'Рабочий', test: 'Тестовый', commission: 'Комиссия платформы', connect: 'Подключить Stripe', continue: 'Продолжить настройку', refresh: 'Обновить', disconnect: 'Отключить', disconnectConfirm: 'Отключить этот аккаунт Stripe?', loading: 'Загрузка…', error: 'Не удалось загрузить статус Stripe.', note: 'Ставка комиссии задаётся администратором платформы и сохраняется для каждого платежа.' },
};

@Component({
  selector: 'app-admin-stripe-connect',
  templateUrl: './admin-stripe-connect.component.html',
  styleUrls: ['./admin-stripe-connect.component.scss'],
})
export class AdminStripeConnectComponent implements OnInit, OnDestroy {
  language: SiteLanguage = 'fr';
  texts: StripeConnectTexts = FALLBACK.fr;
  ownerId = '';
  boatName = '';
  loading = true;
  disconnecting = false;
  error = '';
  status: StripeConnectStatus | null = null;
  private languageSub?: Subscription;
  private readonly firebaseUrl = 'https://adn-dev-4d05d.firebaseio.com';

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private boatContext: BoatContextService,
    private fleetService: FleetService,
    private stripeConnect: StripeConnectService,
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage || 'fr';
    this.languageSub = this.languageService.language$.subscribe((language) => {
      this.language = language;
      this.loadTexts();
    });
    this.initialize();
  }

  ngOnDestroy(): void {
    this.languageSub?.unsubscribe();
  }

  t(key: string): string {
    return this.texts[key] || FALLBACK[this.language]?.[key] || FALLBACK.en[key] || key;
  }

  async initialize(): Promise<void> {
    try {
      const boat = await this.fleetService.getBoat(this.boatContext.boatId);
      this.ownerId = String(boat.ownerId || boat.boatId || this.boatContext.boatId);
      this.boatName = boat.boatName || boat.boatId;
      await Promise.all([this.loadTexts(), this.refresh()]);
    } catch (error: any) {
      this.error = error?.message || this.t('error');
      this.loading = false;
    }
  }

  async loadTexts(): Promise<void> {
    const fallback = FALLBACK[this.language] || FALLBACK.en;
    try {
      const value = await this.http.get<StripeConnectTexts>(
        `${this.firebaseUrl}/siteContent/${encodeURIComponent(this.boatContext.boatId)}/${this.language}/stripeConnect.json`,
      ).toPromise();
      this.texts = { ...fallback, ...(value || {}) };
    } catch {
      this.texts = fallback;
    }
  }

  async refresh(): Promise<void> {
    if (!this.ownerId) return;
    this.loading = true;
    this.error = '';
    try {
      this.status = await this.stripeConnect.getStatus(this.ownerId);
    } catch (error: any) {
      this.error = error?.error?.error || error?.message || this.t('error');
    } finally {
      this.loading = false;
    }
  }

  connect(): void {
    if (!this.ownerId) return;
    const returnUrl = `${window.location.origin}/admin/stripe-connect`;
    window.location.href = this.stripeConnect.buildAuthorizeUrl(this.ownerId, returnUrl);
  }

  async disconnect(): Promise<void> {
    if (!this.ownerId || !window.confirm(this.t('disconnectConfirm'))) return;
    this.disconnecting = true;
    this.error = '';
    try {
      await this.stripeConnect.disconnect(this.ownerId);
      await this.refresh();
    } catch (error: any) {
      this.error = error?.error?.error || error?.message || this.t('error');
    } finally {
      this.disconnecting = false;
    }
  }

  get operational(): boolean {
    return !!this.status?.connected && !!this.status?.chargesEnabled && !!this.status?.payoutsEnabled;
  }
}
