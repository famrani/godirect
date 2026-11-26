import {installOwnerStorefront} from '../services/owner-storefront.js';
import {installManagementEntry} from '../services/management-entry.js';
import {installPush} from '../services/portal-push.js';
import {MobileAlerts} from '../services/mobile-alerts.js';
import {installPortalPages} from '../services/portal-sites.js';
import {AuthSessionService} from '../services/auth-session.service.js';
import {listingPublic} from '../services/listing-billing.service.js';
import {MessagingService} from '../services/messaging.service.js';
import {MessagingWebSocket} from '../services/messaging-websocket.js';
import {EmailNotifications} from '../services/email-notifications.js';
import {createContactHandler} from '../services/contact.service.js';
import {LegalAdminService} from '../services/legal-admin.service.js';
import {AssetDocumentsService} from '../services/asset-documents.service.js';
import {LegalAcceptanceService} from '../services/legal-acceptance.service.js';
import {ConciergeService} from '../services/concierge.service.js';
import {SiteContentManagementService} from '../services/site-content-management.service.js';
import {AccountAccessService} from '../services/account-access.service.js';
import { ListingBillingService } from '../services/listing-billing.service.js';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ZodError } from 'zod';
import { AssetsService } from '../services/assets.service.js';
import { BookingsService } from '../services/bookings.service.js';
import { OwnersService } from '../services/owners.service.js';
import { PaymentsService } from '../services/payments.service.js';
import { ReviewsService } from '../services/reviews.service.js';
import { StripeService } from '../services/stripe.service.js';
import { MediaService } from '../services/media.service.js';

export class WebServerComponent {
  private readonly app = express();
  private messaging!:MessagingService;
  private messagingSocket!:MessagingWebSocket;

  constructor(
    private assets: AssetsService,
    private bookings: BookingsService,
    private owners: OwnersService,
    private payments: PaymentsService,
    private reviews: ReviewsService,
    private stripe: StripeService,
    private media: MediaService,
    private billing: ListingBillingService,
    private accounts:AccountAccessService,
    private notifications?:EmailNotifications,
  ) {}

