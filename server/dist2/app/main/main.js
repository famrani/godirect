import { AccountAccessService } from '../services/account-access.service.js';
import { ListingBillingService } from '../services/listing-billing.service.js';
import { FirebaseService } from '../services/firebase.service.js';
import { AssetsService } from '../services/assets.service.js';
import { BookingsService } from '../services/bookings.service.js';
import { StripeService } from '../services/stripe.service.js';
import { OwnersService } from '../services/owners.service.js';
import { PaymentsService } from '../services/payments.service.js';
import { ReviewsService } from '../services/reviews.service.js';
import { WebServerComponent } from '../components/webServer.component.js';
import { MediaService } from '../services/media.service.js';
export class MainComponent {
    async start() {
        console.log('[GoDirect] initializing...');
        const firebase = new FirebaseService();
        await firebase.initFirebase();
        const stripe = new StripeService(firebase);
        const assets = new AssetsService(firebase);
        const bookings = new BookingsService(firebase, undefined, stripe.cancellations);
        const owners = new OwnersService(firebase, stripe);
        const payments = new PaymentsService(firebase, stripe);
        const reviews = new ReviewsService(firebase);
        const media = new MediaService(firebase);
        const billing = new ListingBillingService(firebase);
        await billing.init();
        const web = new WebServerComponent(assets, bookings, owners, payments, reviews, stripe, media, billing, new AccountAccessService(firebase));
        await web.initWebServer();
        console.log('[GoDirect] ready');
    }
}

//# sourceMappingURL=main.js.map
