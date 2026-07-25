import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoatContextService } from '../../services/boat-context.service';
import { LanguageService, SiteLanguage } from '../../services/language.service';
import { AlegriaBoatResource, FleetService } from '../fleet.service';

interface PlatformTexts {
  brand: string;
  eyebrow: string;
  title: string;
  intro: string;
  boatsEyebrow: string;
  boatsTitle: string;
  boatsIntro: string;
  discover: string;
  from: string;
  perDay: string;
  guests: string;
  cabins: string;
  noBoats: string;
  trustTitle: string;
  trustItems: string[];
  ownerTitle: string;
  ownerText: string;
  ownerCta: string;
}

const FALLBACK: Record<SiteLanguage, PlatformTexts> = {
  fr: { brand: 'Boat Marketplace', eyebrow: 'Sorties privées en mer', title: 'Trouvez le bateau qui correspond à votre envie', intro: 'Découvrez des bateaux sélectionnés, leurs sorties, leurs disponibilités et réservez auprès de propriétaires indépendants.', boatsEyebrow: 'Notre flotte', boatsTitle: 'Choisissez votre bateau', boatsIntro: 'Chaque bateau dispose de son propre programme, de ses tarifs et de son calendrier.', discover: 'Découvrir ce bateau', from: 'À partir de', perDay: 'par jour', guests: 'passagers', cabins: 'cabines', noBoats: 'Aucun bateau publié pour le moment.', trustTitle: 'Une réservation simple et transparente', trustItems: ['Bateaux et propriétaires identifiés', 'Prix et disponibilités propres à chaque bateau', 'Paiement sécurisé avec Stripe'], ownerTitle: 'Vous êtes propriétaire ?', ownerText: 'Publiez votre bateau, gérez vos sorties, votre calendrier et recevez directement vos paiements.', ownerCta: 'Rejoindre la plateforme' },
  en: { brand: 'Boat Marketplace', eyebrow: 'Private sea experiences', title: 'Find the right boat for your next escape', intro: 'Explore selected boats, their outings and availability, and book with independent owners.', boatsEyebrow: 'Our fleet', boatsTitle: 'Choose your boat', boatsIntro: 'Each boat has its own experiences, prices and calendar.', discover: 'View this boat', from: 'From', perDay: 'per day', guests: 'guests', cabins: 'cabins', noBoats: 'No boats are currently published.', trustTitle: 'Simple and transparent booking', trustItems: ['Verified boats and owners', 'Boat-specific prices and availability', 'Secure Stripe payments'], ownerTitle: 'Are you a boat owner?', ownerText: 'Publish your boat, manage outings and availability, and receive payments directly.', ownerCta: 'Join the platform' },
  es: { brand: 'Boat Marketplace', eyebrow: 'Experiencias privadas en el mar', title: 'Encuentra el barco ideal para tu próxima escapada', intro: 'Descubre barcos seleccionados, sus salidas y disponibilidad, y reserva con propietarios independientes.', boatsEyebrow: 'Nuestra flota', boatsTitle: 'Elige tu barco', boatsIntro: 'Cada barco tiene sus propias experiencias, precios y calendario.', discover: 'Descubrir este barco', from: 'Desde', perDay: 'por día', guests: 'pasajeros', cabins: 'cabinas', noBoats: 'No hay barcos publicados.', trustTitle: 'Una reserva sencilla y transparente', trustItems: ['Barcos y propietarios verificados', 'Precios y disponibilidad por barco', 'Pagos seguros con Stripe'], ownerTitle: '¿Eres propietario?', ownerText: 'Publica tu barco, gestiona salidas y disponibilidad y recibe pagos directamente.', ownerCta: 'Unirse a la plataforma' },
  it: { brand: 'Boat Marketplace', eyebrow: 'Esperienze private in mare', title: 'Trova la barca giusta per la tua prossima fuga', intro: 'Scopri barche selezionate, uscite e disponibilità e prenota con proprietari indipendenti.', boatsEyebrow: 'La nostra flotta', boatsTitle: 'Scegli la tua barca', boatsIntro: 'Ogni barca ha esperienze, prezzi e calendario propri.', discover: 'Scopri questa barca', from: 'Da', perDay: 'al giorno', guests: 'ospiti', cabins: 'cabine', noBoats: 'Nessuna barca pubblicata.', trustTitle: 'Prenotazione semplice e trasparente', trustItems: ['Barche e proprietari verificati', 'Prezzi e disponibilità per barca', 'Pagamenti Stripe sicuri'], ownerTitle: 'Sei proprietario?', ownerText: 'Pubblica la tua barca, gestisci uscite e disponibilità e ricevi direttamente i pagamenti.', ownerCta: 'Unisciti alla piattaforma' },
  de: { brand: 'Boat Marketplace', eyebrow: 'Private Erlebnisse auf See', title: 'Finden Sie das passende Boot für Ihre nächste Auszeit', intro: 'Entdecken Sie ausgewählte Boote, Ausflüge und Verfügbarkeiten und buchen Sie bei unabhängigen Eigentümern.', boatsEyebrow: 'Unsere Flotte', boatsTitle: 'Wählen Sie Ihr Boot', boatsIntro: 'Jedes Boot hat eigene Erlebnisse, Preise und einen Kalender.', discover: 'Boot entdecken', from: 'Ab', perDay: 'pro Tag', guests: 'Gäste', cabins: 'Kabinen', noBoats: 'Derzeit sind keine Boote veröffentlicht.', trustTitle: 'Einfach und transparent buchen', trustItems: ['Geprüfte Boote und Eigentümer', 'Preise und Verfügbarkeit je Boot', 'Sichere Stripe-Zahlungen'], ownerTitle: 'Sie sind Bootseigentümer?', ownerText: 'Veröffentlichen Sie Ihr Boot, verwalten Sie Ausflüge und erhalten Sie Zahlungen direkt.', ownerCta: 'Plattform beitreten' },
  nl: { brand: 'Boat Marketplace', eyebrow: 'Privé-ervaringen op zee', title: 'Vind de juiste boot voor je volgende uitstap', intro: 'Ontdek geselecteerde boten, uitstappen en beschikbaarheid en boek bij onafhankelijke eigenaars.', boatsEyebrow: 'Onze vloot', boatsTitle: 'Kies je boot', boatsIntro: 'Elke boot heeft eigen ervaringen, prijzen en kalender.', discover: 'Ontdek deze boot', from: 'Vanaf', perDay: 'per dag', guests: 'gasten', cabins: 'hutten', noBoats: 'Er zijn momenteel geen boten gepubliceerd.', trustTitle: 'Eenvoudig en transparant boeken', trustItems: ['Geverifieerde boten en eigenaars', 'Prijzen en beschikbaarheid per boot', 'Veilige Stripe-betalingen'], ownerTitle: 'Ben je booteigenaar?', ownerText: 'Publiceer je boot, beheer uitstappen en ontvang betalingen rechtstreeks.', ownerCta: 'Word lid van het platform' },
  ru: { brand: 'Boat Marketplace', eyebrow: 'Частные морские прогулки', title: 'Найдите подходящую яхту для следующего путешествия', intro: 'Выбирайте проверенные суда, прогулки и даты и бронируйте у независимых владельцев.', boatsEyebrow: 'Наш флот', boatsTitle: 'Выберите судно', boatsIntro: 'У каждого судна свои программы, цены и календарь.', discover: 'Посмотреть судно', from: 'От', perDay: 'в день', guests: 'гостей', cabins: 'кают', noBoats: 'Сейчас нет опубликованных судов.', trustTitle: 'Простое и прозрачное бронирование', trustItems: ['Проверенные суда и владельцы', 'Цены и доступность для каждого судна', 'Безопасная оплата Stripe'], ownerTitle: 'Вы владелец судна?', ownerText: 'Опубликуйте судно, управляйте прогулками и получайте платежи напрямую.', ownerCta: 'Присоединиться' },
};