  async initWebServer(): Promise<void> {

    this.app.set('trust proxy', 1);
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-eval'", 'https://cdn.jsdelivr.net', 'https://apis.google.com', 'https://www.gstatic.com', 'https://ailla-poc-default-rtdb.firebaseio.com', 'https://*.firebaseio.com/.lp', 'https://js.stripe.com'],
          scriptSrcElem: ["'self'", 'https://cdn.jsdelivr.net', 'https://apis.google.com', 'https://www.gstatic.com', 'https://ailla-poc-default-rtdb.firebaseio.com', 'https://*.firebaseio.com/.lp', 'https://js.stripe.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: ["'self'", 'https:', 'wss:'],
          frameSrc: ["'self'", 'https:'],
          formAction: ["'self'", 'https://*.godirect.fr'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },
      // Firebase/Google OAuth uses a popup. `same-origin` (Helmet's default
      // COOP policy) severs the opener relationship before Firebase can receive
      // the OAuth result, which surfaces as auth/popup-closed-by-user.
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginEmbedderPolicy: false,
    }));

    const origins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

    this.app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
    this.app.get('/api/asset-domain', this.asyncRoute(this.assets.resolveDomain));

    // Stripe requires the unparsed request body. Keep this BEFORE express.json().
    this.app.post(
      '/api/stripe/webhook',
      express.raw({ type: 'application/json' }),
      this.asyncRoute(this.stripe.webhook),
    );

    this.app.post('/api/billing/webhook',express.raw({type:'application/json'}),this.asyncRoute(this.billing.webhook));

    this.app.post('/api/contact',express.json({limit:'32kb'}),this.asyncRoute(createContactHandler()));
    this.app.use(express.json({ limit: '2mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    installManagementEntry(this.app,this.accounts.store,express.urlencoded({extended:false,limit:'1kb'}));
    installPush(this.app,this.accounts.store,()=>!!this.messaging?.ready);
    installOwnerStorefront(this.app,this.accounts.store);
    installPortalPages(this.app,this.accounts.store);
    this.notifications?.routes(this.app);
    const mobileAlerts=new MobileAlerts(this.accounts.store);mobileAlerts.routes(this.app);

    const authSession=new AuthSessionService(this.accounts.store);
    this.app.post('/api/me/session',this.asyncRoute(authSession.sync));
    const legal=new LegalAcceptanceService(this.accounts.store);
    const legalAdmin=new LegalAdminService(this.accounts.store);
    await legalAdmin.init();
    legalAdmin.setRoutes(this.app);
    this.app.get('/api/public-content',this.asyncRoute(legal.content));
    this.app.get('/api/legal/catalog',this.asyncRoute(legal.catalog));
    this.app.get('/api/me/legal',this.asyncRoute(legal.status));
    this.app.post('/api/me/legal/accept',this.asyncRoute(legal.accept));
    this.app.get('/api/me/legal/receipts/:hash',this.asyncRoute(legal.receipt));
    const assetDocuments=new AssetDocumentsService(this.accounts.store);
    await assetDocuments.init();
    assetDocuments.setRoutes(this.app);
    this.messaging=new MessagingService(this.accounts.store,(type,id,asset)=>listingPublic(this.accounts.store,type,id,asset));await this.messaging.init();this.messaging.routes(this.app);this.messagingSocket=new MessagingWebSocket(this.messaging);
    this.app.use('/api',legal.guard);

    // Backward-compatible private GCS media routes used by the existing Angular frontend/CMS.
    this.media.setRoutes(this.app);
    

    // Subscription billing runs on the GoDirect platform, separate from Connect rentals.
    this.app.get('/api/listing-plans',this.asyncRoute(this.billing.plans));
    const concierge=new ConciergeService(this.accounts.store);
    this.app.get('/api/owner/delegations',this.asyncRoute(concierge.options));
    this.app.put('/api/owner/delegations/:type/:id',this.asyncRoute(concierge.grant));
    this.app.delete('/api/owner/delegations/:type/:id/:conciergeId',this.asyncRoute(concierge.revoke));
    this.app.get('/api/concierge/assets',this.asyncRoute(concierge.assets));
    this.app.get('/api/manage/bookings',this.asyncRoute(concierge.bookings));
    this.app.get('/api/concierge/payments',this.asyncRoute(concierge.payments));
    this.app.get('/api/concierge/customers',this.asyncRoute(concierge.customers));
    this.app.get('/api/owner/customers',this.asyncRoute(this.stripe.customers.list));
    this.app.get('/api/owner/customers/:customerKey',this.asyncRoute(this.stripe.customers.detail));
    this.app.post('/api/owner/bookings/:type/:id/:bookingId/warranty-charges',this.asyncRoute(this.stripe.warranty.charge));
    this.app.post('/api/owner/bookings/:type/:id/:bookingId/warranty-charges/:requestId/reconcile',this.asyncRoute(this.stripe.warranty.reconcile));
    this.app.post('/api/me/bookings/:type/:id/:bookingId/warranty-consent',this.asyncRoute(this.stripe.warranty.consent));
    this.app.get('/api/me/bookings/:type/:id/:bookingId/warranty-charges/:requestId/payment',this.asyncRoute(this.stripe.warranty.authenticate));
    this.app.get('/api/owner/listings',this.asyncRoute(this.billing.list));
    this.app.get('/api/owner/site-settings',this.asyncRoute(this.billing.siteSettings));
    this.app.put('/api/owner/site-settings',this.asyncRoute(this.billing.siteSettings));
    this.app.get('/api/owner/prefixes',this.asyncRoute(this.billing.prefixes));
    this.app.post('/api/owner/listing-import/preview',this.asyncRoute(this.owners.importListing));
    this.app.post('/api/owner/listing-import/photo',this.asyncRoute(this.owners.importPhoto));
    this.app.post('/api/owner/listings',this.asyncRoute(this.billing.create));
    this.app.get('/api/owner/listings/:type/:id/subscription',this.asyncRoute(this.billing.subscription));
    this.app.get('/api/platform/admin/listings/:type/:id/impact',this.asyncRoute(this.billing.adminImpact));
    this.app.get('/api/platform/admin/listings/:type/:id/prefixes',this.asyncRoute(this.billing.adminPrefixes));
    this.app.patch('/api/platform/admin/listings/:type/:id',this.asyncRoute(this.billing.adminEdit));
    this.app.get('/api/owner/listings/:type/:id/impact',this.asyncRoute(this.billing.impact));
    this.app.patch('/api/owner/listings/:type/:id/prefix',this.asyncRoute(this.billing.assignPrefix));
    this.app.patch('/api/owner/listings/:type/:id',this.asyncRoute(this.billing.edit));
    this.app.delete('/api/owner/listings/:type/:id',this.asyncRoute(this.billing.remove));
    this.app.patch('/api/owner/listings/:type/:id/publication',this.asyncRoute(this.billing.publication));
    this.app.post('/api/owner/listings/:type/:id/checkout',this.asyncRoute(this.billing.checkout));
    this.app.post('/api/owner/listings/:type/:id/renewal',this.asyncRoute(this.billing.manage));
    this.app.post('/api/owner/listings/:type/:id/reconcile',this.asyncRoute(this.billing.reconcile));
    this.app.post('/api/owner/listings/:type/:id/portal',this.asyncRoute(this.billing.portal));
    this.app.get('/api/listings/:type/:id/visibility',this.asyncRoute(this.billing.visibility));
    this.app.post('/api/platform/admin/listings/:type/:id/moderation',this.asyncRoute(this.accounts.moderateListing));
    this.app.get('/api/platform/admin/assets/:type/:id',this.asyncRoute(this.accounts.platformAsset));
    this.app.get('/api/platform/admin/overview',this.asyncRoute(this.accounts.platformOverview));
    this.app.get('/api/me/context',this.asyncRoute(this.accounts.context));
    this.app.get('/api/me/roles',this.asyncRoute(this.accounts.accountRoles));
    this.app.get('/api/me/avatar',this.asyncRoute(this.accounts.getAvatar));
    this.app.put('/api/me/avatar',this.asyncRoute(this.accounts.saveAvatar));
    this.app.get('/api/me/profile',this.asyncRoute(this.accounts.getProfile));
    this.app.put('/api/stay-reviews/:type/:id/:bookingId',this.asyncRoute(this.accounts.writeStayReview));
    this.app.get('/api/me/feedbacks',this.asyncRoute(this.accounts.myFeedbacks));
    this.app.get('/api/manage/assets/:type/:id/feedbacks',this.asyncRoute(this.accounts.assetFeedbacks));
    this.app.put('/api/me/profile',this.asyncRoute(this.accounts.saveProfile));
    this.app.get('/api/account-roles',this.asyncRoute(this.accounts.registrationRoles));
    const cms=new SiteContentManagementService(this.accounts.store);
    this.app.get('/api/manage/assets/:type/:id/content',this.asyncRoute(cms.get));
    this.app.patch('/api/manage/assets/:type/:id/content',this.asyncRoute(cms.save));
    this.app.get('/api/ui-content',this.asyncRoute(this.accounts.uiContent));
    // API routes.
    this.app.get('/api/health', (_req, res) =>
      res.json({
        name: 'GoDirect API',
        version: '22.16.27',
        ok: true,
        timestamp: new Date().toISOString(),
      }),
    );

    this.app.get('/api/asset-types', this.asyncRoute(this.assets.assetTypes));
    this.app.get('/api/listing-content/:type/:id',this.asyncRoute(this.assets.listingContent));
    this.app.get('/api/assets', this.asyncRoute(this.assets.list));
    this.app.get('/api/resources/:type', this.asyncRoute(this.assets.listByType));
    this.app.get('/api/resources/:type/:id', this.asyncRoute(this.assets.getByScope));
    this.app.get('/api/resources/:type/:id/outings', (_req,res)=>res.status(410).json({error:'listing_outings_removed'}));
    this.app.get('/api/assets/:id', this.asyncRoute(this.assets.get));
    this.app.get('/api/assets/:assetId/faqs', this.asyncRoute(this.assets.faqs));

    this.app.patch('/api/assets/:type/:id/calendar',this.asyncRoute(this.assets.calendar.edit));
    this.app.get('/api/assets/:type/:id/calendar',this.asyncRoute(this.assets.calendar.get));
    this.app.post('/api/bookings', this.asyncRoute(this.bookings.create));
    this.app.post('/api/car-bookings/quote', this.asyncRoute(this.bookings.carQuote));
    this.app.post('/api/car-bookings', this.asyncRoute(this.bookings.createCar));
    this.app.post('/api/parking-bookings/quote', this.asyncRoute(this.bookings.resourceQuote('parking')));
    this.app.post('/api/parking-bookings', this.asyncRoute(this.bookings.createResource('parking')));
    this.app.post('/api/property-bookings/quote', this.asyncRoute(this.bookings.resourceQuote('property')));
    this.app.post('/api/property-bookings', this.asyncRoute(this.bookings.createResource('property')));
    this.app.post('/api/pool-bookings/quote', this.asyncRoute(this.bookings.resourceQuote('pool')));
    this.app.post('/api/pool-bookings', this.asyncRoute(this.bookings.createResource('pool')));
    this.app.post('/api/boat-bookings/quote', this.asyncRoute(this.bookings.resourceQuote('boat')));
    this.app.post('/api/boat-bookings', this.asyncRoute(this.bookings.createResource('boat')));
    this.app.get('/api/me/rented-assets',this.asyncRoute(this.bookings.rentedAssets));
    this.app.get('/api/me/bookings', this.asyncRoute(this.bookings.customerMyBookings));
    this.app.get('/api/me/bookings/:type/:assetId/:bookingId', this.asyncRoute(this.bookings.customerMyBooking));
    this.app.patch('/api/me/bookings/:type/:assetId/:bookingId', this.asyncRoute(this.bookings.customerBookingPatch));
    this.app.post('/api/me/bookings/:type/:assetId/:bookingId/cancellation-request', this.asyncRoute(this.bookings.customerCancelRequest));
    this.app.get('/api/admin/bookings/:type/:assetId/:bookingId', this.asyncRoute(this.bookings.adminBookingGet));
    this.app.patch('/api/admin/bookings/:type/:assetId/:bookingId', this.asyncRoute(this.bookings.adminBookingPatch));
    this.app.post('/api/admin/bookings/:type/:assetId/:bookingId/cancellation/reconcile', this.asyncRoute(this.bookings.adminCancellationReconcile));
    this.app.delete('/api/admin/bookings/:type/:assetId/:bookingId', this.asyncRoute(this.bookings.adminBookingDelete));
    this.app.get('/api/customers/:customerId/bookings', this.asyncRoute(this.bookings.customerBookings));
    this.app.get('/api/owners/:ownerId/bookings', this.asyncRoute(this.bookings.ownerBookings));

    this.app.get('/api/stripe/connect/test/callback', this.asyncRoute(this.owners.oauthCallback));
    this.app.post('/api/owners/:ownerId/stripe/connect', this.asyncRoute(this.owners.connect));
    this.app.post('/api/owners/:ownerId/stripe/test/provision', this.asyncRoute(this.owners.provisionTest));
    this.app.get('/api/owners/:ownerId/stripe/status', this.asyncRoute(this.owners.status));

    this.app.get('/api/payments/config', this.asyncRoute(this.payments.config));
    this.app.post('/api/payments/checkout', this.asyncRoute(this.payments.checkout));
    this.app.post('/api/reviews', this.asyncRoute(this.reviews.create));
    this.app.get('/api/assets/:assetId/reviews', this.asyncRoute(this.reviews.byAsset));

    // Unknown API routes must remain API 404s and must never fall through to Angular.
    this.app.use('/api', (_req, res) => res.status(404).json({ error: 'api_route_not_found' }));

    // Serve the Angular SPA on the same HTTPS port as the API.
    // The HarborNest/Ionic frontend builds to ./www by default, but we also
    // support common Angular/server deployment layouts and FRONTEND_DIST.
    const configuredFrontend = process.env.FRONTEND_DIST?.trim();
    const frontendCandidates = [
      configuredFrontend,
      './www',
      './public',
      './dist/browser',
      './dist',
    ]
      .filter((candidate): candidate is string => Boolean(candidate))
      .map((candidate) => path.resolve(process.cwd(), candidate));

    const frontendPath = frontendCandidates.find((candidate) =>
      fs.existsSync(path.join(candidate, 'index.html')),
    );

    if (frontendPath) {
      const frontendIndex = path.join(frontendPath, 'index.html');
      console.log(`[WebServer] serving Angular frontend from ${frontendPath}`);
      this.app.get('/godirect-sw.js', (_req: Request, res: Response) => {
        res.set('Cache-Control', 'no-cache').sendFile(path.join(frontendPath, 'assets/pwa/worker.js'));
      });
      this.app.use(express.static(frontendPath, { index: 'index.html' }));

      // SPA fallback: / and every non-API GET route return Angular index.html.
      // This is required for deep links such as /boat/alegria/home and the
      // sample car/property/parking/pool applications.
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
        return res.sendFile(frontendIndex);
      });
    } else {
      const searched = frontendCandidates.join(', ');
      console.warn(`[WebServer] Angular frontend index.html not found. Searched: ${searched}`);

      // Never return Express' misleading "Cannot GET /" for the application root.
      // Give an actionable deployment error while leaving API routes operational.
      this.app.get('/', (_req, res) =>
        res.status(503).json({
          error: 'frontend_not_built',
          message: 'Angular frontend index.html was not found. Run npm run build in the frontend and copy its www directory into the server, or set FRONTEND_DIST to that directory.',
          searched: frontendCandidates,
        }),
      );
    }

    // Error handler must be last.
    this.app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error('[HTTP]', err);
      if (err instanceof ZodError) {
        return res.status(400).json({ error: 'validation_error', issues: err.issues });
      }
      return res.status(Number((err as any)?.status)||500).json({
        error: err instanceof Error ? err.message : 'server_error',
        ...((err as any)?.status===428?{requiredRole:(err as any)?.requiredRole}:{}),
      });
    });

    await this.listen();
    void mobileAlerts.start();
  }

  private async listen(): Promise<void> {
    const port = Number(process.env.PORT || 2000);
    const httpsEnabled = String(process.env.HTTPS_ENABLED ?? 'true').toLowerCase() !== 'false';

    if (!httpsEnabled) {
      await new Promise<void>((resolve) =>
        (()=>{const server=http.createServer(this.app);this.messagingSocket.attach(server);return server;})().listen(port, '0.0.0.0', () => {
          console.log(`[HTTP] GoDirect listening on http://localhost:${port}`);
          resolve();
        }),
      );
      return;
    }

    // Same default SSL layout as the previous Boatify server.
    const keyPath = process.env.SSL_KEY || './sslKeys/kamli.net/alldigitalnetwork.com.key';
    const certPath = process.env.SSL_CERT || './sslKeys/kamli.net/alldigitalnetwork.com.crt';
    const caPath = process.env.SSL_CA || './sslKeys/kamli.net/GandiCert.pem';

    if (!fs.existsSync(keyPath)) throw new Error(`SSL key not found: ${keyPath}`);
    if (!fs.existsSync(certPath)) throw new Error(`SSL certificate not found: ${certPath}`);

    const options: https.ServerOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    if (caPath && fs.existsSync(caPath)) options.ca = fs.readFileSync(caPath);

    await new Promise<void>((resolve) =>
      (()=>{const server=https.createServer(options,this.app);this.messagingSocket.attach(server);return server;})().listen(port, '0.0.0.0', () => {
        console.log(`[HTTPS] GoDirect listening on https://localhost:${port}`);
        resolve();
      }),
    );

    const httpPort = Number(process.env.HTTP_PORT || port + 1);
    const redirect = express();
    redirect.use((req, res) => {
      const host = (req.headers.host || `localhost:${httpPort}`).replace(/:\d+$/, `:${port}`);
      res.redirect(301, `https://${host}${req.originalUrl}`);
    });
    http.createServer(redirect).listen(httpPort, '0.0.0.0', () =>
      console.log(`[HTTP] redirect http://localhost:${httpPort} -> HTTPS ${port}`),
    );
  }

  private asyncRoute(handler: (req: Request, res: Response) => unknown) {
    return (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(handler(req, res)).catch(next);
  }
}