@Component({
  selector: 'app-platform-home',
  templateUrl: './platform-home.component.html',
  styleUrls: ['./platform-home.component.scss'],
})
export class PlatformHomeComponent implements OnInit, OnDestroy {
  language: SiteLanguage = 'fr';
  texts: PlatformTexts = FALLBACK.fr;
  boats: AlegriaBoatResource[] = [];
  loading = true;
  boatsLoadError = false;
  private languageSub?: Subscription;
  private readonly firebaseUrl = 'https://adn-dev-4d05d.firebaseio.com';

  constructor(
    private http: HttpClient,
    private router: Router,
    private boatContext: BoatContextService,
    private languageService: LanguageService,
    private fleetService: FleetService,
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.currentLanguage || 'fr';
    this.languageSub = this.languageService.language$.subscribe((language) => {
      this.language = language;
      this.loadTexts();
    });
    this.load();
  }

  ngOnDestroy(): void { this.languageSub?.unsubscribe(); }

  async load(): Promise<void> {
    this.loading = true;
    this.boatsLoadError = false;
    try {
      await Promise.all([this.loadTexts(), this.loadBoats()]);
    } catch {
      this.boatsLoadError = true;
      this.boats = [this.fleetService.getDefaultBoat()];
    } finally {
      this.loading = false;
    }
  }

  async loadTexts(): Promise<void> {
    const fallback = FALLBACK[this.language] || FALLBACK.en;
    try {
      const value = await this.http.get<Partial<PlatformTexts>>(
        `${this.firebaseUrl}/platformContent/${this.language}.json`
      ).toPromise();
      this.texts = { ...fallback, ...(value || {}) } as PlatformTexts;
    } catch {
      this.texts = fallback;
    }
  }

  async loadBoats(): Promise<void> {
    const boats = await this.fleetService.listBoats();
    this.boats = (boats || []).filter((boat) =>
      boat &&
      boat.active !== false &&
      boat.marketplaceVisible !== false &&
      (boat as any).visible !== false
    );
    if (!this.boats.length) {
      this.boats = [this.fleetService.getDefaultBoat()];
    }
    await Promise.all(this.boats.map(async (boat) => {
      if (boat.startingPrice) return;
      try {
        const pricing: any = await this.http.get(
          `${this.firebaseUrl}/bnPricingModel/${encodeURIComponent(boat.boatId)}.json`
        ).toPromise();
        const candidates = [pricing?.sunset, pricing?.halfDay, pricing?.day]
          .map(Number).filter((value) => Number.isFinite(value) && value > 0);
        boat.startingPrice = candidates.length ? Math.min(...candidates) : undefined;
      } catch {}
    }));
  }

  trackBoat(_index: number, boat: AlegriaBoatResource): string {
    return boat.boatId;
  }

  openBoat(boat: AlegriaBoatResource): void {
    this.boatContext.setBoatId(boat.boatId);
    this.router.navigate(['/boats', boat.boatId]);
  }

  imageFor(boat: AlegriaBoatResource): string {
    return boat.coverImageUrl || boat.gallery?.[0] || boat.imageUrl || 'assets/img/logo-Alegria.png';
  }

  descriptionFor(boat: AlegriaBoatResource): string {
    return boat.shortDescription || `${boat.manufacturer || boat.boatType || ''} ${boat.model || ''}`.trim();
  }

  locationFor(boat: AlegriaBoatResource): string {
    return boat.location || boat.defaultDepartureMarina || '';
  }
}
